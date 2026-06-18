import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@/components/atoms/icons/Icon';
import { NavItem } from './NavItem';

const meta: Meta<typeof NavItem> = {
  title: 'Molecules/NavItem',
  component: NavItem,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NavItem>;

export const Default: Story = {
  args: {
    icon: <Icon name="map" size={18} />,
    label: 'Map',
    isActive: false,
  },
};

export const Active: Story = {
  args: {
    icon: <Icon name="map" size={18} />,
    label: 'Map',
    isActive: true,
  },
};
