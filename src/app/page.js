'use client';

import { useState } from 'react';
import Header from '../components/layout/Header';
import PropertyGrid from '../components/properties/PropertyGrid';
import styles from "./page.module.css";

export default function Home() {
  const [searchFilters, setSearchFilters] = useState(null);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  return (
    <div className={styles.page}>
      <Header onSearch={handleSearch} />
      <main className={styles.main}>
        <PropertyGrid searchFilters={searchFilters} />
      </main>
    </div>
  );
}
