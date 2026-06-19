import { clsx } from 'clsx';
import { Label } from '@/components/atoms/forms/Label';
import { Select } from '@/components/atoms/forms/Select';
import styles from './select-field.module.scss';

export interface SelectFieldProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  hasError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  hasError,
  errorMessage,
  disabled,
  className,
  id,
}: SelectFieldProps) {
  return (
    <div className={clsx(styles.field, className)}>
      <Label htmlFor={id}>{label}</Label>
      <Select
        id={id}
        value={value}
        options={options}
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
