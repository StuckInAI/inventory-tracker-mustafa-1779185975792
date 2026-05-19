import clsx from 'clsx';
import styles from './Card.module.css';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
};

export default function Card({ children, className, padding = 'md', onClick }: CardProps) {
  return (
    <div
      className={clsx(styles.card, styles[`pad-${padding}`], onClick && styles.clickable, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
