"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Logo } from "../ui";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import styles from "./Header.module.css";

export default function Header({ onSearch }) {
  const router = useRouter();
  const pathname = usePathname();
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

  const handleLogoClick = () => {
    // Limpiar cualquier dato de búsqueda guardado
    localStorage.removeItem('searchData');
    
    // Si ya estamos en la página principal, limpiar filtros directamente
    if (pathname === '/') {
      // Enviar evento para limpiar los filtros del SearchBar
      window.dispatchEvent(new CustomEvent('clearSearchFilters', { detail: 'clearFilters' }));
      // Limpiar filtros en el componente padre
      if (onSearch) {
        onSearch(null);
      }
    } else {
      // Si estamos en otra página, navegar a la principal
      router.push('/');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <button onClick={handleLogoClick} className={styles.logoLink} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Logo size="large" />
        </button>

        {/* Barra de búsqueda - Centro */}
        <SearchBar onSearch={onSearch}/>

        {/* Enlaces de navegación */}
        <nav className={styles.nav}>
          <Link href="/reservas" className={styles.navLink}>
            Reservas
          </Link>
        </nav>

        {/* Menu de usuario - Derecha */}
        <UserMenu user={user} onLogout={handleLogout} loading={loading} />
      </div>
    </header>
  );
}
