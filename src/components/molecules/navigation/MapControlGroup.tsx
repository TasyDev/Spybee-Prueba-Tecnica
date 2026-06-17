import { clsx } from 'clsx';
import { IconButton } from '@/components/atoms/buttons/IconButton';
import styles from './map-control-group.module.scss';

export interface MapControlButton {
  id: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export interface MapControlGroupProps {
  groups: MapControlButton[][];
  className?: string;
}

export function MapControlGroup({ groups, className }: MapControlGroupProps) {
  return (
    <div className={clsx(styles.mapControlGroup, className)}>
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className={styles.mapControlGroup__section}>
          {group.map((button) => (
            <IconButton
              key={button.id}
              icon={button.icon}
              isActive={button.isActive}
              onClick={button.onClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
