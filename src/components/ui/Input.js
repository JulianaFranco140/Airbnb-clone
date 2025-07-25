import styles from './Input.module.css';

export default function Input({ 
  label, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  error = '',
  required = false,
  id,
  name,
  className = '',
  ...props 
}) {
  const inputId = id || name;
  
  return (
    <div className={`${styles.inputGroup} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${styles.input} ${error ? styles.error : ''}`}
        {...props}
      />
      {error && (
        <span className={styles.errorText}>{error}</span>
      )}
    </div>
  );
}
