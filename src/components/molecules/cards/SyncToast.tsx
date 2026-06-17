import { clsx } from 'clsx';
import styles from './sync-toast.module.scss';

export interface SyncToastProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  visible?: boolean;
  className?: string;
}

export function SyncToast({ icon, title, message, visible = false, className }: SyncToastProps) {
  if (!visible) return null;

  return (
    <div className={clsx(styles.syncToast, className)}>
      <div className={styles.syncToast__icon}>{icon}</div>
      <div className={styles.syncToast__content}>
        <div className={styles.syncToast__title}>{title}</div>
        <div className={styles.syncToast__message}>{message}</div>
      </div>
    </div>
  );
}
