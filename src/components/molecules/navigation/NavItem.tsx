'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import styles from './nav-item.module.scss';

export interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function NavItem({ icon, label, isActive = false, href, onClick, className }: NavItemProps) {
  const classNames = clsx(
    styles.navItem,
    isActive && styles['navItem--active'],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classNames}>
        <span className={styles.navItem__icon}>{icon}</span>
        <span className={styles.navItem__label}>{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames}
    >
      <span className={styles.navItem__icon}>{icon}</span>
      <span className={styles.navItem__label}>{label}</span>
    </button>
  );
}
