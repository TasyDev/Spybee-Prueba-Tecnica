import { clsx } from 'clsx';
import styles from './legend-dot.module.scss';

export interface LegendDotProps {
  variant: 'critical' | 'watchlist' | 'logged';
  pulsing?: boolean;
  className?: string;
}

export function LegendDot({ variant, pulsing = false, className }: LegendDotProps) {
  return (
    <span
      className={clsx(
        styles.legendDot,
        styles[`legendDot--${variant}`],
        pulsing && styles['legendDot--pulsing'],
        className,
      )}
    />
  );
}
