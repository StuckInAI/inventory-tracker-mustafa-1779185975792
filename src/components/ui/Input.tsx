import clsx from 'clsx';
import styles from './Input.module.css';

type InputProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  icon?: React.ReactNode;
};

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  disabled,
  className,
  error,
  icon,
}: InputProps) {
  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}>*</span>}</label>}
      <div className={styles.inputWrap}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={clsx(styles.input, icon && styles.withIcon, error && styles.inputError)}
        />
      </div>
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}
