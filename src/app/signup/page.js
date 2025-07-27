'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthHeader from '../../components/auth/AuthHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from './signup.module.css';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones SIMPLES
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Por favor, completa todos los campos');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Registro simple con PostgreSQL
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        const { user } = await response.json();
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/');
      } else {
        const { error } = await response.json();
        setError(error || 'Error al registrarse');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthHeader 
        title="Crear cuenta"
        subtitle="¡Te damos la bienvenida a Airbnb!"
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.nameFields}>
          <Input
            label="Nombre"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Tu nombre"
            required
            className={styles.halfWidth}
          />

          <Input
            label="Apellido"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Tu apellido"
            required
            className={styles.halfWidth}
          />
        </div>

        <Input
          label="Correo electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="tu@ejemplo.com"
          required
        />

        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          required
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="••••••••"
          required
        />

        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          Crear cuenta
        </Button>
      </form>

      <div className={styles.loginLink}>
        <p>
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className={styles.link}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </>
  );
}
