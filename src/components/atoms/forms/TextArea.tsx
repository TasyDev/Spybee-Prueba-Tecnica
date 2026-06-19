import { clsx } from 'clsx';
import { forwardRef } from 'react';
import styles from './textarea.module.scss';

export interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
  rows?: number;
  id?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    { value, onChange, onBlur, placeholder, disabled = false, hasError = false, className, rows = 4, id },
    ref,
  ) {
    return (
      <textarea
        ref={ref}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={clsx(
          styles.textarea,
          hasError && styles['textarea--error'],
          disabled && styles['textarea--disabled'],
          className,
        )}
      />
    );
  },
);
