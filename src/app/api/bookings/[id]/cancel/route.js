import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    // Verificar que la reserva existe y está pendiente o confirmada
    const booking = await query(
      "SELECT * FROM bookings WHERE id = $1 AND status IN ($2, $3)",
      [id, "pending", "confirmed"]
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

    // Cancelar la reserva
    const cancelledBooking = await query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      ["cancelled", id]
    );

    return NextResponse.json({
      success: true,
      message: "Reserva cancelada exitosamente",
      booking: {
        id: cancelledBooking[0].id,
        propertyId: cancelledBooking[0].property_id,
        checkIn: cancelledBooking[0].check_in,
        checkOut: cancelledBooking[0].check_out,
        guests: cancelledBooking[0].guests,
        totalPrice: parseFloat(cancelledBooking[0].total_price),
        status: cancelledBooking[0].status,
        createdAt: cancelledBooking[0].created_at,
      },
    });
  } catch (error) {
    console.error("Error cancelando reserva:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
