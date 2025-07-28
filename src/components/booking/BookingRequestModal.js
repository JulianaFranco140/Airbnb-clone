"use client";

import { useState } from "react";
import styles from "./BookingRequestModal.module.css";

export default function BookingRequestModal({
  isOpen,
  onClose,
  bookingData,
  onConfirm,
  onCancel,
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !bookingData) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingData.bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "confirm" }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        if (onConfirm) onConfirm(data);
        onClose();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error confirmando reserva:", error);
      alert("Error al confirmar la reserva");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingData.bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "cancel" }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        if (onCancel) onCancel(data);
        onClose();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error cancelando reserva:", error);
      alert("Error al cancelar la reserva");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Solicitud de Reserva</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.requestInfo}>
            <p className={styles.message}>
              <strong>{bookingData.hostName}</strong> tienes una solicitud de
              reserva de <strong>{bookingData.guestName}</strong>
            </p>
          </div>

          <div className={styles.bookingDetails}>
            <h3>Detalles de la reserva:</h3>
            <div className={styles.detailItem}>
              <span className={styles.label}>Propiedad:</span>
              <span className={styles.value}>{bookingData.propertyTitle}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Fechas:</span>
              <span className={styles.value}>
                {formatDate(bookingData.checkIn)} -{" "}
                {formatDate(bookingData.checkOut)}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Huéspedes:</span>
              <span className={styles.value}>{bookingData.guests}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Total:</span>
              <span className={styles.value}>
                ${bookingData.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Rechazar"}
            </button>
            <button
              className={styles.confirmButton}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
