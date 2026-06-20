import type { Meta, StoryObj } from '@storybook/react';
import { FormHeading } from './FormHeading';

const meta: Meta<typeof FormHeading> = {
  title: 'Atoms/FormHeading',
  component: FormHeading,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof FormHeading>;

export const Default: Story = {
  args: {
    title: 'Bienvenido de nuevo',
    description: 'Ingresa tus credenciales para acceder al sistema de gestión de obra.',
  },
};

export const LongDescription: Story = {
  args: {
    title: 'Regístrate',
    description: 'Completa tus datos para acceder al sistema de gestión de obra.',
  },
};
