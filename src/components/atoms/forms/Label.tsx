import { clsx } from 'clsx';
import styles from './label.module.scss';

export interface LabelProps {
  children: string;
  className?: string;
  htmlFor?: string;
}

export function Label({ children, className, htmlFor }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={clsx(styles.label, className)}>
      {children}
    </label>
  );
}
