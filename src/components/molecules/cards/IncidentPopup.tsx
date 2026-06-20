import { clsx } from 'clsx';
import styles from './incident-popup.module.scss';

export interface IncidentPopupProps {
  title: string;
  location: string;
  timeAgo: string;
  visible?: boolean;
  className?: string;
}

export function IncidentPopup({ title, location, timeAgo, visible = false, className }: IncidentPopupProps) {
  if (!visible) return null;

  return (
    <div className={clsx(styles.incidentPopup, className)}>
      <div className={styles.incidentPopup__title}>{title}</div>
      <div className={styles.incidentPopup__location}>{location}</div>
      <div className={styles.incidentPopup__time}>{timeAgo}</div>
    </div>
  );
}
