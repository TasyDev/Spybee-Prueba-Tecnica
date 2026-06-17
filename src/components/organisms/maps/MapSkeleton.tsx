import { clsx } from 'clsx';
import styles from './map-skeleton.module.scss';

export interface MapSkeletonProps {
  className?: string;
}

export function MapSkeleton({ className }: MapSkeletonProps) {
  return (
    <div className={clsx(styles.mapSkeleton, className)}>
      <div className={styles.mapSkeleton__map} />

      <div className={styles.mapSkeleton__controls}>
        <div className={styles.mapSkeleton__controlBtn} />
        <div className={styles.mapSkeleton__controlBtn} />
        <div className={styles.mapSkeleton__controlBtn} />
        <div className={styles.mapSkeleton__controlBtn} />
        <div className={styles.mapSkeleton__controlBtn} />
      </div>

      <div className={styles.mapSkeleton__filterBar}>
        <div className={styles.mapSkeleton__filterPill} />
        <div className={styles.mapSkeleton__filterPill} />
        <div className={styles.mapSkeleton__filterPill} />
        <div className={styles.mapSkeleton__filterPill} />
      </div>

      <div className={styles.mapSkeleton__legend}>
        <div className={styles.mapSkeleton__legendItem} />
        <div className={styles.mapSkeleton__legendItem} />
        <div className={styles.mapSkeleton__legendItem} />
      </div>

      <div className={styles.mapSkeleton__toast} />
    </div>
  );
}
