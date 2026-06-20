import { clsx } from 'clsx';
import styles from './form-heading.module.scss';

export interface FormHeadingProps {
  title: string;
  description: string;
  className?: string;
}

export function FormHeading({ title, description, className }: FormHeadingProps) {
  return (
    <div className={clsx(styles.heading, className)}>
      <h2 className={styles.heading__title}>{title}</h2>
      <p className={styles.heading__description}>{description}</p>
    </div>
  );
}
