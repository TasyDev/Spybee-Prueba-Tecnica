import { clsx } from 'clsx';
import { Icon } from '@/components/atoms/icons/Icon';
import styles from './chip.module.scss';

export interface ChipProps {
  label: string;
  color?: string;
  onRemove?: () => void;
  className?: string;
}

export function Chip({ label, color, onRemove, className }: ChipProps) {
  return (
    <span
      className={clsx(styles.chip, className)}
      style={color ? { backgroundColor: color } : undefined}
    >
      <span className={styles.chip__label}>{label}</span>
      {onRemove && (
        <button type="button" onClick={onRemove} className={styles.chip__remove} aria-label={`Eliminar ${label}`}>
          <Icon name="x" size={12} color="#EBE1D1" />
        </button>
      )}
    </span>
  );
}
