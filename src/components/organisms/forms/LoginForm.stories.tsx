import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './LoginForm';

const meta: Meta<typeof LoginForm> = {
  title: 'Organisms/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
export default meta;

type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    onSubmit: (data) => {
      console.log('Login attempt:', data);
    },
  },
};
