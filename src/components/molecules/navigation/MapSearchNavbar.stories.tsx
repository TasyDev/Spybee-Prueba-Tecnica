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

  const toggleType = (typeId: string) => {
    setTypeFilter((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId],
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
      onTypeChange={toggleType}
      onRecenter={() => console.log('recenter')}
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
    onRecenter: () => {},
  },
};
