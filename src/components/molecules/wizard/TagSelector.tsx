import { useState } from 'react';
import { clsx } from 'clsx';
import { Input } from '@/components/atoms/forms/Input';
import { Button } from '@/components/atoms/buttons/Button';
import { Chip } from '@/components/atoms/chips/Chip';
import styles from './tag-selector.module.scss';

export interface TagSelectorProps {
  existingTags: Array<{ id: string; name: string; color?: string }>;
  selectedTagIds: string[];
  onToggleExisting: (tagId: string) => void;
  pendingTags: Array<{ name: string; color: string }>;
  onAddPending: (name: string, color: string) => void;
  onRemovePending: (index: number) => void;
  className?: string;
}

export function TagSelector({
  existingTags,
  selectedTagIds,
  onToggleExisting,
  pendingTags,
  onAddPending,
  onRemovePending,
  className,
}: TagSelectorProps) {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#695200');

  const handleAdd = () => {
    const name = newTagName.trim();
    if (!name) return;
    onAddPending(name, newTagColor);
    setNewTagName('');
  };

  return (
    <div className={clsx(styles.tagSelector, className)}>
      <span className={styles.tagSelector__label}>Etiquetas existentes</span>
      <div className={styles.tagSelector__existing}>
        {existingTags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggleExisting(tag.id)}
              className={clsx(
                styles.tagSelector__tag,
                isSelected && styles['tagSelector__tag--selected'],
              )}
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </button>
          );
        })}
      </div>

      <span className={styles.tagSelector__label}>Nueva etiqueta</span>
      <div className={styles.tagSelector__create}>
        <Input
          placeholder="Nombre de etiqueta"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
        <input
          type="color"
          value={newTagColor}
          onChange={(e) => setNewTagColor(e.target.value)}
          className={styles.tagSelector__color}
        />
        <Button label="Agregar" onClick={handleAdd} fullWidth={false} />
      </div>

      {pendingTags.length > 0 && (
        <div className={styles.tagSelector__pending}>
          {pendingTags.map((tag, index) => (
            <Chip
              key={index}
              label={tag.name}
              color={tag.color}
              onRemove={() => onRemovePending(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
