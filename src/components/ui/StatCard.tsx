import styles from './StatCard.module.css';

export type StatCardProps = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
};

export default function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <div className={styles.value}>{value}</div>
      {trend && <div className={styles.trend}>{trend}</div>}
    </div>
  );
}
