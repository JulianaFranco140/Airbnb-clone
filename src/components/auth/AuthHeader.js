import Logo from '../ui/Logo';
import styles from './AuthHeader.module.css';

export default function AuthHeader({ title, subtitle }) {
  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <Logo href='/'/>
      </div>
      {title && <h1 className={styles.title}>{title}</h1>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
