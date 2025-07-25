# 🚀 GUÍA PARA EL EQUIPO - AIRBNB CLONE SIMPLE

## 📂 ESTRUCTURA DEL PROYECTO

```
src/
├── app/                     🏠 PÁGINAS (Next.js App Router)
├── components/             🧩 COMPONENTES REUTILIZABLES  
└── lib/                    🗄️ BASE DE DATOS
```

## 🎯 CONCEPTOS BÁSICOS (Lo que necesitas saber)

### ✅ **QUE SÍ USAMOS** (Fácil):
- `useState` - Para manejar estados simples
- `useEffect` - Para ejecutar código al cargar componentes
- `fetch` - Para llamar APIs
- `localStorage` - Para guardar datos del usuario
- CSS Modules - Para estilos organizados

### ❌ **QUE NO USAMOS** (Complicado):
- JWT tokens
- Hooks personalizados complejos
- Context API
- Servicios complicados

## 🛠️ CÓMO TRABAJAR

### 1️⃣ **AGREGAR NUEVA PÁGINA**

**Paso 1:** Crear archivo en `src/app/mi-pagina/page.js`
```javascript
'use client';
import { useState } from 'react';

export default function MiPagina() {
  const [dato, setDato] = useState('');
  
  return (
    <div>
      <h1>Mi Nueva Página</h1>
      <p>{dato}</p>
    </div>
  );
}
```

**Paso 2:** Acceder en `http://localhost:3001/mi-pagina`

### 2️⃣ **CREAR COMPONENTE NUEVO**

**Paso 1:** Crear archivo en `src/components/ui/MiComponente.js`
```javascript
import styles from './MiComponente.module.css';

export default function MiComponente({ titulo, onClick }) {
  return (
    <button className={styles.boton} onClick={onClick}>
      {titulo}
    </button>
  );
}
```

**Paso 2:** Crear CSS en `src/components/ui/MiComponente.module.css`
```css
.boton {
  background: #ff385c;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.boton:hover {
  background: #e31c5f;
}
```

**Paso 3:** Usar en cualquier página
```javascript
import MiComponente from '../components/ui/MiComponente';

export default function PaginaEjemplo() {
  const manejarClick = () => {
    alert('¡Hola!');
  };

  return (
    <div>
      <MiComponente titulo="Click aquí" onClick={manejarClick} />
    </div>
  );
}
```

### 3️⃣ **TRABAJAR CON AUTENTICACIÓN**

**Verificar si usuario está logueado:**
```javascript
'use client';
import { useState, useEffect } from 'react';

export default function MiComponente() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario logueado
    const datosUsuario = localStorage.getItem('user');
    if (datosUsuario) {
      setUsuario(JSON.parse(datosUsuario));
    }
    setCargando(false);
  }, []);

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      {usuario ? (
        <p>¡Hola {usuario.firstName}!</p>
      ) : (
        <p>No estás logueado</p>
      )}
    </div>
  );
}
```

### 4️⃣ **LLAMAR A LA BASE DE DATOS**

**Crear nueva API en `src/app/api/mi-api/route.js`:**
```javascript
import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM users LIMIT 10');
    return NextResponse.json({ users: result.rows });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error en la base de datos' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { nombre, email } = await request.json();
    
    const result = await query(
      'INSERT INTO users (first_name, email) VALUES ($1, $2) RETURNING *',
      [nombre, email]
    );
    
    return NextResponse.json({ usuario: result.rows[0] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}
```

**Llamar a la API desde el frontend:**
```javascript
const obtenerUsuarios = async () => {
  const response = await fetch('/api/mi-api');
  const data = await response.json();
  console.log(data.users);
};

const crearUsuario = async (nombre, email) => {
  const response = await fetch('/api/mi-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email })
  });
  const data = await response.json();
  console.log(data.usuario);
};
```

## 🗄️ BASE DE DATOS (PostgreSQL)

### **Conexión configurada en `src/lib/db.js`**
- Ya está conectado a NeonDB
- Solo usar `query(sql, params)` para hacer consultas

### **Tablas disponibles:**
- `users` - Usuarios registrados
- `properties` - Propiedades de Airbnb
- `bookings` - Reservas
- `reviews` - Reseñas
- `favorites` - Favoritos

### **Ejemplo de consultas:**
```javascript
// Obtener todos los usuarios
const users = await query('SELECT * FROM users');

// Buscar usuario por email
const user = await query('SELECT * FROM users WHERE email = $1', [email]);

// Crear nueva propiedad
const property = await query(
  'INSERT INTO properties (title, description, host_id) VALUES ($1, $2, $3) RETURNING *',
  [title, description, hostId]
);
```

## 🎨 ESTILOS (CSS Modules)

### **Usar estilos de Airbnb:**
En tu CSS, puedes usar las variables ya definidas:
```css
.miBoton {
  background: var(--airbnb-red);        /* #ff385c */
  color: white;
  border: 1px solid var(--airbnb-border); /* #dddddd */
  border-radius: 8px;
  padding: 12px 24px;
}

.miBoton:hover {
  background: var(--airbnb-red-dark);   /* #e31c5f */
}
```

### **Colores disponibles:**
- `--airbnb-red` - Rojo principal de Airbnb
- `--airbnb-red-dark` - Rojo más oscuro
- `--airbnb-black` - Negro de Airbnb
- `--airbnb-gray` - Gris de Airbnb
- `--airbnb-light-gray` - Gris claro
- `--airbnb-border` - Color de bordes

## 🚀 COMANDOS ÚTILES

```bash
# Iniciar el proyecto
npm run dev

# Instalar nueva dependencia
npm install nombre-del-paquete

# Ver logs de la base de datos
# (Revisar la consola del navegador en Network tab)
```

## 📝 TIPS PARA EL EQUIPO

1. **🔄 Siempre usa `'use client';`** al inicio de componentes que usen `useState` o `useEffect`

2. **📁 Organización de archivos:**
   - Páginas → `src/app/`
   - Componentes → `src/components/`
   - CSS → Mismo nombre que el componente + `.module.css`

3. **🎯 Estados simples:**
   ```javascript
   const [datos, setDatos] = useState([]);
   const [cargando, setCargando] = useState(false);
   const [error, setError] = useState('');
   ```

4. **🔍 Debugging:**
   - Usar `console.log()` para ver qué está pasando
   - Revisar la consola del navegador (F12)
   - Revisar Network tab para ver llamadas a APIs

5. **📱 Responsive:**
   - Usar CSS Grid y Flexbox
   - Probar en diferentes tamaños de pantalla

## ❗ ERRORES COMUNES

1. **"Cannot read property"** → Verificar que el estado no sea `null`
2. **"Module not found"** → Verificar la ruta del import
3. **"Hydration error"** → Asegurarse de usar `'use client';`
4. **Estilos no cargan** → Verificar que el CSS tenga extensión `.module.css`

## 🆘 CUANDO NECESITES AYUDA

1. Leer el error completo en la consola
2. Verificar que todas las importaciones estén correctas
3. Revisar que el servidor esté corriendo (`npm run dev`)
4. Preguntar al resto del equipo 😊
