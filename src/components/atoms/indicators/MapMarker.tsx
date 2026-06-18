import { clsx } from 'clsx';
import styles from './map-marker.module.scss';

export interface MapMarkerProps {
  variant: 'critical' | 'watchlist' | 'logged';
  icon?: React.ReactNode;
  pulsing?: boolean;
  onClick?: () => void;
  className?: string;
}

export function MapMarker({ variant, icon, pulsing = false, onClick, className }: MapMarkerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(styles.mapMarker, styles[`mapMarker--${variant}`], className)}
    >
      {pulsing && <span className={styles.mapMarker__pulse} />}
      <span className={styles.mapMarker__inner}>
        {icon}
      </span>
    </button>
  );
}
