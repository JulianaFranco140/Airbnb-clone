import { config } from 'dotenv';
import { query, testConnection } from '../src/lib/db.js';

// Cargar variables de entorno desde .env.local
config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL no encontrada en .env.local');
  process.exit(1);
}

async function setupDatabase() {
  try {
    console.log('🔄 Iniciando configuración de base de datos...');
    
    // 1. Verificar conexión
    console.log('📡 Verificando conexión...');
    await testConnection();
    
    // 2. Crear tablas
    console.log('🏗️  Creando tablas...');
    await createTables();
    
    // 3. Insertar datos de ejemplo
    console.log('📊 Insertando datos de ejemplo...');
    await insertSampleData();
    
    console.log('✅ Base de datos configurada exitosamente');
  } catch (error) {
    console.error('❌ Error configurando base de datos:', error);
    process.exit(1);
  }
}

async function createTables() {
  // Crear tabla users
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255),
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      avatar_url TEXT,
      is_host BOOLEAN DEFAULT false,
      is_verified BOOLEAN DEFAULT false,
      provider VARCHAR(50) DEFAULT 'local',
      provider_id VARCHAR(255),
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ Tabla users creada');

  // Crear tabla properties
  await query(`
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      property_type VARCHAR(50) NOT NULL,
      room_type VARCHAR(50) NOT NULL,
      location JSONB NOT NULL,
      price_per_night NUMERIC(10,2) NOT NULL,
      guests INTEGER NOT NULL,
      bedrooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      amenities JSONB DEFAULT '[]'::jsonb,
      images JSONB DEFAULT '[]'::jsonb,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ Tabla properties creada');

  // Crear tabla bookings
  await query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      guest_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      guests INTEGER NOT NULL,
      total_price NUMERIC(10,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ Tabla bookings creada');

  // Crear tabla favorites
  await query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, property_id)
    );
  `);
  console.log('✓ Tabla favorites creada');

  // Crear tabla reviews
  await query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
      reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ Tabla reviews creada');
}

async function insertSampleData() {
  // Insertar usuarios de ejemplo
  await query(`
    INSERT INTO users (email, first_name, last_name, is_host) 
    VALUES 
      ('ana.garcia@email.com', 'Ana', 'García', true),
      ('carlos.ruiz@email.com', 'Carlos', 'Ruiz', true),
      ('maria.lopez@email.com', 'María', 'López', true),
      ('jose.martinez@email.com', 'José', 'Martínez', true),
      ('usuario.demo@email.com', 'Usuario', 'Demo', false)
    ON CONFLICT (email) DO NOTHING
    RETURNING id;
  `);
  console.log('✓ Usuarios de ejemplo insertados');

  // Obtener los IDs de usuarios existentes
  const existingUsers = await query(`
    SELECT id FROM users WHERE is_host = true ORDER BY id LIMIT 4;
  `);

  if (existingUsers.length === 0) {
    console.log('❌ No hay usuarios hosts disponibles');
    return;
  }

  // Usar los IDs reales de usuarios existentes
  const hostIds = existingUsers.map(user => user.id);

  // Insertar propiedades de ejemplo usando los IDs reales
  await query(`
    INSERT INTO properties (
      host_id, title, property_type, room_type, location, 
      price_per_night, guests, bedrooms, bathrooms, images
    ) VALUES 
      (
        ${hostIds[0]},
        'Apartamento moderno en Zona Rosa',
        'Apartment',
        'Entire place',
        '{"city": "Bogotá", "country": "Colombia", "address": "Zona Rosa"}',
        150000,
        4,
        2,
        1,
        '["https://blogdesarrolladores.lahaus.com/hubfs/Fotos_La_haus__10_.jpg"]'
      ),
      (
        ${hostIds[1] || hostIds[0]},
        'Casa campestre con piscina',
        'House',
        'Entire place',
        '{"city": "Medellín", "country": "Colombia", "address": "Casa campestre"}',
        200000,
        6,
        3,
        2,
        '["https://cf.bstatic.com/xdata/images/hotel/max1024x768/294678081.jpg?k=a27810f867cc7c765212bc362107e66dd19f9cc5f98e8273e2e5705653ffc5f9&o=&hp=1"]'
      ),
      (
        ${hostIds[2] || hostIds[0]},
        'Loft en el centro histórico',
        'Loft',
        'Entire place',
        '{"city": "Cartagena", "country": "Colombia", "address": "Centro histórico"}',
        180000,
        2,
        1,
        1,
        '["https://cf.bstatic.com/xdata/images/hotel/max1024x768/629378366.jpg?k=e5c96e80cf4d2ce1e834fc3ffae6f0e1423e9408a4fc4b31fffae84f3e8ed919&o=&hp=1"]'
      ),
      (
        ${hostIds[3] || hostIds[0]},
        'Apartamento con vista al mar',
        'Apartment',
        'Entire place',
        '{"city": "Santa Marta", "country": "Colombia", "address": "Vista al mar"}',
        220000,
        4,
        2,
        2,
        '["https://cf.bstatic.com/xdata/images/hotel/max1024x768/438671051.jpg?k=c728fc88775ecbdce251b42b4f21a7ab359ee5955994baf5bca6f29b81cfc488&o=&hp=1"]'
      )
    ON CONFLICT DO NOTHING;
  `);
  console.log('✓ Propiedades de ejemplo insertadas');

  // Obtener las propiedades insertadas para las reviews
  const properties = await query(`
    SELECT id FROM properties ORDER BY id LIMIT 4;
  `);
  
  // Obtener un usuario no-host para las reviews
  const reviewer = await query(`
    SELECT id FROM users WHERE is_host = false LIMIT 1;
  `);

  if (properties.length > 0 && reviewer.length > 0) {
    const reviewerId = reviewer[0].id;
    
    // Insertar algunas reviews de ejemplo
    await query(`
      INSERT INTO reviews (reviewer_id, property_id, rating, comment) 
      VALUES 
        (${reviewerId}, ${properties[0].id}, 5, 'Excelente apartamento, muy limpio y bien ubicado'),
        (${reviewerId}, ${properties[0].id}, 4, 'Muy buena experiencia, recomendado'),
        (${reviewerId}, ${properties[1] ? properties[1].id : properties[0].id}, 5, 'La casa es hermosa y la piscina increíble'),
        (${reviewerId}, ${properties[2] ? properties[2].id : properties[0].id}, 4, 'Loft muy bonito en el centro histórico'),
        (${reviewerId}, ${properties[3] ? properties[3].id : properties[0].id}, 5, 'Vista al mar espectacular')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✓ Reviews de ejemplo insertadas');
  }
}

// Ejecutar el setup
setupDatabase();
