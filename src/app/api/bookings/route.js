import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const { propertyId, checkIn, checkOut, guests, totalPrice, userId } =
      await request.json();

    // Validaciones básicas
    if (!propertyId || !checkIn || !checkOut || !guests || !totalPrice || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Todos los campos son requeridos",
        },
        { status: 400 }
      );
    }

    // Validar fechas
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return NextResponse.json(
        {
          success: false,
          message: "La fecha de entrada no puede ser anterior a hoy",
        },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "La fecha de salida debe ser posterior a la fecha de entrada",
        },
        { status: 400 }
      );
    }

    // Verificar que la propiedad existe y está activa
    const propertyCheck = await query(
      `
            SELECT id, guests, is_active, price_per_night 
            FROM properties 
            WHERE id = $1 AND is_active = true
        `,
      [propertyId]
    );

    if (propertyCheck.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Propiedad no encontrada o no disponible",
        },
        { status: 404 }
      );
    }

    const property = propertyCheck[0];

    // Validar número de huéspedes
    if (guests > property.guests) {
      return NextResponse.json(
        {
          success: false,
          message: `Esta propiedad permite máximo ${property.guests} huéspedes`,
        },
        { status: 400 }
      );
    }

    // Verificar disponibilidad (no hay reservas pendientes o confirmadas en las mismas fechas)
    const conflictingBookings = await query(
      `
            SELECT id 
            FROM bookings 
            WHERE property_id = $1 
            AND status IN ('pending', 'confirmed')
            AND (
              (check_in <= $2 AND check_out > $2) OR
              (check_in < $3 AND check_out >= $3) OR
              (check_in >= $2 AND check_out <= $3)
            )
        `,
      [propertyId, checkIn, checkOut]
    );

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Las fechas seleccionadas no están disponibles",
        },
        { status: 409 }
      );
    }

    // Verificar que el usuario existe y está activo
    const guestResult = await query(
      `SELECT id, first_name, last_name, email FROM users WHERE id = $1`,
      [userId]
    );

    if (guestResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario no encontrado",
        },
        { status: 404 }
      );
    }

    const guestId = guestResult[0].id;

    // Crear la reserva
    const booking = await query(
      `
            INSERT INTO bookings (property_id, guest_id, check_in, check_out, guests, total_price, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'pending')
            RETURNING *
        `,
      [propertyId, guestId, checkIn, checkOut, guests, totalPrice]
    );

    // Obtener información adicional para la respuesta
    const bookingDetails = await query(
      `
            SELECT 
                b.*,
                p.title as property_title,
                ph.first_name || ' ' || ph.last_name as host_name,
                g.first_name || ' ' || g.last_name as guest_name
            FROM bookings b
            JOIN properties p ON b.property_id = p.id
            JOIN users ph ON p.host_id = ph.id
            JOIN users g ON b.guest_id = g.id
            WHERE b.id = $1
        `,
      [booking[0].id]
    );

    const bookingInfo = bookingDetails[0];

    return NextResponse.json({
      success: true,
      message: "Reserva creada exitosamente",
      booking: {
        id: bookingInfo.id,
        propertyId: bookingInfo.property_id,
        checkIn: bookingInfo.check_in,
        checkOut: bookingInfo.check_out,
        guests: bookingInfo.guests,
        totalPrice: parseFloat(bookingInfo.total_price),
        status: bookingInfo.status,
        createdAt: bookingInfo.created_at,
        propertyTitle: bookingInfo.property_title,
        hostName: bookingInfo.host_name,
        guestName: bookingInfo.guest_name,
      },
    });
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
