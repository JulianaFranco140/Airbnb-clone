"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "../ui";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import styles from "./Header.module.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario logueado
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    // Logout simple
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload(); // Recargar página para limpiar estado
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logoLink}>
          <Logo size="large" />
        </Link>

        {/* Barra de búsqueda - Centro */}
        <SearchBar />

        {/* Enlaces de navegación */}
        <nav className={styles.nav}>
          <Link href="/reservas" className={styles.navLink}>
            Reservas
          </Link>
          <Link href="/host" className={styles.navLink}>
            Pon tu espacio en Airbnb
          </Link>
        </nav>

        {/* Menu de usuario - Derecha */}
        <UserMenu user={user} onLogout={handleLogout} loading={loading} />
      </div>
    </header>
  );
}
