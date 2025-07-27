import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { query } from '../../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();

    const { firstName, lastName, email, password } = body;

    // Validaciones básicas
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Validar contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email' },
        { status: 409 }
      );
    }

    // Hashear contraseña
    const saltRounds = 12;
    const passwordHash = await bcryptjs.hash(password, saltRounds);

    // Crear usuario
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, first_name, last_name, is_host, is_verified`,
      [email.toLowerCase(), passwordHash, firstName, lastName]
    );

    const newUser = result[0];

    // Preparar datos del usuario
    const userData = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      isHost: newUser.is_host,
      isVerified: newUser.is_verified
    };

    // Respuesta simple
    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: userData
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
