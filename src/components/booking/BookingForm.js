"use client";

import { useState, useEffect } from "react";
import BookingRequestModal from "./BookingRequestModal";
import styles from "./BookingForm.module.css";

export default function BookingForm({ property }) {
  const [user, setUser] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [bookingStatus, setBookingStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [bookingRequestData, setBookingRequestData] = useState(null);

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * property.price;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validaciones básicas
    if (!bookingData.checkIn || !bookingData.checkOut) {
      setError("Por favor selecciona las fechas de entrada y salida");
      setLoading(false);
      return;
    }

    if (new Date(bookingData.checkIn) >= new Date(bookingData.checkOut)) {
      setError("La fecha de salida debe ser posterior a la fecha de entrada");
      setLoading(false);
      return;
    }

    if (bookingData.guests > property.guests) {
      setError(`Esta propiedad permite máximo ${property.guests} huéspedes`);
      setLoading(false);
      return;
    }

    if (!user) {
      setError("Debes iniciar sesión para hacer una reserva");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property.id,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: parseInt(bookingData.guests),
          totalPrice: calculateTotal(),
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setBookingId(data.booking.id);
        setBookingStatus(data.booking.status);

        // Preparar datos para el modal
        setBookingRequestData({
          bookingId: data.booking.id,
          hostName: data.booking.hostName,
          guestName: data.booking.guestName,
          propertyTitle: data.booking.propertyTitle,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          totalPrice: calculateTotal(),
        });

        // Mostrar modal después de un breve delay
        setTimeout(() => {
          setShowModal(true);
        }, 1500);

        setBookingData({
          checkIn: "",
          checkOut: "",
          guests: 1,
        });
      } else {
        setError(data.message || "Error al procesar la reserva");
      }
    } catch (error) {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/confirm`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (response.ok) {
        setBookingStatus("confirmed");
        alert("¡Reserva confirmada exitosamente!");
      } else {
        alert(data.message || "Error al confirmar la reserva");
      }
    } catch (error) {
      alert("Error de conexión. Intenta nuevamente.");
    }
  };

  const handleCancelBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (response.ok) {
        setBookingStatus("cancelled");
        alert("Reserva cancelada");
      } else {
        alert(data.message || "Error al cancelar la reserva");
      }
    } catch (error) {
      alert("Error de conexión. Intenta nuevamente.");
    }
  };

  if (success) {
    return (
      <div className={styles.bookingCard}>
        <div className={styles.success}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#00a699" />
              <path
                d="M20 24l4 4 8-8"
                stroke="white"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
          <h3>¡Reserva creada exitosamente!</h3>
          <div className={styles.bookingStatusContainer}>
            <div className={styles.statusBadge}>
              <span
                className={`${styles.statusIndicator} ${
                  bookingStatus === "confirmed"
                    ? styles.confirmed
                    : bookingStatus === "cancelled"
                    ? styles.cancelled
                    : styles.pending
                }`}
              />
              Estado:{" "}
              {bookingStatus === "confirmed"
                ? "Confirmada"
                : bookingStatus === "cancelled"
                ? "Cancelada"
                : "Pendiente"}
            </div>
          </div>

          {bookingStatus === "pending" && (
            <div className={styles.pendingInfo}>
              <p>Tu reserva está pendiente de confirmación del anfitrión.</p>
              <p>Te notificaremos cuando sea aprobada.</p>
            </div>
          )}

          {bookingStatus === "confirmed" && (
            <p>
              ¡Tu reserva ha sido confirmada! Recibirás un email con los
              detalles.
            </p>
          )}

          {bookingStatus === "cancelled" && (
            <div className={styles.cancelledInfo}>
              <p>Tu reserva ha sido cancelada por el anfitrión.</p>
              <p>Puedes buscar otras opciones disponibles.</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}

          <button
            className={styles.newBookingButton}
            onClick={() => {
              setSuccess(false);
              setBookingId(null);
              setBookingStatus("");
              setError("");
            }}
          >
            Hacer nueva reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookingCard}>
      <div className={styles.priceHeader}>
        <span className={styles.price}>${property.price.toLocaleString()}</span>
        <span className={styles.period}>noche</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.dateInputs}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Llegada</label>
            <input
              type="date"
              name="checkIn"
              value={bookingData.checkIn}
              onChange={handleInputChange}
              className={styles.input}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Salida</label>
            <input
              type="date"
              name="checkOut"
              value={bookingData.checkOut}
              onChange={handleInputChange}
              className={styles.input}
              min={
                bookingData.checkIn || new Date().toISOString().split("T")[0]
              }
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Huéspedes</label>
          <select
            name="guests"
            value={bookingData.guests}
            onChange={handleInputChange}
            className={styles.input}
            required
          >
            {[...Array(property.guests)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1} {index + 1 === 1 ? "huésped" : "huéspedes"}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {calculateNights() > 0 && (
          <div className={styles.pricing}>
            <div className={styles.pricingRow}>
              <span>
                ${property.price.toLocaleString()} x {calculateNights()} noches
              </span>
              <span>${calculateTotal().toLocaleString()}</span>
            </div>
            <div className={styles.total}>
              <span>Total</span>
              <span>${calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={styles.reserveButton}
          disabled={loading || calculateNights() === 0}
        >
          {loading ? "Procesando..." : "Reservar"}
        </button>
      </form>

      <p className={styles.disclaimer}>No se te cobrará todavía</p>

      {/* Modal de solicitud de reserva */}
      <BookingRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        bookingData={bookingRequestData}
        onConfirm={handleConfirmBooking}
        onCancel={handleCancelBooking}
      />
    </div>
  );
}
