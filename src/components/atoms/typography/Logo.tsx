import { clsx } from 'clsx';
import { Icon } from '@/components/atoms/icons/Icon';
import styles from './logo.module.scss';

export interface LogoProps {
  variant?: 'text' | 'mark';
  className?: string;
}

export function Logo({ variant = 'text', className }: LogoProps) {
  if (variant === 'mark') {
    return (
      <div className={clsx(styles.logoMark, className)}>
        <Icon name="logo-mark" size={20} color="#241A00" />
      </div>
    );
  }

  return (
    <span className={clsx(styles.logo, className)}>
      Spybee
    </span>
  );
}
