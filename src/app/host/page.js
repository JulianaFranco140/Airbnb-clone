import Header from '../../components/layout/Header';
import Link from 'next/link';
import styles from './host.module.css';

export default function HostPage() {
  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Podrías ganar
            </h1>
            <div className={styles.priceDisplay}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>1,200</span>
              <span className={styles.period}>por mes</span>
            </div>
            <p className={styles.heroSubtitle}>
              Hospedando en tu ubicación
            </p>
            <Link href="/host/property/new" className={styles.startButton}>
              Empezar
            </Link>
          </div>
          
          <div className={styles.heroImage}>
            <div className={styles.placeholderImage}>
              <svg width="400" height="300" viewBox="0 0 400 300" fill="none">
                <rect width="400" height="300" fill="#f7f7f7" rx="12"/>
                <path d="M100 100h200v100H100z" fill="#ff385c" opacity="0.1"/>
                <path d="M150 120h100v20H150z" fill="#ff385c" opacity="0.3"/>
                <path d="M150 150h60v10H150z" fill="#ff385c" opacity="0.2"/>
                <path d="M150 170h80v10H150z" fill="#ff385c" opacity="0.2"/>
                <circle cx="320" cy="80" r="20" fill="#ff385c" opacity="0.2"/>
                <text x="200" y="220" textAnchor="middle" fill="#717171" fontSize="14">
                  Tu espacio aquí
                </text>
              </svg>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className={styles.benefits}>
          <h2 className={styles.sectionTitle}>
            Airbnb es fácil de usar
          </h2>
          
          <div className={styles.benefitsGrid}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4L32 16H16L24 4Z" fill="#ff385c"/>
                  <path d="M8 16H40V40H8V16Z" fill="#ff385c" opacity="0.1"/>
                  <path d="M16 24H20V32H16V24Z" fill="#ff385c"/>
                  <path d="M28 24H32V32H28V24Z" fill="#ff385c"/>
                </svg>
              </div>
              <h3>Configura tu anuncio fácilmente</h3>
              <p>Te ayudaremos a crear un anuncio que destaque con herramientas simples.</p>
            </div>
            
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" fill="#ff385c" opacity="0.1"/>
                  <path d="M24 8C16.27 8 10 14.27 10 22s6.27 14 14 14 14-6.27 14-14S31.73 8 24 8zm0 20c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="#ff385c"/>
                </svg>
              </div>
              <h3>Decide cómo hospedas</h3>
              <p>Elige tu horario, precios y requisitos para los huéspedes.</p>
            </div>
            
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M12 20h24v16H12V20z" fill="#ff385c" opacity="0.1"/>
                  <path d="M16 12h16v8H16V12z" fill="#ff385c"/>
                  <path d="M20 24h8v4h-8v-4z" fill="#ff385c"/>
                </svg>
              </div>
              <h3>Recibe el pago</h3>
              <p>Te pagamos 24 horas después del check-in de tus huéspedes.</p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className={styles.steps}>
          <h2 className={styles.sectionTitle}>
            3 pasos para convertirte en anfitrión
          </h2>
          
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Cuéntanos acerca de tu espacio</h3>
              <p>Comparte algunos datos básicos, como dónde está ubicado y cuántos huéspedes pueden alojarse.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Haz que destaque</h3>
              <p>Agrega 5 fotos o más, además de un título y una descripción: solo mostraremos tu anuncio después de este paso.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Completa y publica</h3>
              <p>Elige tu configuración de reserva, establece tu precio y publica tu anuncio.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2>¿Listo para convertirte en anfitrión?</h2>
            <Link href="/host/property/new" className={styles.ctaButton}>
              Publica tu espacio
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
