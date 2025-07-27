import Link from 'next/link';
import styles from './Logo.module.css';

export default function Logo({ href, size = 'medium' }) {
  const logoContent = (
    <span className={`${styles.logoText} ${styles[size]}`}>
      <img src='https://i.pinimg.com/originals/56/5c/2a/565c2a824c7c184e326c751a0fb7e73e.png' className={styles.logoImage}></img>
      airbnb
    </span>
  );

  if (!href) {
    return <div className={styles.logo}>{logoContent}</div>;
  }

  return (
    <Link href={href} className={styles.logo}>
      {logoContent}
    </Link>
  );
}
