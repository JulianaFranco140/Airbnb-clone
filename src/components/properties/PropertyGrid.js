'use client';

import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import styles from './PropertyGrid.module.css';

export default function PropertyGrid() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          setProperties(data.properties);
        setLoading(false);
        }
      } catch (error) {
        setError('Error obteniendo las propiedades.');
        setLoading(false);
      }
    }

    fetchProperties();

  }, []);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <h2>No se encontraron propiedades</h2>
          <p>Intenta ajustar tus filtros de búsqueda</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Propiedades disponibles</h2>
      <div className={styles.grid}>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
