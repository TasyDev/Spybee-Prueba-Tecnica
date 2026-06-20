import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@/components/atoms/icons/Icon';
import { MapMarker } from './MapMarker';

const meta: Meta<typeof MapMarker> = {
  title: 'Atoms/MapMarker',
  component: MapMarker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MapMarker>;

export const Critical: Story = {
  args: {
    variant: 'critical',
    pulsing: true,
    icon: <Icon name="alert" size={16} color="white" />,
  },
};

export const Watchlist: Story = {
  args: {
    variant: 'watchlist',
    icon: <Icon name="check-circle" size={12} color="#695200" />,
  },
};

export const Logged: Story = {
  args: {
    variant: 'logged',
    icon: <Icon name="activity" size={12} color="#EBE1D1" />,
  },
};
