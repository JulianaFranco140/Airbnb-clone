'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('stays');
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  // Restaurar datos de búsqueda cuando se carga el componente en la página principal
  useEffect(() => {
    if (pathname === '/') {
      const savedSearchData = localStorage.getItem('searchData');
      if (savedSearchData) {
        try {
          const parsedData = JSON.parse(savedSearchData);
          setSearchData(parsedData);
          // Activar la búsqueda automáticamente con los datos restaurados
          if (onSearch) {
            onSearch(parsedData);
          }
        } catch (error) {
          console.error('Error parsing saved search data:', error);
        }
      }
    }
  }, [pathname, onSearch]);

  const handleInputChange = (field, value) => {
    const newSearchData = {
      ...searchData,
      [field]: value
    };
    setSearchData(newSearchData);
    
    // Solo hacer búsqueda en tiempo real si estamos en la página principal
    if (onSearch && pathname === '/') {
      onSearch(newSearchData);
    }
  };

  const handleSearch = () => {
    // Si no estamos en la página principal, redirigir allí
    if (pathname !== '/') {
      // Guardar los datos de búsqueda en localStorage para transferirlos
      localStorage.setItem('searchData', JSON.stringify(searchData));
      router.push('/');
      return;
    }

    // Si estamos en la página principal, hacer la búsqueda normal
    if (onSearch) {
      onSearch(searchData);
    }
  };

  return (
    <div className={styles.searchContainer}>
      {/* Search Bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchItem}>
          <label className={styles.label}>Dónde</label>
          <input 
            type="text" 
            placeholder="Buscar destinos"
            className={styles.input}
            value={searchData.destination}
            onChange={(e) => handleInputChange('destination', e.target.value)}
          />
        </div>
        
        <div className={styles.separator}></div>
        
        <div className={styles.searchItem}>
          <label className={styles.label}>Llegada</label>
          <input 
            type="date" 
            placeholder="Agregar fechas"
            className={styles.input}
            value={searchData.checkIn}
            onChange={(e) => handleInputChange('checkIn', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className={styles.separator}></div>
        
        <div className={styles.searchItem}>
          <label className={styles.label}>Salida</label>
          <input 
            type="date" 
            placeholder="Agregar fechas"
            className={styles.input}
            value={searchData.checkOut}
            onChange={(e) => handleInputChange('checkOut', e.target.value)}
            min={searchData.checkIn || new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className={styles.separator}></div>
        
        <div className={styles.searchItem}>
          <label className={styles.label}>Huéspedes</label>
          <input 
            type="number" 
            placeholder="Agregar huéspedes"
            className={styles.input}
            value={searchData.guests}
            onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 1)}
            min="1"
            max="20"
          />
        </div>

        <button className={styles.searchButton} onClick={handleSearch}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.5 1C3.91 1 1 3.91 1 7.5S3.91 14 7.5 14 14 11.09 14 7.5 11.09 1 7.5 1ZM7.5 12.5C4.74 12.5 2.5 10.26 2.5 7.5S4.74 2.5 7.5 2.5 12.5 4.74 12.5 7.5 10.26 12.5 7.5 12.5Z" fill="white"/>
            <path d="M13.7803 12.7197L12.7197 13.7803L15.2803 16.3409L16.3409 15.2803L13.7803 12.7197Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
