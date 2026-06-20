import { clsx } from 'clsx';
import { FileInput } from '@/components/atoms/forms/FileInput';
import { Icon } from '@/components/atoms/icons/Icon';
import styles from './file-uploader.module.scss';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface PendingFile {
  file: File;
  preview: string;
  status: UploadStatus;
  error?: string;
  mediaId?: string;
  mediaUrl?: string;
}

export interface FileUploaderProps {
  pendingFiles: PendingFile[];
  onFilesAdded: (files: File[]) => void;
  onFileRemoved: (index: number) => void;
  onRetryUpload?: (index: number) => void;
  isCreatingDraft?: boolean;
  className?: string;
}

export function FileUploader({
  pendingFiles,
  onFilesAdded,
  onFileRemoved,
  onRetryUpload,
  isCreatingDraft,
  className,
}: FileUploaderProps) {
  return (
    <div className={clsx(styles.fileUploader, className)}>
      <FileInput onFilesSelected={onFilesAdded} multiple accept="image/*,video/*,.pdf,.doc,.docx" />

      {isCreatingDraft && (
        <div className={styles.fileUploader__drafting}>
          <Icon name="loader" size={16} color="#9A9078" />
          <span>Creando borrador de incidencia...</span>
        </div>
      )}

      {pendingFiles.length > 0 && (
        <div className={styles.fileUploader__list}>
          {pendingFiles.map((item, index) => {
            const isImage = item.file.type.startsWith('image/');
            return (
              <div
                key={index}
                className={clsx(
                  styles.fileUploader__item,
                  item.status === 'error' && styles['fileUploader__item--error'],
                  item.status === 'success' && styles['fileUploader__item--success'],
                )}
              >
                {isImage ? (
                  <img src={item.preview} alt={item.file.name} className={styles.fileUploader__preview} />
                ) : (
                  <div className={styles.fileUploader__icon}>
                    <Icon name="file" size={24} color="#9A9078" />
                  </div>
                )}

                <div className={styles.fileUploader__info}>
                  <span className={styles.fileUploader__name}>{item.file.name}</span>
                  {item.status === 'uploading' && (
                    <span className={styles.fileUploader__status}>
                      <Icon name="loader" size={12} color="#9A9078" />
                      Subiendo...
                    </span>
                  )}
                  {item.status === 'success' && (
                    <span className={styles.fileUploader__status}>
                      <Icon name="check" size={12} color="#4ade80" />
                      Subido
                    </span>
                  )}
                  {item.status === 'error' && item.error && (
                    <span className={styles.fileUploader__status}>
                      <Icon name="alert-circle" size={12} color="#f87171" />
                      {item.error}
                    </span>
                  )}
                </div>

                <div className={styles.fileUploader__actions}>
                  {item.status === 'error' && onRetryUpload && (
                    <button
                      type="button"
                      onClick={() => onRetryUpload(index)}
                      className={styles.fileUploader__retry}
                      aria-label={`Reintentar subida de ${item.file.name}`}
                    >
                      <Icon name="refresh-cw" size={14} color="#EBE1D1" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onFileRemoved(index)}
                    className={styles.fileUploader__remove}
                    aria-label={`Eliminar ${item.file.name}`}
                  >
                    <Icon name="x" size={14} color="#EBE1D1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
