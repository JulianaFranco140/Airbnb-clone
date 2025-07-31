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
                <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM6 14a4 4 0 00-4 4v2h16v-2a4 4 0 00-4-4H6z" fill="currentColor"/>
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
                
                <div className={styles.separator}></div>
            
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
