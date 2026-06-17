import type { Meta, StoryObj } from '@storybook/react';
import { UserChip } from './UserChip';

const meta: Meta<typeof UserChip> = {
  title: 'Molecules/UserChip',
  component: UserChip,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserChip>;

export const Default: Story = {
  args: {
    avatarUrl: 'https://placehold.co/40x40',
    name: 'Alex Rivera',
    role: 'Site Supervisor',
  },
};
