import { clsx } from 'clsx';
import { Label } from '@/components/atoms/forms/Label';
import { TextArea } from '@/components/atoms/forms/TextArea';
import styles from './textarea-field.module.scss';

export interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  hasError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
  id?: string;
}

export function TextAreaField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  hasError,
  errorMessage,
  disabled,
  rows,
  className,
  id,
}: TextAreaFieldProps) {
  return (
    <div className={clsx(styles.field, className)}>
      <Label htmlFor={id}>{label}</Label>
      <TextArea
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        hasError={hasError}
        rows={rows}
      />
      {hasError && errorMessage && (
        <span className={styles.field__error}>{errorMessage}</span>
      )}
    </div>
  );
}
