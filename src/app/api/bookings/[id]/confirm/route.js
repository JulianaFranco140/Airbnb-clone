import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    // Verificar que la reserva existe y está pendiente
    const booking = await query(
      "SELECT * FROM bookings WHERE id = $1 AND status = $2",
      [id, "pending"]
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

    // Verificar nuevamente disponibilidad por seguridad
    const conflictingBookings = await query(
      `SELECT id FROM bookings 
       WHERE property_id = $1 
       AND id != $2
       AND status = 'confirmed'
       AND NOT (check_out <= $3 OR check_in >= $4)`,
      [booking[0].property_id, id, booking[0].check_in, booking[0].check_out]
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

    // Confirmar la reserva
    const confirmedBooking = await query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      ["confirmed", id]
    );

    return NextResponse.json({
      success: true,
      message: "Reserva confirmada exitosamente",
      booking: {
        id: confirmedBooking[0].id,
        propertyId: confirmedBooking[0].property_id,
        checkIn: confirmedBooking[0].check_in,
        checkOut: confirmedBooking[0].check_out,
        guests: confirmedBooking[0].guests,
        totalPrice: parseFloat(confirmedBooking[0].total_price),
        status: confirmedBooking[0].status,
        createdAt: confirmedBooking[0].created_at,
      },
    });
  } catch (error) {
    console.error("Error confirmando reserva:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
