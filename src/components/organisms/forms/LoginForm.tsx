'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { AuthCard } from '@/components/organisms/auth/AuthCard';
import { FormField } from '@/components/molecules/forms/FormField';
import { Button } from '@/components/atoms/buttons/Button';
import { Icon } from '@/components/atoms/icons/Icon';
import styles from './login-form.module.scss';

export interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  resolver?: any;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export function LoginForm({ onSubmit, resolver, isLoading, error, className }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>({
    resolver,
  });

  return (
    <AuthCard
      title="Bienvenido de nuevo"
      description="Ingresa tus credenciales para acceder al sistema de gestión de obra."
      footerText="¿No tienes cuenta?"
      footerLinkText="Regístrate"
      footerLinkHref="/register"
      className={className}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.form__fields}>
          <FormField
            id="login-email"
            label="CORREO ELECTRÓNICO"
            type="email"
            placeholder="usuario@spybee.com"
            leftIcon="envelope"
            register={register('email')}
            hasError={!!errors.email}
            errorMessage={errors.email?.message as string}
          />
          <FormField
            id="login-password"
            label="CONTRASEÑA"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon="lock"
            register={register('password')}
            hasError={!!errors.password}
            errorMessage={errors.password?.message as string}
            secondaryLabel={
              <Link href="/forgot-password" className={styles.form__link}>
                ¿Olvidaste tu contraseña?
              </Link>
            }
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.form__toggle}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <Icon name={showPassword ? 'eye-slash' : 'eye'} size={22} />
              </button>
            }
          />
        </div>
        {error && (
          <div className={styles.form__error}>{error}</div>
        )}
        <div className={styles.form__actions}>
          <Button type="submit" label={isLoading ? 'Cargando...' : 'Iniciar sesión'} disabled={isLoading} />
        </div>
      </form>
    </AuthCard>
  );
}
