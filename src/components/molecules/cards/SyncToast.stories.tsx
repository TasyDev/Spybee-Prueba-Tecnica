import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@/components/atoms/icons/Icon';
import { SyncToast } from './SyncToast';

const meta: Meta<typeof SyncToast> = {
  title: 'Molecules/SyncToast',
  component: SyncToast,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SyncToast>;

export const Default: Story = {
  args: {
    icon: <Icon name="check-circle" size={20} color="#695200" />,
    title: 'Sync Complete',
    message: 'Command center updated with latest site data.',
    visible: true,
  },
};
