"use client";

import { useState, useEffect } from "react";
import styles from "./BookingHistory.module.css";

export default function BookingHistory() {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchBookingHistory = async () => {
    if (!user) return;
    
    try {
      const response = await fetch("/api/bookings/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });
      
      const data = await response.json();

      if (data.success) {
        setBookingHistory(data.bookings);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error al cargar historial de reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookingHistory();
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: "Pendiente", class: styles.pending },
      confirmed: { text: "Confirmada", class: styles.confirmed },
      cancelled: { text: "Cancelada", class: styles.cancelled },
    };
    
    return statusMap[status] || { text: status, class: styles.default };
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando historial de reservas...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Debes iniciar sesión para ver tu historial de reservas.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Historial de Reservas</h2>
        <p>Aquí puedes ver todas tus reservas anteriores y actuales</p>
      </div>

      {bookingHistory.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path
                d="M8 16h48v32H8V16z"
                stroke="#ddd"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M16 24h32M16 32h24M16 40h16"
                stroke="#ddd"
                strokeWidth="2"
              />
            </svg>
          </div>
          <h3>No tienes reservas aún</h3>
          <p>Cuando hagas tu primera reserva, aparecerá aquí.</p>
        </div>
      ) : (
        <div className={styles.bookingsList}>
          {bookingHistory.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingInfo}>
                <div className={styles.propertyInfo}>
                  <h3 className={styles.propertyTitle}>{booking.propertyTitle}</h3>
                  <p className={styles.propertyLocation}>
                    {booking.propertyAddress}, {booking.propertyCity}
                  </p>
                </div>
                
                <div className={styles.bookingDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Fechas:</span>
                    <span className={styles.value}>
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Huéspedes:</span>
                    <span className={styles.value}>
                      {booking.guests} {booking.guests === 1 ? "huésped" : "huéspedes"}
                    </span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Total:</span>
                    <span className={styles.price}>
                      ${booking.totalPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Reservado por:</span>
                    <span className={styles.value}>{booking.userName}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.bookingStatus}>
                <span className={`${styles.statusBadge} ${getStatusBadge(booking.status).class}`}>
                  {getStatusBadge(booking.status).text}
                </span>
                <div className={styles.bookingDate}>
                  Reservado el {formatDate(booking.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
