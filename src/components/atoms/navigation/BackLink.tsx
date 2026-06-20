'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { Icon } from '@/components/atoms/icons/Icon';
import styles from './back-link.module.scss';

export interface BackLinkProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function BackLink({ href, onClick, className }: BackLinkProps) {
  const content = (
    <>
      <Icon name="chevron-left" size={16} />
      <span className={styles.backLink__text}>Volver</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={clsx(styles.backLink, className)}>
        {content}
      </Link>
    );
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.history.back();
    }
  };

  return (
    <button type="button" onClick={handleClick} className={clsx(styles.backLink, className)}>
      {content}
    </button>
  );
}
