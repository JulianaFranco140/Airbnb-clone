'use client';

import { useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const [activeTab, setActiveTab] = useState('stays');

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
          />
        </div>
        
        <div className={styles.separator}></div>
        
        <div className={styles.searchItem}>
          <label className={styles.label}>Llegada</label>
          <input 
            type="text" 
            placeholder="Agregar fechas"
            className={styles.input}
          />
        </div>
        
        <div className={styles.separator}></div>
        
        <div className={styles.searchItem}>
          <label className={styles.label}>Salida</label>
          <input 
            type="text" 
            placeholder="Agregar fechas"
            className={styles.input}
          />
        </div>
        
        <div className={styles.separator}></div>
        
        <div className={styles.searchItem}>
          <label className={styles.label}>Huéspedes</label>
          <input 
            type="text" 
            placeholder="Agregar huéspedes"
            className={styles.input}
          />
        </div>

        <button className={styles.searchButton}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.5 1C3.91 1 1 3.91 1 7.5S3.91 14 7.5 14 14 11.09 14 7.5 11.09 1 7.5 1ZM7.5 12.5C4.74 12.5 2.5 10.26 2.5 7.5S4.74 2.5 7.5 2.5 12.5 4.74 12.5 7.5 10.26 12.5 7.5 12.5Z" fill="white"/>
            <path d="M13.7803 12.7197L12.7197 13.7803L15.2803 16.3409L16.3409 15.2803L13.7803 12.7197Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
