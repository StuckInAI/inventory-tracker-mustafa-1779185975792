import styles from './StatCard.module.css';
import clsx from 'clsx';

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'secondary';
};

export default function StatCard({ label, value, icon, trend, trendUp, color = 'primary' }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={clsx(styles.iconBox, styles[color])}>{icon}</div>
        {trend && (
          <span className={clsx(styles.trend, trendUp ? styles.trendUp : styles.trendDown)}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
