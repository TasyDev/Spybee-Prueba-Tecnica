import { clsx } from 'clsx';
import { Icon } from '@/components/atoms/icons/Icon';
import styles from './incident-detail-popup.module.scss';
import type { Incident } from '@/store/types';

export interface IncidentDetailPopupProps {
  incident: Incident;
  onClose: () => void;
  className?: string;
}

export function IncidentDetailPopup({ incident, onClose, className }: IncidentDetailPopupProps) {
  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={clsx(styles.incidentDetailPopup, className)}>
      <button
        type="button"
        className={styles.incidentDetailPopup__close}
        onClick={onClose}
        aria-label="Close popup"
      >
        <Icon name="x" size={14} color="#9A9078" />
      </button>

      <div className={styles.incidentDetailPopup__header}>
        <span className={clsx(
          styles.incidentDetailPopup__badge,
          styles[`incidentDetailPopup__badge--${incident.priority}`],
        )}>
          {incident.priority}
        </span>
        <span className={styles.incidentDetailPopup__status}>{incident.status}</span>
      </div>

      <h3 className={styles.incidentDetailPopup__title}>{incident.title}</h3>
      <p className={styles.incidentDetailPopup__description}>{incident.description}</p>

      <div className={styles.incidentDetailPopup__section}>
        <span className={styles.incidentDetailPopup__label}>Location</span>
        <span className={styles.incidentDetailPopup__value}>{incident.locationDescription}</span>
      </div>

      <div className={styles.incidentDetailPopup__section}>
        <span className={styles.incidentDetailPopup__label}>Created by</span>
        <span className={styles.incidentDetailPopup__value}>{incident.owner?.name ?? 'Unknown'}</span>
      </div>

      {incident.assignees.length > 0 && (
        <div className={styles.incidentDetailPopup__section}>
          <span className={styles.incidentDetailPopup__label}>Assignees</span>
          <div className={styles.incidentDetailPopup__list}>
            {incident.assignees.map((a) => (
              <span key={a.id} className={styles.incidentDetailPopup__chip}>{a.name}</span>
            ))}
          </div>
        </div>
      )}

      {incident.observers.length > 0 && (
        <div className={styles.incidentDetailPopup__section}>
          <span className={styles.incidentDetailPopup__label}>Observers</span>
          <div className={styles.incidentDetailPopup__list}>
            {incident.observers.map((o) => (
              <span key={o.id} className={styles.incidentDetailPopup__chip}>{o.name}</span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.incidentDetailPopup__footer}>
        <span>Created: {formatDate(incident.createdAt)}</span>
        {incident.dueDate && <span>Due: {formatDate(incident.dueDate)}</span>}
      </div>
    </div>
  );
}
