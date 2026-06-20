import type { Meta, StoryObj } from '@storybook/react';
import { MapLegend } from './MapLegend';

const meta: Meta<typeof MapLegend> = {
  title: 'Molecules/MapLegend',
  component: MapLegend,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MapLegend>;

export const Default: Story = {
  args: {
    title: 'MAP LEGEND',
    items: [
      { variant: 'critical', label: 'High Priority Action' },
      { variant: 'watchlist', label: 'Watchlist Active' },
      { variant: 'logged', label: 'Logged Activity' },
    ],
  },
};
