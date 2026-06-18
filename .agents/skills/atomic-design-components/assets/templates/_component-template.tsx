import { clsx } from 'clsx';
import styles from './{kebab-name}.module.scss';

export interface {PascalName}Props {
  variant?: 'primary' | 'secondary' | 'disabled';
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function {PascalName}({
  variant = 'primary',
  label,
  onClick,
  disabled = false,
  className,
}: {PascalName}Props) {
  return (
    <element
      className={clsx(
        styles.{camelName},
        variant !== 'primary' && styles[`{camelName}--${variant}`],
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </element>
  );
}
