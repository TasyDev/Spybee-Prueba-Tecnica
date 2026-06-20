import type { Meta, StoryObj } from '@storybook/react';
import { LegendDot } from './LegendDot';

const meta: Meta<typeof LegendDot> = {
  title: 'Atoms/LegendDot',
  component: LegendDot,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LegendDot>;

export const Critical: Story = {
  args: { variant: 'critical', pulsing: true },
};

export const Watchlist: Story = {
  args: { variant: 'watchlist', pulsing: true },
};

export const Logged: Story = {
  args: { variant: 'logged' },
};
