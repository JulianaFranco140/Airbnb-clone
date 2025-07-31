'use client';

import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import PropertyGrid from '../components/properties/PropertyGrid';
import styles from "./page.module.css";

export default function Home() {
  const [searchFilters, setSearchFilters] = useState(null);

  useEffect(() => {
    // Verificar si hay datos de búsqueda guardados desde una redirección
    const savedSearchData = localStorage.getItem('searchData');
    if (savedSearchData) {
      try {
        const parsedData = JSON.parse(savedSearchData);
        setSearchFilters(parsedData);
        // Limpiar los datos guardados después de usarlos
        localStorage.removeItem('searchData');
      } catch (error) {
        console.error('Error parsing saved search data:', error);
        localStorage.removeItem('searchData');
      }
    }
  }, []);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  return (
    <div className={styles.page}>
      <Header onSearch={handleSearch} />
      <main className={styles.main}>
        <PropertyGrid searchFilters={searchFilters} />
      </main>
    </div>
  );
}
