import { clsx } from 'clsx';
import { Icon } from '@/components/atoms/icons/Icon';
import styles from './incident-detail-popup.module.scss';
import type { Incident } from '@/store/types';

export interface IncidentDetailPopupProps {
  incident: Incident;
  onClose: () => void;
  onViewDetails?: (id: string) => void;
  className?: string;
}

export function IncidentDetailPopup({ incident, onClose, onViewDetails, className }: IncidentDetailPopupProps) {
  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (date: string | null) => {
    if (!date) return 'No establecido';
    return new Date(date).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={clsx(styles.incidentDetailPopup, className)}>
      <button
        type="button"
        className={styles.incidentDetailPopup__close}
        onClick={onClose}
        aria-label="Cerrar popup"
      >
        <Icon name="x" size={14} color="#9A9078" />
      </button>

      <div className={styles.incidentDetailPopup__header}>
        <span className={clsx(
          styles.incidentDetailPopup__badge,
          styles[`incidentDetailPopup__badge--${incident.priority}`],
        )}>
          {incident.priority === 'high' ? 'Alta' : incident.priority === 'medium' ? 'Media' : 'Baja'}
        </span>
        <span className={styles.incidentDetailPopup__status}>
          {incident.status === 'open' ? 'Abierto'
            : incident.status === 'in_progress' ? 'En progreso'
            : incident.status === 'resolved' ? 'Resuelto'
            : incident.status === 'closed' ? 'Cerrado'
            : incident.status === 'rejected' ? 'Rechazado'
            : incident.status}
        </span>
      </div>

      <h3 className={styles.incidentDetailPopup__title}>{incident.title}</h3>
      <p className={styles.incidentDetailPopup__description}>{incident.description}</p>

      <div className={styles.incidentDetailPopup__section}>
        <span className={styles.incidentDetailPopup__label}>Ubicación</span>
        <span className={styles.incidentDetailPopup__value}>{incident.locationDescription}</span>
      </div>

      <div className={styles.incidentDetailPopup__section}>
        <span className={styles.incidentDetailPopup__label}>Creado por</span>
        <span className={styles.incidentDetailPopup__value}>{incident.owner?.name ?? 'Desconocido'}</span>
      </div>

      <div className={styles.incidentDetailPopup__section}>
        <span className={styles.incidentDetailPopup__label}>Proyecto</span>
        <span className={styles.incidentDetailPopup__value}>{incident.project?.name ?? 'Sin proyecto'}</span>
      </div>

      {incident.assignees.length > 0 && (
        <div className={styles.incidentDetailPopup__section}>
          <span className={styles.incidentDetailPopup__label}>Asignados</span>
          <div className={styles.incidentDetailPopup__list}>
            {incident.assignees.map((a) => (
              <span key={a.id} className={styles.incidentDetailPopup__chip}>{a.name}</span>
            ))}
          </div>
        </div>
      )}

      {incident.observers.length > 0 && (
        <div className={styles.incidentDetailPopup__section}>
          <span className={styles.incidentDetailPopup__label}>Observadores</span>
          <div className={styles.incidentDetailPopup__list}>
            {incident.observers.map((o) => (
              <span key={o.id} className={styles.incidentDetailPopup__chip}>{o.name}</span>
            ))}
          </div>
        </div>
      )}

      {incident.tags.length > 0 && (
        <div className={styles.incidentDetailPopup__section}>
          <span className={styles.incidentDetailPopup__label}>Etiquetas</span>
          <div className={styles.incidentDetailPopup__list}>
            {incident.tags.map((t) => (
              <span
                key={t.id}
                className={styles.incidentDetailPopup__chip}
                style={t.color ? { background: `${t.color}30`, borderColor: `${t.color}60`, color: t.color } : undefined}
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.incidentDetailPopup__section}>
        <span className={styles.incidentDetailPopup__label}>Vence</span>
        <span className={styles.incidentDetailPopup__value}>{formatDateTime(incident.dueDate)}</span>
      </div>

      <div className={styles.incidentDetailPopup__footer}>
        <span>Creado: {formatDate(incident.createdAt)}</span>
        {incident.dueDate && <span>Vence: {formatDate(incident.dueDate)}</span>}
      </div>

      {onViewDetails && (
        <button
          type="button"
          className={styles.incidentDetailPopup__viewBtn}
          onClick={() => onViewDetails(incident.id)}
        >
          Ver detalles
        </button>
      )}
    </div>
  );
}
