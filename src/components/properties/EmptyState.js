import Link from 'next/link';
import styles from './EmptyState.module.css';

export default function EmptyState() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path d="M60 10L85 40H35L60 10Z" fill="#ff385c" opacity="0.1"/>
            <path d="M30 40H90V100H30V40Z" fill="#ff385c" opacity="0.1"/>
            <path d="M40 60H50V80H40V60Z" fill="#ff385c" opacity="0.3"/>
            <path d="M70 60H80V80H70V60Z" fill="#ff385c" opacity="0.3"/>
            <circle cx="60" cy="30" r="3" fill="#ff385c"/>
            <path d="M30 40H90V100H30V40Z" stroke="#ff385c" strokeWidth="2" fill="none"/>
            <path d="M60 10L85 40H35L60 10Z" stroke="#ff385c" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        <h2 className={styles.title}>
          ¡Aún no hay propiedades publicadas!
        </h2>
        
        <p className={styles.description}>
          Sé el primero en compartir tu espacio increíble con nuestra comunidad. 
          Publica tu propiedad y comienza a generar ingresos adicionales.
        </p>
        
        <div className={styles.buttons}>
          <Link href="/host" className={styles.primaryButton}>
            Publica tu espacio
          </Link>
          
          <Link href="/login" className={styles.secondaryButton}>
            Explorar como huésped
          </Link>
        </div>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#ff385c"/>
              </svg>
            </div>
            <div>
              <h4>Fácil de usar</h4>
              <p>Publica tu propiedad en minutos</p>
            </div>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8.5 16L12 13.5 15.5 16 12 18.5 8.5 16z" fill="#ff385c"/>
              </svg>
            </div>
            <div>
              <h4>Comunidad confiable</h4>
              <p>Huéspedes verificados y seguros</p>
            </div>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9C9 10.1 9.9 11 11 11V16L13 18L15 16V11C16.1 11 17 10.1 17 9H21Z" fill="#ff385c"/>
              </svg>
            </div>
            <div>
              <h4>Ingresos adicionales</h4>
              <p>Monetiza tu espacio libre</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
