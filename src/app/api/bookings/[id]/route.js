import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { action } = await request.json(); // 'confirm' o 'cancel'

    if (!action || !["confirm", "cancel"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Acción no válida. Debe ser 'confirm' o 'cancel'",
        },
        { status: 400 }
      );
    }

    // Verificar que la reserva existe y está pendiente
    const booking = await query(
      `
        SELECT 
          b.*,
          p.title as property_title,
          p.host_id,
          g.first_name || ' ' || g.last_name as guest_name,
          h.first_name || ' ' || h.last_name as host_name
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        JOIN users g ON b.guest_id = g.id
        JOIN users h ON p.host_id = h.id
        WHERE b.id = $1 AND b.status = 'pending'
      `,
      [id]
    );

    if (booking.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Reserva no encontrada o ya procesada",
        },
        { status: 404 }
      );
    }

    const bookingData = booking[0];
    let newStatus;
    let message;

    if (action === "confirm") {
      // Verificar nuevamente disponibilidad antes de confirmar
      const conflictingBookings = await query(
        `
          SELECT id 
          FROM bookings 
          WHERE property_id = $1 
          AND id != $2
          AND status = 'confirmed'
          AND NOT (check_out <= $3 OR check_in >= $4)
        `,
        [
          bookingData.property_id,
          id,
          bookingData.check_in,
          bookingData.check_out,
        ]
      );

      if (conflictingBookings.length > 0) {
        // Cancelar esta reserva porque hay conflicto
        await query("UPDATE bookings SET status = $1 WHERE id = $2", [
          "cancelled",
          id,
        ]);

        return NextResponse.json(
          {
            success: false,
            message:
              "No se pudo confirmar la reserva. Las fechas ya no están disponibles.",
          },
          { status: 409 }
        );
      }

      newStatus = "confirmed";
      message = "Reserva confirmada exitosamente";
    } else {
      newStatus = "cancelled";
      message = "Reserva cancelada exitosamente";
    }

    // Actualizar el estado de la reserva
    const updatedBooking = await query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [newStatus, id]
    );

    return NextResponse.json({
      success: true,
      message,
      booking: {
        id: updatedBooking[0].id,
        status: updatedBooking[0].status,
        propertyTitle: bookingData.property_title,
        guestName: bookingData.guest_name,
        hostName: bookingData.host_name,
      },
    });
  } catch (error) {
    console.error("Error al actualizar reserva:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
