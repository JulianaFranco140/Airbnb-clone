"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import BookingForm from "@/components/booking/BookingForm";
import styles from "./property.module.css";

export default function PropertyPage() {
  const params = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data.property);
        } else {
          setError("Propiedad no encontrada");
        }
        setLoading(false);
      } catch (error) {
        setError("Error al cargar la propiedad");
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>
          <p>Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Header de la propiedad */}
          <div className={styles.propertyHeader}>
            <h1 className={styles.title}>{property.title}</h1>
            <div className={styles.location}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 0C5.24 0 3 2.24 3 5c0 1.17.36 2.25.97 3.15L8 14l4.03-5.85C12.64 7.25 13 6.17 13 5c0-2.76-2.24-5-5-5zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                  fill="#666"
                />
              </svg>
              {property.location.city}, {property.location.country}
            </div>
          </div>

          {/* Galería de imágenes */}
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              <img
                src={property.images[0]}
                alt={property.title}
                className={styles.image}
              />
            </div>
            {property.images.length > 1 && (
              <div className={styles.imageGrid}>
                {property.images.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} - ${index + 2}`}
                    className={styles.gridImage}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Contenido principal */}
          <div className={styles.content}>
            <div className={styles.propertyInfo}>
              <div className={styles.hostInfo}>
                <h2>
                  Alojamiento completo anfitrionado por {property.hostName}
                </h2>
                <div className={styles.propertyDetails}>
                  <span>{property.guests} huéspedes</span>
                  <span>•</span>
                  <span>{property.bedrooms} dormitorios</span>
                  <span>•</span>
                  <span>{property.bathrooms} baños</span>
                </div>
                {property.rating && (
                  <div className={styles.rating}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 12.4l-4.2 2.6 1.1-4.8L1 6.6l4.9-.4L8 1.6l2.1 4.6 4.9.4-3.9 3.6 1.1 4.8L8 12.4z"
                        fill="#FFD700"
                      />
                    </svg>
                    <span>{property.rating}</span>
                    <span>({property.reviewCount} reseñas)</span>
                  </div>
                )}
              </div>

              <div className={styles.description}>
                <h3>Descripción</h3>
                <p>{property.description}</p>
              </div>

              {/* Comodidades */}
              {property.amenities && property.amenities.length > 0 && (
                <div className={styles.amenities}>
                  <h3>Comodidades</h3>
                  <div className={styles.amenitiesList}>
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className={styles.amenity}>
                        <span>✓</span>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Formulario de reserva */}
            <div className={styles.bookingContainer}>
              <BookingForm property={property} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
