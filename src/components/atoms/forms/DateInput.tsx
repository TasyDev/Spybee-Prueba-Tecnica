import { clsx } from 'clsx';
import styles from './date-input.module.scss';

export interface DateInputProps {
  value: string;
  onChange: (isoString: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
  id?: string;
}

export function DateInput({
  value,
  onChange,
  disabled = false,
  hasError = false,
  className,
  id,
}: DateInputProps) {
  return (
    <input
      id={id}
      type="datetime-local"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        styles.dateInput,
        hasError && styles['dateInput--error'],
        disabled && styles['dateInput--disabled'],
        className,
      )}
    />
  );
}
