import type { Meta, StoryObj } from '@storybook/react';
import { IncidentPopup } from './IncidentPopup';

const meta: Meta<typeof IncidentPopup> = {
  title: 'Molecules/IncidentPopup',
  component: IncidentPopup,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IncidentPopup>;

export const Default: Story = {
  args: {
    title: 'CRITICAL INCIDENT #842',
    location: 'Unsecured Scaffolding Section 4',
    timeAgo: 'Reported 12m ago',
    visible: true,
  },
};
