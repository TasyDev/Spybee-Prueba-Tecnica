import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@/components/atoms/icons/Icon';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: <Icon name="layers" size={22} />,
  },
};

export const Active: Story = {
  args: {
    icon: <Icon name="pin" size={18} />,
    isActive: true,
  },
};
