"use client";

import PendingBookings from "@/components/booking/PendingBookings";
import styles from "./reservas.module.css";

export default function ReservasPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestión de Reservas</h1>
        <p>Administra las solicitudes de reserva de tus propiedades</p>
      </div>

      <PendingBookings />
    </div>
  );
}
