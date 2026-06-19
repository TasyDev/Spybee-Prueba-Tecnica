import { useRef, useCallback } from 'react';
import { clsx } from 'clsx';
import { Icon } from '@/components/atoms/icons/Icon';
import styles from './file-input.module.scss';

export interface FileInputProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FileInput({
  onFilesSelected,
  accept,
  multiple = true,
  disabled = false,
  className,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFilesSelected(files);
      }
      e.target.value = '';
    },
    [onFilesSelected],
  );

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={clsx(styles.fileInput, disabled && styles['fileInput--disabled'], className)}
      >
        <Icon name="upload" size={20} color="#9A9078" />
        <span>Haz clic para subir archivos</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
        className={styles.fileInput__hidden}
      />
    </>
  );
}
