import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de usuario requerido",
        },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const userResult = await query(
      `SELECT id FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario no encontrado",
        },
        { status: 404 }
      );
    }

    // Obtener el historial de reservas del usuario
    const bookingHistory = await query(
      `
        SELECT 
          b.*,
          p.title as property_title,
          p.location->>'address' as property_address,
          p.location->>'city' as property_city,
          u.first_name || ' ' || u.last_name as user_name
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        JOIN users u ON b.guest_id = u.id
        WHERE b.guest_id = $1
        ORDER BY b.created_at DESC
      `,
      [userId]
    );

    const formattedHistory = bookingHistory.map((booking) => ({
      id: booking.id,
      propertyId: booking.property_id,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      guests: booking.guests,
      totalPrice: parseFloat(booking.total_price),
      status: booking.status,
      createdAt: booking.created_at,
      propertyTitle: booking.property_title,
      propertyAddress: booking.property_address,
      propertyCity: booking.property_city,
      userName: booking.user_name,
    }));

    return NextResponse.json({
      success: true,
      bookings: formattedHistory,
    });
  } catch (error) {
    console.error("Error al obtener historial de reservas:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
