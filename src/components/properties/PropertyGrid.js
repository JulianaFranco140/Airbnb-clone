'use client';

import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import EmptyState from './EmptyState';
import styles from './PropertyGrid.module.css';

export default function PropertyGrid() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí conectarás con tu API para obtener las propiedades
    // Por ahora simulamos una carga
    const fetchProperties = async () => {
      try {
        // Simular llamada API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - después esto vendrá de tu base de datos
        const mockProperties = [
          // Dejar vacío para mostrar EmptyState
        ];
        
        setProperties(mockProperties);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingGrid}>
          {Array(12).fill(0).map((_, index) => (
            <div key={index} className={styles.loadingCard}>
              <div className={styles.loadingImage}></div>
              <div className={styles.loadingText}>
                <div className={styles.loadingLine}></div>
                <div className={styles.loadingLine}></div>
                <div className={styles.loadingLine}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
