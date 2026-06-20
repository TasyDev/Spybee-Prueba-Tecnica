import { clsx } from 'clsx';
import { forwardRef } from 'react';
import styles from './input.module.scss';

export interface InputProps {
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    disabled = false,
    hasError = false,
    className,
    id,
    name,
  }, ref) {
    return (
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={clsx(
          styles.input,
          hasError && styles['input--error'],
          disabled && styles['input--disabled'],
          className,
        )}
      />
    );
  }
);
