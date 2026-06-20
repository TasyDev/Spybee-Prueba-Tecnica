import { clsx } from 'clsx';
import { BackLink } from '@/components/atoms/navigation/BackLink';
import { Logo } from '@/components/atoms/typography/Logo';
import styles from './top-nav.module.scss';

export interface TopNavProps {
  onBack?: () => void;
  backHref?: string;
  className?: string;
  logoElement?: React.ReactNode;
}

export function TopNav({ onBack, backHref, className, logoElement }: TopNavProps) {
  return (
    <nav className={clsx(styles.topNav, className)}>
      <BackLink href={backHref} onClick={onBack} />
      {logoElement || <Logo />}
    </nav>
  );
}
