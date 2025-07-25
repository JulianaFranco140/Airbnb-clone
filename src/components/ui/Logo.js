import Link from 'next/link';
import styles from './Logo.module.css';

export default function Logo({ href = '/', size = 'medium' }) {
  return (
    <Link href={href} className={styles.logo}>
      <span className={`${styles.logoText} ${styles[size]}`}>airbnb</span>
    </Link>
  );
}
