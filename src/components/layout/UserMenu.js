'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './UserMenu.module.css';

export default function UserMenu({ user, onLogout, loading }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  if (loading) {
    return (
      <div className={styles.userMenuContainer}>
        <div className={styles.loadingSkeleton}></div>
      </div>
    );
  }

  return (
    <div className={styles.userMenuContainer}>
      {/* Botón "Pon tu espacio en Airbnb" */}
      <Link href="/host" className={styles.hostLink}>
        Pon tu espacio en Airbnb
      </Link>

      {/* Selector de idioma */}
      <button className={styles.languageButton}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zM8 13.93c-.61-.35-1.16-.89-1.56-1.56-.3-.51-.53-1.07-.68-1.67h4.48c-.15.6-.38 1.16-.68 1.67-.4.67-.95 1.21-1.56 1.56zM5.05 10.7c-.14-.54-.22-1.11-.22-1.7s.08-1.16.22-1.7h5.9c.14.54.22 1.11.22 1.7s-.08 1.16-.22 1.7H5.05zM2.5 8c0-.59.08-1.16.22-1.7h4.48c-.15-.6-.38-1.16-.68-1.67C5.95 4.11 5.39 3.57 4.78 3.22 3.39 4.39 2.5 6.09 2.5 8zm6.22-4.78c.61.35 1.16.89 1.56 1.56.3.51.53 1.07.68 1.67H6.48c.15-.6.38-1.16.68-1.67.4-.67.95-1.21 1.56-1.56zM13.5 8c0-1.91-.89-3.61-2.28-4.78.61.35 1.16.89 1.56 1.56.3.51.53 1.07.68 1.67h1.7c-.14-.59-.22-1.16-.22-1.7-.58-1.16-1.4-2.17-2.37-2.93z" fill="currentColor"/>
        </svg>
      </button>

      {/* Menu de usuario */}
      <div className={styles.userMenu} ref={menuRef}>
        <button 
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={styles.menuIcon}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className={styles.userIcon}>
            {user ? (
              user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.firstName} className={styles.avatar} />
              ) : (
                <div className={styles.userInitials}>
                  {user.firstName?.charAt(0)?.toUpperCase()}{user.lastName?.charAt(0)?.toUpperCase()}
                </div>
              )
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C6.69 2 4 4.69 4 8c0 1.02.26 1.98.72 2.83L10 18l5.28-7.17c.46-.85.72-1.81.72-2.83 0-3.31-2.69-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor"/>
              </svg>
            )}
          </div>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className={styles.dropdown}>
            {user ? (
              <>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>
                    {user.firstName} {user.lastName}
                  </div>
                  <div className={styles.userEmail}>
                    {user.email}
                  </div>
                </div>
                <div className={styles.separator}></div>
                <Link href="/profile" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                  Perfil
                </Link>
                <Link href="/trips" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                  Viajes
                </Link>
                <Link href="/wishlists" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                  Lista de deseos
                </Link>
                <div className={styles.separator}></div>
                <Link href="/host" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                  Pon tu espacio en Airbnb
                </Link>
                {user.isHost && (
                  <Link href="/host/homes" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                    Gestiona tus alojamientos
                  </Link>
                )}
                <div className={styles.separator}></div>
                <button className={styles.menuItem} onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                  Iniciar sesión
                </Link>
                <Link href="/signup" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                  Registrarse
                </Link>
                <div className={styles.separator}></div>
                <Link href="/host" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                  Pon tu espacio en Airbnb
                </Link>
                <Link href="/help" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                  Centro de ayuda
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
