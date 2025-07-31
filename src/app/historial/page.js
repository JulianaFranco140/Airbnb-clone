"use client";

import BookingHistory from "@/components/booking/BookingHistory";
import Header from "@/components/layout/Header";
import styles from "./historial.module.css";

export default function HistorialPage() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <BookingHistory />
      </main>
    </div>
  );
}
