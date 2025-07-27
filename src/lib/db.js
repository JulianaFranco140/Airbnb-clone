import { neon } from '@neondatabase/serverless';

// Función para obtener el cliente de NeonDB
const getSql = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  return neon(process.env.DATABASE_URL);
};

export const query = async (text, params) => {
  try {
    const sql = getSql();
    
    // Para queries con parámetros, usar sql.query()
    if (params && params.length > 0) {
      const result = await sql.query(text, params);
      return result;
    } else {
      // Para queries simples, usar template literal
      const result = await sql`${sql.unsafe(text)}`;
      return result;
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const sql = getSql();
    const result = await sql`SELECT NOW() as current_time`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};
