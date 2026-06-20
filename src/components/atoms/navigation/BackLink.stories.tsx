import type { Meta, StoryObj } from '@storybook/react';
import { BackLink } from './BackLink';

const meta: Meta<typeof BackLink> = {
  title: 'Atoms/BackLink',
  component: BackLink,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof BackLink>;

export const AsLink: Story = {
  args: { href: '/' },
};

export const AsButton: Story = {
  args: { onClick: () => console.log('Volver') },
};
