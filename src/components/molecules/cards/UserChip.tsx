import { clsx } from 'clsx';
import { Avatar } from '@/components/atoms/images/Avatar';
import styles from './user-chip.module.scss';

export interface UserChipProps {
  avatarUrl: string;
  name: string;
  role: string;
  className?: string;
}

export function UserChip({ avatarUrl, name, role, className }: UserChipProps) {
  return (
    <div className={clsx(styles.userChip, className)}>
      <Avatar src={avatarUrl} alt={name} size={40} />
      <div className={styles.userChip__info}>
        <span className={styles.userChip__name}>{name}</span>
        <span className={styles.userChip__role}>{role}</span>
      </div>
    </div>
  );
}
