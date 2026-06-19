import { clsx } from 'clsx';
import { Label } from '@/components/atoms/forms/Label';
import { DateInput } from '@/components/atoms/forms/DateInput';
import styles from './date-field.module.scss';

export interface DateFieldProps {
  label: string;
  value: string;
  onChange: (isoString: string) => void;
  hasError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function DateField({
  label,
  value,
  onChange,
  hasError,
  errorMessage,
  disabled,
  className,
  id,
}: DateFieldProps) {
  return (
    <div className={clsx(styles.field, className)}>
      <Label htmlFor={id}>{label}</Label>
      <DateInput
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        hasError={hasError}
      />
      {hasError && errorMessage && (
        <span className={styles.field__error}>{errorMessage}</span>
      )}
    </div>
  );
}
