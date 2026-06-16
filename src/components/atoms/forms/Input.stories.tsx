import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'Ingrese nombre completo' },
};

export const Filled: Story = {
  args: { value: 'usuario@spybee.systems' },
};

export const Password: Story = {
  args: { type: 'password', placeholder: '••••••••' },
};

export const Disabled: Story = {
  args: { placeholder: 'Campo deshabilitado', disabled: true },
};

export const Error: Story = {
  args: { placeholder: 'Campo inválido', hasError: true },
};
