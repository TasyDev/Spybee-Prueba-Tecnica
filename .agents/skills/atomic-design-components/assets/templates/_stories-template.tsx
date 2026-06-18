import type { Meta, StoryObj } from '@storybook/react';
import { {PascalName} } from './{PascalName}';

const meta: Meta<typeof {PascalName}> = {
  title: '{Level}/{PascalName}',
  component: {PascalName},
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'disabled'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof {PascalName}>;

export const Primary: Story = {
  args: { variant: 'primary', label: '{PascalName}' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', label: '{PascalName}' },
};

export const Disabled: Story = {
  args: { variant: 'disabled', label: '{PascalName}', disabled: true },
};
