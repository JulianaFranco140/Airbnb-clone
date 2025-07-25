'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthHeader from '../../components/auth/AuthHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from './forgot-password.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email) {
      setError('Por favor, ingresa tu correo electrónico');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      
    } catch (err) {
      setError('Error al enviar el correo. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setEmail('');
    setError('');
  };

  if (isSubmitted) {
    return (
      <AuthLayout>
        <AuthHeader 
          title="Correo enviado" 
          subtitle={`Hemos enviado un enlace de recuperación a ${email}`}
        />

        <div className={styles.successContent}>
          <p className={styles.instructions}>
            Revisa tu bandeja de entrada y spam. El enlace expirará en 1 hora.
          </p>
          
          <Button variant="primary">
            <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
              Volver al login
            </Link>
          </Button>
        </div>

        <div className={styles.tryAgainLink}>
          <p>
            ¿No recibiste el correo?{' '}
            <button 
              onClick={handleTryAgain} 
              className={styles.link}
            >
              Enviar de nuevo
            </button>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthHeader 
        title="¿Olvidaste tu contraseña?" 
        subtitle="Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña"
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
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          placeholder="tu@ejemplo.com"
          required
        />

        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
        >
          Enviar enlace
        </Button>
      </form>

      <div className={styles.backLink}>
        <p>
          ¿Recordaste tu contraseña?{' '}
          <Link href="/login" className={styles.link}>
            Volver al login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
