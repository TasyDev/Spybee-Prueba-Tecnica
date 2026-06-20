import type { Meta, StoryObj } from '@storybook/react';
import { EmailVerificationCard } from './EmailVerificationCard';

const meta: Meta<typeof EmailVerificationCard> = {
  title: 'Organisms/EmailVerificationCard',
  component: EmailVerificationCard,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
export default meta;

type Story = StoryObj<typeof EmailVerificationCard>;

export const Verified: Story = {
  args: { variant: 'verified' },
};

export const CheckEmail: Story = {
  args: { variant: 'check-email' },
};
