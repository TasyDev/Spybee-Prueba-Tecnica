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
  projectFilter: string[];
  projectOptions: Array<{ id: string; name: string }>;
  onProjectChange: (projectId: string) => void;
  assigneeFilter: string[];
  assigneeOptions: Array<{ id: string; name: string }>;
  onAssigneeChange: (userId: string) => void;
  observerFilter: string[];
  observerOptions: Array<{ id: string; name: string }>;
  onObserverChange: (userId: string) => void;
  ownerFilter: string[];
  ownerOptions: Array<{ id: string; name: string }>;
  onOwnerChange: (userId: string) => void;
  onRecenter: () => void;
  onCreateClick?: () => void;
  className?: string;
}

const PRIORITY_OPTIONS: Array<{ value: Priority; label: string }> = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
];

const STATUS_OPTIONS: Array<{ value: Status; label: string }> = [
  { value: 'open', label: 'Abierto' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'resolved', label: 'Resuelto' },
  { value: 'closed', label: 'Cerrado' },
  { value: 'rejected', label: 'Rechazado' },
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
  projectFilter,
  projectOptions,
  onProjectChange,
  assigneeFilter,
  assigneeOptions,
  onAssigneeChange,
  observerFilter,
  observerOptions,
  onObserverChange,
  ownerFilter,
  ownerOptions,
  onOwnerChange,
  onRecenter,
  onCreateClick,
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

  const projectDropdownOptions = projectOptions.map((o) => ({
    value: o.id,
    label: o.name,
    active: projectFilter.includes(o.id),
  }));

  const assigneeDropdownOptions = assigneeOptions.map((o) => ({
    value: o.id,
    label: o.name,
    active: assigneeFilter.includes(o.id),
  }));

  const observerDropdownOptions = observerOptions.map((o) => ({
    value: o.id,
    label: o.name,
    active: observerFilter.includes(o.id),
  }));

  const ownerDropdownOptions = ownerOptions.map((o) => ({
    value: o.id,
    label: o.name,
    active: ownerFilter.includes(o.id),
  }));

  return (
    <div className={clsx(styles.mapSearchNavbar, className)}>
      <div className={styles.mapSearchNavbar__search}>
        <Icon name="search" size={16} color="#9A9078" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar incidencias..."
          className={styles.mapSearchNavbar__input}
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className={styles.mapSearchNavbar__clear}
            aria-label="Limpiar búsqueda"
          >
            <Icon name="x" size={14} color="#9A9078" />
          </button>
        )}
      </div>

      <div className={styles.mapSearchNavbar__filters}>
        <FilterDropdown
          label="Prioridad"
          options={priorityDropdownOptions}
          onToggle={(value) => onPriorityChange(value as Priority)}
        />
        <FilterDropdown
          label="Estado"
          options={statusDropdownOptions}
          onToggle={(value) => onStatusChange(value as Status)}
        />
        <FilterDropdown
          label="Tipo"
          options={typeDropdownOptions}
          onToggle={(value) => onTypeChange(value)}
        />
        <FilterDropdown
          label="Proyecto"
          options={projectDropdownOptions}
          onToggle={(value) => onProjectChange(value)}
        />
        <FilterDropdown
          label="Asignado"
          options={assigneeDropdownOptions}
          onToggle={(value) => onAssigneeChange(value)}
        />
        <FilterDropdown
          label="Observador"
          options={observerDropdownOptions}
          onToggle={(value) => onObserverChange(value)}
        />
        <FilterDropdown
          label="Propietario"
          options={ownerDropdownOptions}
          onToggle={(value) => onOwnerChange(value)}
        />
      </div>

      <div className={styles.mapSearchNavbar__actions}>
        {onCreateClick && (
          <button
            type="button"
            onClick={onCreateClick}
            className={styles.mapSearchNavbar__create}
            aria-label="Crear incidencia"
            title="Crear incidencia"
          >
            <Icon name="plus" size={16} color="#EBE1D1" />
          </button>
        )}
        <button
          type="button"
          onClick={onRecenter}
          className={styles.mapSearchNavbar__recenter}
          aria-label="Centrar mapa"
          title="Centrar mapa"
        >
          <Icon name="crosshair" size={16} color="#EBE1D1" />
        </button>
      </div>
    </div>
  );
}
