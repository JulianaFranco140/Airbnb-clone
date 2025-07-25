import Header from '../components/layout/Header';
import PropertyGrid from '../components/properties/PropertyGrid';
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <PropertyGrid />
      </main>
    </div>
  );
}
