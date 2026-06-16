import { clsx } from 'clsx';
import Link from 'next/link';
import { FormHeading } from '@/components/atoms/typography/FormHeading';
import styles from './auth-card.module.scss';

export interface AuthCardProps {
  title: string;
  description: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
  className?: string;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  description,
  footerText,
  footerLinkText,
  footerLinkHref,
  className,
  children,
}: AuthCardProps) {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <FormHeading title={title} description={description} />
      <div className={styles.card}>{children}</div>
      {footerText && footerLinkText && footerLinkHref && (
        <footer className={styles.footer}>
          <span className={styles.footerText}>{footerText}</span>
          <Link href={footerLinkHref} className={styles.footerLink}>
            {footerLinkText}
          </Link>
        </footer>
      )}
    </div>
  );
}
