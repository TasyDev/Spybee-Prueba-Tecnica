import type { Meta, StoryObj } from '@storybook/react';
import { TopNav } from './TopNav';

const meta: Meta<typeof TopNav> = {
  title: 'Organisms/TopNav',
  component: TopNav,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
export default meta;

type Story = StoryObj<typeof TopNav>;

export const Default: Story = {};

export const WithBackLink: Story = {
  args: { backHref: '/' },
};
