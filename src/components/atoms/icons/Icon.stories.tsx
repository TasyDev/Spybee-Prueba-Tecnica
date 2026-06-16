import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: ['envelope', 'lock', 'eye', 'eye-slash', 'chevron-right', 'chevron-left'],
    },
    size: {
      control: 'number',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Envelope: Story = {
  args: { name: 'envelope', size: 20 },
};

export const Lock: Story = {
  args: { name: 'lock', size: 20 },
};

export const Eye: Story = {
  args: { name: 'eye', size: 20 },
};

export const EyeSlash: Story = {
  args: { name: 'eye-slash', size: 20 },
};
