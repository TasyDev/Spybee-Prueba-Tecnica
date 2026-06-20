import { clsx } from 'clsx';
import { Chip } from '@/components/atoms/chips/Chip';
import styles from './chip-list.module.scss';

export interface ChipListProps {
  chips: Array<{ id: string; label: string; color?: string }>;
  onRemove: (id: string) => void;
  className?: string;
}

export function ChipList({ chips, onRemove, className }: ChipListProps) {
  if (chips.length === 0) return null;

  return (
    <div className={clsx(styles.chipList, className)}>
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          label={chip.label}
          color={chip.color}
          onRemove={() => onRemove(chip.id)}
        />
      ))}
    </div>
  );
}
