import type { Meta, StoryObj } from '@storybook/react';
import { AuthCard } from './AuthCard';

const meta: Meta<typeof AuthCard> = {
  title: 'Organisms/AuthCard',
  component: AuthCard,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
export default meta;

type Story = StoryObj<typeof AuthCard>;

export const Default: Story = {
  args: {
    title: 'Bienvenido de nuevo',
    description: 'Ingresa tus credenciales para acceder al sistema.',
    footerText: '¿No tienes cuenta?',
    footerLinkText: 'Regístrate',
    footerLinkHref: '/register',
    children: <div style={{ padding: '20px', color: '#fff' }}>Formulario aquí</div>,
  },
};
