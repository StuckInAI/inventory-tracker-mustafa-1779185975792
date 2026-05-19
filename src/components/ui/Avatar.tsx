import clsx from 'clsx';
import styles from './Avatar.module.css';

type AvatarProps = {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
};

export default function Avatar({ initials, size = 'md', className }: AvatarProps) {
  return (
    <div className={clsx(styles.avatar, styles[size], className)}>
      {initials}
    </div>
  );
}
