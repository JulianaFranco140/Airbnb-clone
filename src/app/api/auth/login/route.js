import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { query } from '../../../../lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario en la base de datos
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verificar contraseña
    if (!user.password_hash) {
      return NextResponse.json(
        { error: 'Este usuario fue registrado con redes sociales' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Preparar datos del usuario (sin password) - SIN JWT
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      avatarUrl: user.avatar_url,
      isHost: user.is_host,
      isVerified: user.is_verified
    };

    // Respuesta SÚPER simple
    return NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
