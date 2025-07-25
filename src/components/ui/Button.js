import styles from './Button.module.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  disabled = false, 
  loading = false, 
  onClick,
  className = '',
  ...props 
}) {
  const buttonClass = `${styles.button} ${styles[variant]} ${loading ? styles.loading : ''} ${className}`;
  
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClass}
      {...props}
    >
      <span className={styles.content}>
        {loading ? 'Cargando...' : children}
      </span>
    </button>
  );
}
