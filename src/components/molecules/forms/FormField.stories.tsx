import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: 'NOMBRE',
    placeholder: 'Ingrese nombre completo',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'CORREO ELECTRÓNICO',
    placeholder: 'usuario@spybee.com',
    leftIcon: 'envelope',
  },
};

export const Password: Story = {
  args: {
    label: 'CONTRASEÑA',
    type: 'password',
    placeholder: '••••••••',
  },
};

export const Error: Story = {
  args: {
    label: 'CONTRASEÑA',
    type: 'password',
    hasError: true,
    errorMessage: 'La contraseña debe tener al menos 8 caracteres.',
  },
};
