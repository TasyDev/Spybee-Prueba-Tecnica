import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { children: 'NOMBRE' },
};

export const Long: Story = {
  args: { children: 'CORREO ELECTRÓNICO' },
};
