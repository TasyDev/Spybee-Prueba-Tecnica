import { clsx } from 'clsx';
import { Icon } from '@/components/atoms/icons/Icon';
import type { IconName } from '@/components/atoms/icons/Icon';
import styles from './button.module.scss';

export interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  leftIcon?: IconName;
  rightIcon?: IconName;
}

export function Button({
  label,
  onClick,
  disabled = false,
  fullWidth = true,
  className,
  type = 'button',
  leftIcon,
  rightIcon,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        styles.button,
        fullWidth && styles['button--full-width'],
        disabled && styles['button--disabled'],
        className,
      )}
    >
      {leftIcon && <Icon name={leftIcon} size={16} />}
      {label}
      {rightIcon && <Icon name={rightIcon} size={16} />}
    </button>
  );
}
