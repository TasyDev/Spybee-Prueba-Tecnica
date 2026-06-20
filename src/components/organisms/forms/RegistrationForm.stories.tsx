import type { Meta, StoryObj } from '@storybook/react';
import { RegistrationForm } from './RegistrationForm';

const meta: Meta<typeof RegistrationForm> = {
  title: 'Organisms/RegistrationForm',
  component: RegistrationForm,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
export default meta;

type Story = StoryObj<typeof RegistrationForm>;

export const Default: Story = {};
