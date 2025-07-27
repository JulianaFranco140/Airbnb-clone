'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthHeader from '../../components/auth/AuthHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from './login.module.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      // Login simple con PostgreSQL
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const { user } = await response.json();
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/');
      } else {
        const { error } = await response.json();
        setError(error || 'Error al iniciar sesión');
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
        title="Iniciar sesión"
        subtitle="¡Te damos la bienvenida a Airbnb!"
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

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

        <div className={styles.forgotPassword}>
          <Link href="/forgot-password" className={styles.forgotLink}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button
          type="submit"
          loading={loading}
          disabled={loading || !formData.email || !formData.password}
        >
          Continuar
        </Button>
      </form>

      <div className={styles.signupLink}>
        <p>
          ¿No tienes una cuenta?{' '}
          <Link href="/signup" className={styles.link}>
            Regístrate
          </Link>
        </p>
      </div>
    </>
  );
}
