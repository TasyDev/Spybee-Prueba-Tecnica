import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Icon } from '@/components/atoms/icons/Icon';
import styles from './filter-dropdown.module.scss';

export interface FilterOption {
  value: string;
  label: string;
  active?: boolean;
}

export interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  onToggle: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export function FilterDropdown({ label, options, onToggle, onClear, className }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeCount = options.filter((o) => o.active).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={clsx(styles.filterDropdown, className)}>
      <button
        type="button"
        className={clsx(
          styles.filterDropdown__trigger,
          activeCount > 0 && styles['filterDropdown__trigger--active'],
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{label}</span>
        {activeCount > 0 && (
          <span className={styles.filterDropdown__badge}>{activeCount}</span>
        )}
        <Icon name="chevron-right" size={14} color={activeCount > 0 ? '#171309' : '#9A9078'} />
      </button>

      {open && (
        <div className={styles.filterDropdown__menu}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={clsx(
                styles.filterDropdown__item,
                option.active && styles['filterDropdown__item--active'],
              )}
              onClick={() => onToggle(option.value)}
            >
              <span className={styles.filterDropdown__check}>
                {option.active && <Icon name="check-circle" size={14} color="#695200" />}
              </span>
              <span>{option.label}</span>
            </button>
          ))}
          {activeCount > 0 && onClear && (
            <button
              type="button"
              className={styles.filterDropdown__clear}
              onClick={() => {
                onClear();
                setOpen(false);
              }}
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
