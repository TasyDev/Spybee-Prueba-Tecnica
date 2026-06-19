import { clsx } from 'clsx';
import styles from './select.module.scss';

export interface SelectProps {
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
  id?: string;
}

export function Select({
  value,
  options,
  onChange,
  disabled = false,
  hasError = false,
  className,
  id,
}: SelectProps) {
  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        styles.select,
        hasError && styles['select--error'],
        disabled && styles['select--disabled'],
        className,
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
