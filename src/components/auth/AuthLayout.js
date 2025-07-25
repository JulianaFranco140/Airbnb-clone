import styles from './AuthLayout.module.css';

export default function AuthLayout({ children }) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {children}
      </div>
    </div>
  );
}
