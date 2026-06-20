import { clsx } from 'clsx';
import styles from './tag.module.scss';

export interface TagProps {
  label: string;
  variant?: 'default' | 'active';
  onClick?: () => void;
  className?: string;
}

export function Tag({ label, variant = 'default', onClick, className }: TagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        styles.tag,
        variant === 'active' && styles['tag--active'],
        className,
      )}
    >
      {label}
    </button>
  );
}
