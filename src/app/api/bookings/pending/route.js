import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request) {
  try {
    const hostResult = await query(`
      SELECT id FROM users WHERE is_host = true LIMIT 1
    `);

    if (hostResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario anfitrión no encontrado",
        },
        { status: 404 }
      );
    }

    const hostId = hostResult[0].id;

    // Obtener reservas pendientes para el anfitrión
    const pendingBookings = await query(
      `
        SELECT 
          b.*,
          p.title as property_title,
          g.first_name || ' ' || g.last_name as guest_name,
          h.first_name || ' ' || h.last_name as host_name
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        JOIN users g ON b.guest_id = g.id
        JOIN users h ON p.host_id = h.id
        WHERE b.status = 'pending'
        ORDER BY b.created_at DESC
      `
    );

    const formattedBookings = pendingBookings.map((booking) => ({
      id: booking.id,
      propertyId: booking.property_id,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      guests: booking.guests,
      totalPrice: parseFloat(booking.total_price),
      status: booking.status,
      createdAt: booking.created_at,
      propertyTitle: booking.property_title,
      guestName: booking.guest_name,
      hostName: booking.host_name,
    }));

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("Error al obtener reservas pendientes:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
