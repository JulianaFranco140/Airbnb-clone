import { useState, useEffect } from "react";
import styles from "./BookingModal.module.css";

export default function BookingModal({ booking, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        onUpdate();
        onClose();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!booking) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Solicitud de Reserva</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.message}>
            <strong>{booking.hostName}</strong>, tienes una solicitud de reserva
            de <strong>{booking.guestName}</strong>
          </div>

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Propiedad:</span>
              <span>{booking.propertyTitle}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Fechas:</span>
              <span>
                {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Huéspedes:</span>
              <span>
                {booking.guests} persona{booking.guests > 1 ? "s" : ""}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Total:</span>
              <span className={styles.price}>
                ${booking.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={() => handleAction("cancel")}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Cancelar Reserva"}
          </button>
          <button
            className={styles.confirmBtn}
            onClick={() => handleAction("confirm")}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Confirmar Reserva"}
          </button>
        </div>
      </div>
    </div>
  );
}
