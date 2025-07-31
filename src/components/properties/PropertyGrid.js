'use client';

import { useState, useEffect, useCallback } from 'react';
import PropertyCard from './PropertyCard';
import styles from './PropertyGrid.module.css';

export default function PropertyGrid({ searchFilters }) {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const buildQueryParams = useCallback((filters) => {
    if (!filters) return '';
    
    const params = new URLSearchParams();
    
    if (filters.destination && filters.destination.trim()) {
      params.append('destination', filters.destination.trim());
    }
    
    if (filters.checkIn) {
      params.append('checkIn', filters.checkIn);
    }
    
    if (filters.checkOut) {
      params.append('checkOut', filters.checkOut);
    }
    
    if (filters.guests && filters.guests > 1) {
      params.append('guests', filters.guests.toString());
    }
    
    return params.toString() ? `?${params.toString()}` : '';
  }, []);

  const fetchProperties = useCallback(async (filters = null) => {
    try {
      setLoading(true);
      const queryParams = buildQueryParams(filters);
      const response = await fetch(`/api/properties${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al cargar propiedades');
        setProperties([]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Error obteniendo las propiedades.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  // Efecto para cargar propiedades iniciales
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Efecto para aplicar filtros cuando cambien
  useEffect(() => {
    if (searchFilters) {
      fetchProperties(searchFilters);
    } else if (searchFilters === null) {
      // Si searchFilters es explícitamente null, cargar todas las propiedades
      fetchProperties();
    }
  }, [searchFilters, fetchProperties]);

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
      <h2 className={styles.title}>
        {searchFilters?.destination 
          ? `Propiedades en ${searchFilters.destination}` 
          : 'Todas las propiedades disponibles'
        }
      </h2>
      <div className={styles.grid}>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
