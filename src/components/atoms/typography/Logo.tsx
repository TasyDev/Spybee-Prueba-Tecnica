import { clsx } from 'clsx';
import styles from './logo.module.scss';

export interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={clsx(styles.logo, className)}>
      Spybee
    </span>
  );
}
