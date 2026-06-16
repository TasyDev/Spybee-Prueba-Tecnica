import { clsx } from 'clsx';
import styles from './icon.module.scss';

export type IconName = 'envelope' | 'lock' | 'eye' | 'eye-slash' | 'chevron-right' | 'chevron-left';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

const ICONS: Record<IconName, { viewBox: string; path: string }> = {
  envelope: {
    viewBox: '0 0 24 24',
    path: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.5l-8 4.5-8-4.5V6h16zM4 18V8.5l7.5 4.2c.3.2.7.2 1 0L20 8.5V18H4z',
  },
  lock: {
    viewBox: '0 0 24 24',
    path: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
  },
  eye: {
    viewBox: '0 0 24 24',
    path: 'M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z',
  },
  'eye-slash': {
    viewBox: '0 0 24 24',
    path: 'M12 7c2.8 0 5 2.2 5 5 0 .6-.1 1.2-.4 1.7l3 3c1.5-1.3 2.7-2.9 3.4-4.7-1.7-4.4-6-7.5-11-7.5-1.4 0-2.7.2-3.9.6l2.2 2.2c.5-.3 1.1-.4 1.7-.4zM2 4.3l2.3 2.3.5.5C3.1 8.3 1.7 9.9 1 12c1.7 4.4 6 7.5 11 7.5 1.5 0 2.9-.2 4.2-.7l.8.8 2.9 2.9 1.3-1.3L3.3 3 2 4.3zM7.5 9.8l1.6 1.6-.1.3c0 1.9 1.6 3.5 3.5 3.5.1 0 .2 0 .3-.1l1.6 1.6c-.6.4-1.3.6-2 .6-2.8 0-5-2.2-5-5 0-.7.2-1.4.6-2zM11.8 7.1l2.5 2.5-.1-.3c0-1.4-1.1-2.5-2.5-2.5l.1.3z',
  },
  'chevron-right': {
    viewBox: '0 0 24 24',
    path: 'M10 6L8.6 7.4 13.2 12l-4.6 4.6L10 18l6-6z',
  },
  'chevron-left': {
    viewBox: '0 0 24 24',
    path: 'M14 6l1.4 1.4L10.8 12l4.6 4.6L14 18l-6-6z',
  },
};

export function Icon({ name, size = 20, color, className }: IconProps) {
  const icon = ICONS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill={color || 'currentColor'}
      className={clsx(styles.icon, styles[`icon--${name}`], className)}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}
