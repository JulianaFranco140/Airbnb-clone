'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleNextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  return (
    <Link href={`/property/${property.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={property.images[currentImageIndex]}
          alt={property.title}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* Navigation arrows */}
        {property.images.length > 1 && (
          <>
            <button 
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrevImage}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNextImage}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}

        {/* Dots indicator */}
        {property.images.length > 1 && (
          <div className={styles.dotsContainer}>
            {property.images.map((_, index) => (
              <div
                key={index}
                className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
              />
            ))}
          </div>
        )}

        {/* Like button */}
        <button 
          className={styles.likeButton}
          onClick={handleLike}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill={isLiked ? "#ff385c" : "none"}
            stroke={isLiked ? "#ff385c" : "#ffffff"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Superhost badge */}
        {property.isSuperhost && (
          <div className={styles.superhostBadge}>
            Superanfitrión
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.location}>
          {property.location}
        </div>
        
        <div className={styles.title}>
          {property.title}
        </div>
        
        <div className={styles.dates}>
          {property.availableDates}
        </div>
        
        <div className={styles.priceContainer}>
          <span className={styles.price}>
            ${property.price}
          </span>
          <span className={styles.period}> noche</span>
        </div>

        {property.rating && (
          <div className={styles.rating}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.885L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#ff385c"/>
            </svg>
            <span>{property.rating}</span>
            {property.reviewCount && (
              <span className={styles.reviewCount}>({property.reviewCount})</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
