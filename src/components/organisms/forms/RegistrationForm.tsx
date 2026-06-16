'use client';

import { clsx } from 'clsx';
import { useForm } from 'react-hook-form';
import { AuthCard } from '@/components/organisms/auth/AuthCard';
import { FormField } from '@/components/molecules/forms/FormField';
import { Button } from '@/components/atoms/buttons/Button';
import styles from './registration-form.module.scss';

export interface RegistrationFormValues {
  name: string;
  email: string;
  password: string;
}

export interface RegistrationFormProps {
  onSubmit: (values: RegistrationFormValues) => void;
  resolver?: any;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export function RegistrationForm({ onSubmit, resolver, isLoading, error, className }: RegistrationFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormValues>({
    resolver,
  });

  return (
    <AuthCard
      title="Crea tu cuenta"
      description="Completa tus datos para acceder al sistema de gestión de obra."
      footerText="¿Ya tienes cuenta?"
      footerLinkText="Inicia sesión"
      footerLinkHref="/login"
      className={className}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.form__fields}>
          <FormField
            id="reg-name"
            label="NOMBRE"
            placeholder="Ingrese nombre completo"
            register={register('name')}
            hasError={!!errors.name}
            errorMessage={errors.name?.message as string}
          />
          <FormField
            id="reg-email"
            label="CORREO ELECTRÓNICO"
            type="email"
            placeholder="usuario@spybee.systems"
            register={register('email')}
            hasError={!!errors.email}
            errorMessage={errors.email?.message as string}
          />
          <FormField
            id="reg-password"
            label="CONTRASEÑA"
            type="password"
            placeholder="••••••••"
            register={register('password')}
            hasError={!!errors.password}
            errorMessage={errors.password?.message as string}
          />
        </div>
        {error && (
          <div className={styles.form__error}>{error}</div>
        )}
        <div className={styles.form__actions}>
          <Button type="submit" label={isLoading ? 'Cargando...' : 'Crear cuenta'} disabled={isLoading} />
        </div>
      </form>
    </AuthCard>
  );
}
