import { clsx } from 'clsx';
import { Label } from '@/components/atoms/forms/Label';
import { Input } from '@/components/atoms/forms/Input';
import { Icon } from '@/components/atoms/icons/Icon';
import type { IconName } from '@/components/atoms/icons/Icon';
import styles from './form-field.module.scss';

export interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  id?: string;
  leftIcon?: IconName;
  rightElement?: React.ReactNode;
  secondaryLabel?: React.ReactNode;
  register?: any;
}

export function FormField({
  label,
  type,
  placeholder,
  value,
  onChange,
  disabled,
  hasError,
  errorMessage,
  className,
  id,
  leftIcon,
  rightElement,
  secondaryLabel,
  register,
}: FormFieldProps) {
  return (
    <div className={clsx(styles.field, className)}>
      <div className={styles.field__header}>
        <Label htmlFor={id}>{label}</Label>
        {secondaryLabel}
      </div>
      <div className={clsx(styles.field__inputWrapper, (leftIcon || rightElement) && styles['field__inputWrapper--has-icon'])}>
        {leftIcon && (
          <span className={clsx(styles.field__icon, styles['field__icon--left'])}>
            <Icon name={leftIcon} size={20} />
          </span>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          hasError={hasError}
          className={clsx(
            leftIcon && styles['field__input--left-padded'],
            rightElement && styles['field__input--right-padded'],
          )}
          {...register}
        />
        {rightElement && (
          <span className={clsx(styles.field__icon, styles['field__icon--right'])}>
            {rightElement}
          </span>
        )}
      </div>
      {hasError && errorMessage && (
        <span className={styles.field__error}>{errorMessage}</span>
      )}
    </div>
  );
}
