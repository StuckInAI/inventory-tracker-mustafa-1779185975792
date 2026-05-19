import styles from './PageHeader.module.css';

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  action?: React.ReactNode;
};

export default function PageHeader({ title, subtitle, actions, action }: PageHeaderProps) {
  const content = actions ?? action;
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {content && <div className={styles.actions}>{content}</div>}
    </div>
  );
}
