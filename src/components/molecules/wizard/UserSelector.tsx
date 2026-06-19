import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { Input } from '@/components/atoms/forms/Input';
import { Icon } from '@/components/atoms/icons/Icon';
import styles from './user-selector.module.scss';

export interface UserSelectorProps {
  users: Array<{ id: string; name: string; email: string; avatarUrl?: string }>;
  selectedIds: string[];
  onToggle: (userId: string) => void;
  label: string;
  className?: string;
}

export function UserSelector({ users, selectedIds, onToggle, label, className }: UserSelectorProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className={clsx(styles.userSelector, className)}>
      <span className={styles.userSelector__label}>{label}</span>
      <Input
        placeholder="Buscar usuarios..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={styles.userSelector__list}>
        {filtered.map((user) => {
          const isSelected = selectedIds.includes(user.id);
          return (
            <button
              key={user.id}
              type="button"
              onClick={() => onToggle(user.id)}
              className={clsx(
                styles.userSelector__item,
                isSelected && styles['userSelector__item--selected'],
              )}
            >
              <span className={styles.userSelector__name}>{user.name}</span>
              <span className={styles.userSelector__email}>{user.email}</span>
              {isSelected && <Icon name="check-circle" size={14} color="#695200" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
