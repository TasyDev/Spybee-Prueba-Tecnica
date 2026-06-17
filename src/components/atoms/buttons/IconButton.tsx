import { clsx } from 'clsx';
import styles from './icon-button.module.scss';

export interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

export function IconButton({ icon, onClick, isActive = false, className }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        styles.iconButton,
        isActive && styles['iconButton--active'],
        className,
      )}
    >
      {icon}
    </button>
  );
}
