import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MapSearchNavbar } from './MapSearchNavbar';
import type { Priority, Status } from '@/store/types';

const meta: Meta<typeof MapSearchNavbar> = {
  title: 'Molecules/MapSearchNavbar',
  component: MapSearchNavbar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MapSearchNavbar>;

function StatefulNavbar() {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [projectFilter, setProjectFilter] = useState<string[]>([]);
  const [assigneeFilter, setAssigneeFilter] = useState<string[]>([]);
  const [observerFilter, setObserverFilter] = useState<string[]>([]);
  const [ownerFilter, setOwnerFilter] = useState<string[]>([]);

  const toggle = (id: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const togglePriority = (priority: Priority) => {
    setPriorityFilter((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority],
    );
  };

  const toggleStatus = (status: Status) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  };

  return (
    <MapSearchNavbar
      search={search}
      onSearchChange={setSearch}
      priorityFilter={priorityFilter}
      onPriorityChange={togglePriority}
      statusFilter={statusFilter}
      onStatusChange={toggleStatus}
      typeFilter={typeFilter}
      typeOptions={[
        { id: '1', name: 'Structural' },
        { id: '2', name: 'Electrical' },
        { id: '3', name: 'Plumbing' },
        { id: '4', name: 'Safety' },
      ]}
      onTypeChange={(id) => toggle(id, typeFilter, setTypeFilter)}
      projectFilter={projectFilter}
      projectOptions={[
        { id: 'p1', name: 'Torre Acqua' },
        { id: 'p2', name: 'Altos del Bosque' },
      ]}
      onProjectChange={(id) => toggle(id, projectFilter, setProjectFilter)}
      assigneeFilter={assigneeFilter}
      assigneeOptions={[
        { id: 'u1', name: 'Juan Perez' },
        { id: 'u2', name: 'Maria Lopez' },
      ]}
      onAssigneeChange={(id) => toggle(id, assigneeFilter, setAssigneeFilter)}
      observerFilter={observerFilter}
      observerOptions={[
        { id: 'u1', name: 'Juan Perez' },
        { id: 'u2', name: 'Maria Lopez' },
      ]}
      onObserverChange={(id) => toggle(id, observerFilter, setObserverFilter)}
      ownerFilter={ownerFilter}
      ownerOptions={[
        { id: 'u1', name: 'Juan Perez' },
        { id: 'u2', name: 'Maria Lopez' },
      ]}
      onOwnerChange={(id) => toggle(id, ownerFilter, setOwnerFilter)}
      onRecenter={() => console.log('recenter')}
      onCreateClick={() => console.log('create')}
    />
  );
}

export const Default: Story = {
  render: () => <StatefulNavbar />,
};

export const WithValues: Story = {
  args: {
    search: 'fuga agua',
    onSearchChange: () => {},
    priorityFilter: ['high'],
    onPriorityChange: () => {},
    statusFilter: ['open'],
    onStatusChange: () => {},
    typeFilter: ['1'],
    typeOptions: [
      { id: '1', name: 'Structural' },
      { id: '2', name: 'Electrical' },
      { id: '3', name: 'Plumbing' },
      { id: '4', name: 'Safety' },
    ],
    onTypeChange: () => {},
    projectFilter: [],
    projectOptions: [],
    onProjectChange: () => {},
    assigneeFilter: [],
    assigneeOptions: [],
    onAssigneeChange: () => {},
    observerFilter: [],
    observerOptions: [],
    onObserverChange: () => {},
    ownerFilter: [],
    ownerOptions: [],
    onOwnerChange: () => {},
    onRecenter: () => {},
    onCreateClick: () => {},
  },
};
