'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/layout/Header';
import styles from './profile.module.css';
import Button from '../../components/ui/Button';

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return null;

  return (
    <>
      <Header />
      <div className={styles.container}>
      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mi Perfil</h1>
        </div>

        {/* Profile Header Card */}
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <div className={styles.avatarLarge}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
              ) : (
                <span>{user.firstName ? user.firstName[0].toUpperCase() : 'U'}</span>
              )}
            </div>
            <div className={styles.userDetails}>
              <h2 className={styles.userName}>{user.firstName} {user.lastName}</h2>
              <p className={styles.userEmail}>{user.email}</p>
              <div className={styles.userBadges}>
                <span className={styles.badge}>
                  {user.isHost ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1L10.5 6H16L11.5 9.5L13 15L8 12L3 15L4.5 9.5L0 6H5.5L8 1Z" fill="currentColor"/>
                      </svg>
                      Anfitrión
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM14 12a6 6 0 00-12 0v2h12v-2z" fill="currentColor"/>
                      </svg>
                      Huésped
                    </>
                  )}
                </span>
                {user.isVerified && (
                  <span className={styles.badge}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" fill="currentColor"/>
                    </svg>
                    Verificado
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className={styles.profileGrid}>
          <div className={styles.infoCard}>
            <h3 className={styles.cardTitle}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 10a3 3 0 100-6 3 3 0 000 6zM16 16a6 6 0 00-12 0v2h12v-2z" fill="currentColor"/>
              </svg>
              Información Personal
            </h3>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Nombre:</span>
              <span className={styles.infoValue}>{user.firstName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Apellido:</span>
              <span className={styles.infoValue}>{user.lastName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Teléfono:</span>
              <span className={styles.infoValue}>{user.phone || 'No especificado'}</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.cardTitle}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2a5 5 0 00-5 5v6l-2 2v1h14v-1l-2-2V7a5 5 0 00-5-5zM8 17a2 2 0 104 0H8z" fill="currentColor"/>
              </svg>
              Estado de la Cuenta
            </h3>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>ID de Usuario:</span>
              <span className={styles.infoValue}>#{user.id}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Tipo de Usuario:</span>
              <span className={styles.infoValue}>
                {user.isHost ? 'Anfitrión' : 'Huésped'}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Cuenta Verificada:</span>
              <span className={`${styles.infoValue} ${user.isVerified ? styles.verified : styles.unverified}`}>
                {user.isVerified ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" fill="currentColor"/>
                    </svg>
                    Verificada
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="currentColor"/>
                    </svg>
                    No verificada
                  </>
                )}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Avatar:</span>
              <span className={styles.infoValue}>
                {user.avatarUrl ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" fill="currentColor"/>
                    </svg>
                    Configurado
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="currentColor"/>
                    </svg>
                    No configurado
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className={styles.actionCards}>
          <div className={styles.actionCard}>
            <h3>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.25 6.75L10 12l-3.25-3.25 1.06-1.06L10 9.94l2.19-2.25 1.06 1.06z" fill="currentColor"/>
              </svg>
              Completa tu perfil
            </h3>
            <p>
              Tu perfil en Airbnb es una parte importante de todas las reservaciones.
              Agrega más información para que otros usuarios te conozcan mejor.
            </p>
            <div className={styles.actionList}>
              {!user.phone && (
                <div className={styles.actionItem}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="4" y="1" width="8" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <line x1="6" y1="13" x2="10" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Agregar número de teléfono
                </div>
              )}
              {!user.avatarUrl && (
                <div className={styles.actionItem}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.5 8.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" fill="currentColor"/>
                    <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v5.172l2.086-2.086a.5.5 0 01.707 0L8.5 9.793l2.914-2.914a.5.5 0 01.707 0L13 7.758V4a1 1 0 00-1-1H4z" fill="currentColor"/>
                  </svg>
                  Subir foto de perfil
                </div>
              )}
              {!user.isVerified && (
                <div className={styles.actionItem}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" fill="currentColor"/>
                  </svg>
                  Verificar cuenta
                </div>
              )}
            </div>
            <Button variant="primary" className={styles.actionButton}>
              Completar Perfil
            </Button>
          </div>

          {user.isHost && (
            <div className={styles.actionCard}>
              <h3>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1L13 7h6l-5 4 2 6-6-4-6 4 2-6-5-4h6l3-6z" fill="currentColor"/>
                </svg>
                Panel de Anfitrión
              </h3>
              <p>
                Gestiona tus propiedades, reservaciones y mantén actualizada tu información
                como anfitrión.
              </p>
              <Button variant="secondary" className={styles.actionButton}>
                Ir al Panel de Host
              </Button>
            </div>
          )}
        </div>
      </main>
      </div>
    </>
  );
}
