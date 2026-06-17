import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FilterDropdown } from './FilterDropdown';

const meta: Meta<typeof FilterDropdown> = {
  title: 'Molecules/FilterDropdown',
  component: FilterDropdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FilterDropdown>;

function StatefulDropdown() {
  const [active, setActive] = useState<string[]>([]);

  const toggle = (value: string) => {
    setActive((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return (
    <FilterDropdown
      label="Priority"
      options={[
        { value: 'high', label: 'Critical', active: active.includes('high') },
        { value: 'medium', label: 'Medium', active: active.includes('medium') },
        { value: 'low', label: 'Low', active: active.includes('low') },
      ]}
      onToggle={toggle}
      onClear={() => setActive([])}
    />
  );
}

export const Default: Story = {
  render: () => <StatefulDropdown />,
};
