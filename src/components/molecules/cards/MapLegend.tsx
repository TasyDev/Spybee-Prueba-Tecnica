import { clsx } from 'clsx';
import { LegendDot } from '@/components/atoms/indicators/LegendDot';
import styles from './map-legend.module.scss';

export interface LegendItem {
  variant: 'critical' | 'watchlist' | 'logged';
  label: string;
}

export interface MapLegendProps {
  title: string;
  items: LegendItem[];
  className?: string;
}

export function MapLegend({ title, items, className }: MapLegendProps) {
  return (
    <div className={clsx(styles.mapLegend, className)}>
      <div className={styles.mapLegend__title}>{title}</div>
      <div className={styles.mapLegend__list}>
        {items.map((item, index) => (
          <div key={index} className={styles.mapLegend__item}>
            <LegendDot variant={item.variant} />
            <span className={styles.mapLegend__label}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
