import clsx from 'clsx';
import styles from './Card.module.css';
import type { CSSProperties } from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  style?: CSSProperties;
};

export default function Card({ children, className, padding = 'md', onClick, style }: CardProps) {
  return (
    <div
      style={style}
      className={clsx(styles.card, styles[`pad-${padding}`], onClick && styles.clickable, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
