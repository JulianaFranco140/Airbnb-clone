'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Perfil</h2>

        <div className={styles.sidebarItemActive}>
          <div className={styles.avatarCircle}>{user.firstName[0]}</div>
          <span>Información sobre mí</span>
        </div>

        <Link href="/historial" className={styles.sidebarItem}>
          <img src="/brifcase.png" alt="Historial de reservas" className={styles.icon} />
          <span>Historial de reservas</span>
        </Link>

        <div className={styles.sidebarItem}>
          <img src="/brifcase.png" alt="Viajes anteriores" className={styles.icon} />
          <span>Viajes anteriores</span>
        </div>

        <div className={styles.sidebarItem}>
          <img src="/conexion.png" alt="Conexiones" className={styles.icon} />
          <span>Conexiones</span>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Información sobre mí</h1>
          <Button size="xs" className={styles.editButton}>Editar</Button>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.profileCard}>
            <div className={styles.avatarLarge}>{user.firstName[0]}</div>
            <h2>{user.firstName}</h2>
            <p className={styles.role}>Huésped</p>
          </div>

          <div className={styles.completeBox}>
            <h3>Completa tu perfil</h3>
            <p>
              Tu perfil en Airbnb es una parte importante de todas las reservaciones.
              Complétalo para que los demás anfitriones y huéspedes te conozcan mejor.
            </p>
            <Button>Comencemos</Button>
          </div>
        </div>

        <div className={styles.divider} />
        <p className={styles.reviews}>🗨️ Reseñas escritas por mí</p>
      </main>
    </div>
  );
}
