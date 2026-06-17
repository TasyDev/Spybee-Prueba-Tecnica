import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {
    activeItem: 'map',
    user: {
      name: 'Alex Rivera',
      role: 'Site Supervisor',
      avatarUrl: 'https://placehold.co/40x40',
    },
  },
};

export const DashboardsActive: Story = {
  args: {
    activeItem: 'dashboards',
    user: {
      name: 'Alex Rivera',
      role: 'Site Supervisor',
      avatarUrl: 'https://placehold.co/40x40',
    },
  },
};
