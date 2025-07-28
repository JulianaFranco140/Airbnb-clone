import { useState, useEffect } from "react";
import BookingModal from "./BookingModal";
import styles from "./PendingBookings.module.css";

export default function PendingBookings() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPendingBookings = async () => {
    try {
      const response = await fetch("/api/bookings/pending");
      const data = await response.json();

      if (data.success) {
        setPendingBookings(data.bookings);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error al cargar reservas pendientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBookings();

    // Refrescar cada 30 segundos para nuevas reservas
    const interval = setInterval(fetchPendingBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  const handleUpdateBooking = () => {
    fetchPendingBookings(); // Refrescar la lista
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando reservas pendientes...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Reservas Pendientes</h2>
        {pendingBookings.length > 0 && (
          <span className={styles.badge}>{pendingBookings.length}</span>
        )}
      </div>

      {pendingBookings.length === 0 ? (
        <div className={styles.empty}>
          <p>No tienes reservas pendientes en este momento.</p>
        </div>
      ) : (
        <div className={styles.bookingsList}>
          {pendingBookings.map((booking) => (
            <div
              key={booking.id}
              className={styles.bookingCard}
              onClick={() => handleBookingClick(booking)}
            >
              <div className={styles.bookingInfo}>
                <h3>{booking.propertyTitle}</h3>
                <p className={styles.guest}>
                  <strong>Huésped:</strong> {booking.guestName}
                </p>
                <p className={styles.dates}>
                  <strong>Fechas:</strong>{" "}
                  {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>
                <p className={styles.price}>
                  <strong>Total:</strong> ${booking.totalPrice.toLocaleString()}
                </p>
              </div>
              <div className={styles.status}>
                <span className={styles.pendingBadge}>Pendiente</span>
                <div className={styles.arrow}>→</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={handleCloseModal}
          onUpdate={handleUpdateBooking}
        />
      )}
    </div>
  );
}
