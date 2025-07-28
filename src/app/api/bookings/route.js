import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const { propertyId, checkIn, checkOut, guests, totalPrice } =
      await request.json();

    // Validaciones básicas
    if (!propertyId || !checkIn || !checkOut || !guests || !totalPrice) {
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

    // Verificar disponibilidad (no hay reservas confirmadas en las mismas fechas)
    const conflictingBookings = await query(
      `
            SELECT id 
            FROM bookings 
            WHERE property_id = $1 
            AND status IN ('pending', 'confirmed')
            AND NOT (check_out <= $2 OR check_in >= $3)
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

    // Por simplicidad, usaremos un guest_id fijo (usuario demo)
    // En una implementación real, obtendrías esto de la sesión del usuario
    const guestResult = await query(`
            SELECT id FROM users WHERE email = 'usuario.demo@email.com' LIMIT 1
        `);

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

    return NextResponse.json({
      success: true,
      message: "Reserva creada exitosamente",
      booking: {
        id: booking[0].id,
        propertyId: booking[0].property_id,
        checkIn: booking[0].check_in,
        checkOut: booking[0].check_out,
        guests: booking[0].guests,
        totalPrice: parseFloat(booking[0].total_price),
        status: booking[0].status,
        createdAt: booking[0].created_at,
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
