import clsx from 'clsx';
import styles from './Textarea.module.css';

type TextareaProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
  disabled,
  className,
}: TextareaProps) {
  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}>*</span>}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        className={styles.textarea}
      />
    </div>
  );
}
