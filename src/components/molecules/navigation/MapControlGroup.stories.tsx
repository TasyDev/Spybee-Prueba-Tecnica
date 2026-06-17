import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@/components/atoms/icons/Icon';
import { MapControlGroup } from './MapControlGroup';

const meta: Meta<typeof MapControlGroup> = {
  title: 'Molecules/MapControlGroup',
  component: MapControlGroup,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MapControlGroup>;

export const Default: Story = {
  args: {
    groups: [
      [
        { id: 'layers', icon: <Icon name="layers" size={22} /> },
        { id: 'pin', icon: <Icon name="pin" size={18} /> },
        { id: 'route', icon: <Icon name="route" size={18} /> },
      ],
      [
        { id: 'zoom-in', icon: <Icon name="plus" size={14} color="#EBE1D1" /> },
        { id: 'zoom-out', icon: <Icon name="minus" size={14} color="#EBE1D1" /> },
      ],
    ],
  },
};
