'use client';

import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/atoms/typography/Logo';
import { Icon } from '@/components/atoms/icons/Icon';
import { NavItem } from '@/components/molecules/navigation/NavItem';
import { UserChip } from '@/components/molecules/cards/UserChip';
import styles from './sidebar.module.scss';

export interface SidebarProps {
  user: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  logoElement?: React.ReactNode;
  activeItem?: 'map' | 'dashboards' | 'settings';
  className?: string;
}

export function Sidebar({ user, logoElement, activeItem: activeItemProp, className }: SidebarProps) {
  const pathname = usePathname();
  const activeItem = activeItemProp ?? (
    pathname.startsWith('/map') ? 'map'
    : pathname.startsWith('/dashboard') ? 'dashboards'
    : pathname.startsWith('/settings') ? 'settings'
    : undefined
  );

  return (
    <aside className={clsx(styles.sidebar, className)}>
      <div className={styles.sidebar__header}>
        {logoElement || <Logo variant="mark" />}
      </div>

      <nav className={styles.sidebar__nav}>
        <NavItem
          icon={<Icon name="map" size={18} />}
          label="Map"
          href="/map"
          isActive={activeItem === 'map'}
        />
        <NavItem
          icon={<Icon name="layout" size={18} />}
          label="Dashboards"
          href="/dashboard"
          isActive={activeItem === 'dashboards'}
        />
      </nav>

      <div className={styles.sidebar__footer}>
        <NavItem
          icon={<Icon name="settings" size={18} />}
          label="Settings"
          href="/settings"
          isActive={activeItem === 'settings'}
        />
        <div className={styles.sidebar__divider} />
        <div className={styles.sidebar__user}>
          <UserChip
            avatarUrl={user.avatarUrl}
            name={user.name}
            role={user.role}
          />
        </div>
      </div>
    </aside>
  );
}
