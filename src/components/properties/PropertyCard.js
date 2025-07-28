"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./PropertyCard.module.css";

export default function PropertyCard({ property }) {
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const propertyData = property;

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    // Agregar despues logica para subir los likes a la db
    console.log("Propiedad marcada como favorita:", propertyData.id);
  };

  const handleCardClick = () => {
    router.push(`/property/${propertyData.id}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img
          src={propertyData.images[0]}
          alt={propertyData.title}
          className={styles.image}
        />

        <button className={styles.likeButton} onClick={handleLike}>
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
            <path
              d="M2.24264 9.24264L9 16L15.7574 9.24264C16.553 8.44699 17 7.36786 17 6.24264V6.05234C17 3.8143 15.1857 2 12.9477 2C11.7166 2 10.5523 2.55959 9.78331 3.52086L9 4.5L8.21669 3.52086C7.44767 2.55959 6.28338 2 5.05234 2C2.8143 2 1 3.8143 1 6.05234V6.24264C1 7.36786 1.44699 8.44699 2.24264 9.24264Z"
              fill={isLiked ? "#FF385C" : "rgba(0, 0, 0, 0.5)"}
              stroke={isLiked ? "#FF385C" : "#FFFFFF"}
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{propertyData.title}</h3>
          <div className={styles.rating}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 12.4l-4.2 2.6 1.1-4.8L1 6.6l4.9-.4L8 1.6l2.1 4.6 4.9.4-3.9 3.6 1.1 4.8L8 12.4z"
                fill="#FFD700"
              />
            </svg>
            {propertyData.rating} ({propertyData.reviewCount} reseñas)
          </div>
        </div>

        <p className={styles.location}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 0C5.24 0 3 2.24 3 5c0 1.17.36 2.25.97 3.15L8 14l4.03-5.85C12.64 7.25 13 6.17 13 5c0-2.76-2.24-5-5-5zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
              fill="#666"
            />
          </svg>
          {propertyData.location.city}, {propertyData.location.address}
        </p>
        <p className={styles.host}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 0a4 4 0 100 8 4 4 0 000-8zM4 12a4 4 0 00-4 4v2h16v-2a4 4 0 00-4-4H4z"
              fill="#666"
            />
          </svg>
          Anfitrión: {propertyData.hostName}
        </p>

        <div className={styles.priceContainer}>
          <span className={styles.price}>
            ${propertyData.price.toLocaleString()}
          </span>
          <span className={styles.period}> / noche</span>
        </div>
      </div>
    </div>
  );
}
