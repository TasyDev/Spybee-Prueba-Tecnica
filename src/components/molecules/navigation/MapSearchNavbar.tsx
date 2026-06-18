import { clsx } from 'clsx';
import { Icon } from '@/components/atoms/icons/Icon';
import { FilterDropdown } from './FilterDropdown';
import type { Priority, Status } from '@/store/types';
import styles from './map-search-navbar.module.scss';

export interface MapSearchNavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  priorityFilter: Priority[];
  onPriorityChange: (priority: Priority) => void;
  statusFilter: Status[];
  onStatusChange: (status: Status) => void;
  typeFilter: string[];
  typeOptions: Array<{ id: string; name: string }>;
  onTypeChange: (typeId: string) => void;
  onRecenter: () => void;
  className?: string;
}

const PRIORITY_OPTIONS: Array<{ value: Priority; label: string }> = [
  { value: 'high', label: 'Critical' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const STATUS_OPTIONS: Array<{ value: Status; label: string }> = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' },
];

export function MapSearchNavbar({
  search,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  typeOptions,
  onTypeChange,
  onRecenter,
  className,
}: MapSearchNavbarProps) {
  const priorityDropdownOptions = PRIORITY_OPTIONS.map((o) => ({
    value: o.value,
    label: o.label,
    active: priorityFilter.includes(o.value),
  }));

  const statusDropdownOptions = STATUS_OPTIONS.map((o) => ({
    value: o.value,
    label: o.label,
    active: statusFilter.includes(o.value),
  }));

  const typeDropdownOptions = typeOptions.map((o) => ({
    value: o.id,
    label: o.name,
    active: typeFilter.includes(o.id),
  }));

  return (
    <div className={clsx(styles.mapSearchNavbar, className)}>
      <div className={styles.mapSearchNavbar__search}>
        <Icon name="search" size={16} color="#9A9078" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search incidents..."
          className={styles.mapSearchNavbar__input}
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className={styles.mapSearchNavbar__clear}
            aria-label="Clear search"
          >
            <Icon name="x" size={14} color="#9A9078" />
          </button>
        )}
      </div>

      <div className={styles.mapSearchNavbar__filters}>
        <FilterDropdown
          label="Priority"
          options={priorityDropdownOptions}
          onToggle={(value) => onPriorityChange(value as Priority)}
        />
        <FilterDropdown
          label="Status"
          options={statusDropdownOptions}
          onToggle={(value) => onStatusChange(value as Status)}
        />
        <FilterDropdown
          label="Type"
          options={typeDropdownOptions}
          onToggle={(value) => onTypeChange(value)}
        />
      </div>

      <button
        type="button"
        onClick={onRecenter}
        className={styles.mapSearchNavbar__recenter}
        aria-label="Recenter map"
        title="Recenter map"
      >
        <Icon name="crosshair" size={16} color="#EBE1D1" />
      </button>
    </div>
  );
}
