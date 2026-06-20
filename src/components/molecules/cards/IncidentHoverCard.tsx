import { clsx } from 'clsx';
import styles from './incident-hover-card.module.scss';
import type { Incident } from '@/store/types';

export interface IncidentHoverCardProps {
  incident: Incident;
  className?: string;
}

export function IncidentHoverCard({ incident, className }: IncidentHoverCardProps) {
  const assigneeCount = incident.assignees?.length ?? 0;
  const observerCount = incident.observers?.length ?? 0;
  const ownerName = incident.owner?.name ?? 'Desconocido';

  return (
    <div className={clsx(styles.incidentHoverCard, className)}>
      <div className={styles.incidentHoverCard__header}>
        <span className={clsx(
          styles.incidentHoverCard__badge,
          styles[`incidentHoverCard__badge--${incident.priority}`],
        )}>
          {incident.priority}
        </span>
        <span className={styles.incidentHoverCard__status}>{incident.status}</span>
      </div>
      <div className={styles.incidentHoverCard__title}>{incident.title}</div>
      <div className={styles.incidentHoverCard__location}>{incident.locationDescription}</div>
      <div className={styles.incidentHoverCard__meta}>
        <span>Owner: {ownerName}</span>
        {assigneeCount > 0 && <span>Assignees: {assigneeCount}</span>}
        {observerCount > 0 && <span>Observers: {observerCount}</span>}
      </div>
    </div>
  );
}
