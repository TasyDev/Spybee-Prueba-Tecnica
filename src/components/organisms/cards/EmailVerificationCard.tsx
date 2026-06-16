import { clsx } from 'clsx';
import { Icon } from '@/components/atoms/icons/Icon';
import { FormHeading } from '@/components/atoms/typography/FormHeading';
import { Button } from '@/components/atoms/buttons/Button';
import styles from './email-verification-card.module.scss';

export type VerificationVariant = 'verified' | 'check-email';

export interface EmailVerificationCardProps {
  variant?: VerificationVariant;
  onAction?: () => void;
  className?: string;
}

const VARIANT_CONFIG: Record<VerificationVariant, {
  title: string;
  description: string;
  buttonLabel: string;
}> = {
  verified: {
    title: 'Email verificado',
    description: 'Tu cuenta ha sido activada con éxito. Ya puedes acceder a la plataforma.',
    buttonLabel: 'Inicia Sesión',
  },
  'check-email': {
    title: 'Revisa tu email',
    description: 'Te hemos enviado un enlace de verificación a tu correo.',
    buttonLabel: 'Continuar',
  },
};

export function EmailVerificationCard({
  variant = 'verified',
  onAction,
  className,
}: EmailVerificationCardProps) {
  const config = VARIANT_CONFIG[variant];

  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.card__glow} />
      <div className={styles.card__iconWrapper}>
        <div className={styles.card__iconCircle}>
          <Icon name="envelope" size={35} color="var(--color-on-primary)" />
        </div>
      </div>
      <div className={styles.card__content}>
        <FormHeading
          title={config.title}
          description={config.description}
        />
      </div>
      {onAction && (
        <div className={styles.card__action}>
          <Button
            label={config.buttonLabel}
            onClick={onAction}
            rightIcon="chevron-right"
          />
        </div>
      )}
    </div>
  );
}
