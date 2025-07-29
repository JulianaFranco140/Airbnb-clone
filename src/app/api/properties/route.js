import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Extraer parámetros de búsqueda
        const destination = searchParams.get('destination');
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const guests = searchParams.get('guests');

        // Construir query base
        let sqlQuery = `
            SELECT 
                p.*,
                u.first_name || ' ' || u.last_name as host_name,
                u.avatar_url as host_avatar,
                COUNT(r.id) as review_count,
                AVG(r.rating) as average_rating
            FROM properties p
            LEFT JOIN users u ON p.host_id = u.id
            LEFT JOIN reviews r ON p.id = r.property_id
            WHERE p.is_active = true
        `;

        const queryParams = [];
        let paramIndex = 1;

        // Aplicar filtros
        if (destination) {
            sqlQuery += ` AND (
                LOWER(p.location->>'city') LIKE LOWER($${paramIndex}) OR 
                LOWER(p.location->>'country') LIKE LOWER($${paramIndex}) OR
                LOWER(p.location->>'address') LIKE LOWER($${paramIndex}) OR
                LOWER(p.title) LIKE LOWER($${paramIndex})
            )`;
            queryParams.push(`%${destination}%`);
            paramIndex++;
        }

        if (guests) {
            sqlQuery += ` AND p.guests >= $${paramIndex}`;
            queryParams.push(parseInt(guests));
            paramIndex++;
        }

        // Filtro de disponibilidad por fechas (si se proporcionan)
        if (checkIn && checkOut) {
            sqlQuery += ` AND p.id NOT IN (
                SELECT DISTINCT b.property_id 
                FROM bookings b 
                WHERE b.status IN ('confirmed', 'pending')
                AND (
                    (b.check_in <= $${paramIndex} AND b.check_out > $${paramIndex}) OR
                    (b.check_in < $${paramIndex + 1} AND b.check_out >= $${paramIndex + 1}) OR
                    (b.check_in >= $${paramIndex} AND b.check_out <= $${paramIndex + 1})
                )
            )`;
            queryParams.push(checkIn, checkOut);
            paramIndex += 2;
        }

        sqlQuery += `
            GROUP BY p.id, u.first_name, u.last_name, u.avatar_url
            ORDER BY p.created_at DESC
        `;

        const properties = await query(sqlQuery, queryParams);

        const formattedProperties = properties.map(property => ({
            id: property.id,
            title: property.title,
            description: property.description,
            propertyType: property.property_type,
            roomType: property.room_type,
            location: property.location,
            price: parseFloat(property.price_per_night),
            guests: property.guests,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            amenities: property.amenities,
            images: property.images,
            hostName: property.host_name,
            hostAvatar: property.host_avatar,
            isActive: property.is_active,
            createdAt: property.created_at,
            updatedAt: property.updated_at,
            reviewCount: parseInt(property.review_count) || 0,
            rating: property.average_rating ? parseFloat(property.average_rating).toFixed(1) : null
        }));

        return NextResponse.json({
            success: true,
            properties: formattedProperties,
            count: formattedProperties.length,
            filters: {
                destination,
                checkIn,
                checkOut,
                guests
            }
        });

    } catch (error) {
        console.error('Error al obtener propiedades:', error);
        return NextResponse.json(
          { 
            success: false,
            error: 'Error interno del servidor',
            message: 'No se pudieron obtener las propiedades'
          },
          { status: 500 }
        );
    }
}