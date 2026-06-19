import { useState } from 'react';
import { clsx } from 'clsx';
import { Button } from '@/components/atoms/buttons/Button';
import { Icon } from '@/components/atoms/icons/Icon';
import { StepIndicator } from '@/components/atoms/navigation/StepIndicator';
import { FormField } from '@/components/molecules/forms/FormField';
import { Input } from '@/components/atoms/forms/Input';
import { SelectField } from '@/components/molecules/forms/SelectField';
import { TextAreaField } from '@/components/molecules/forms/TextAreaField';
import { DateField } from '@/components/molecules/forms/DateField';
import { UserSelector } from '@/components/molecules/wizard/UserSelector';
import { TagSelector } from '@/components/molecules/wizard/TagSelector';
import { FileUploader } from '@/components/molecules/wizard/FileUploader';
import { projectApi } from '@/services/projectApi';
import type { PendingFile } from '@/components/molecules/wizard/FileUploader';
import type { Priority, Project } from '@/store/types';
import styles from './IncidentCreationModal.module.scss';

const WIZARD_STEPS = [
  { label: 'Información' },
  { label: 'Asignaciones' },
  { label: 'Archivos' },
];

interface DraftData {
  title: string;
  description: string;
  priority: Priority;
  incidentTypeId: string;
  projectId: string;
  dueDate: string;
  whatsappOwner: string;
  locationDescription: string;
}

interface UserOption {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface TagOption {
  id: string;
  name: string;
  color?: string;
}

interface PendingTag {
  name: string;
  color: string;
}

export interface IncidentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: 1 | 2 | 3;
  onStepChange: (step: 1 | 2 | 3) => void;

  draft: DraftData;
  onDraftChange: (field: keyof DraftData, value: string) => void;

  assigneeIds: string[];
  observerIds: string[];
  selectedTagIds: string[];
  pendingTags: PendingTag[];
  onToggleAssignee: (userId: string) => void;
  onToggleObserver: (userId: string) => void;
  onToggleTag: (tagId: string) => void;
  onAddPendingTag: (name: string, color: string) => void;
  onRemovePendingTag: (index: number) => void;

  pendingFiles: PendingFile[];
  onFilesAdded: (files: File[]) => void;
  onFileRemoved: (index: number) => void;
  onRetryUpload?: (index: number) => void;
  isCreatingDraft?: boolean;

  incidentTypes: TagOption[];
  projects: TagOption[];
  users: UserOption[];
  existingTags: TagOption[];

  onSubmit: () => void;
  onCancel?: () => void;
  onProjectCreated?: (project: Project) => void;
  isSubmitting: boolean;
  errors: Record<string, string>;
  draftId?: string | null;
}

export function IncidentCreationModal({
  isOpen,
  onClose,
  step,
  onStepChange,
  draft,
  onDraftChange,
  assigneeIds,
  observerIds,
  selectedTagIds,
  pendingTags,
  onToggleAssignee,
  onToggleObserver,
  onToggleTag,
  onAddPendingTag,
  onRemovePendingTag,
  pendingFiles,
  onFilesAdded,
  onFileRemoved,
  onRetryUpload,
  isCreatingDraft,
  incidentTypes,
  projects,
  users,
  existingTags,
  onSubmit,
  onCancel,
  onProjectCreated,
  isSubmitting,
  errors,
  draftId,
}: IncidentCreationModalProps) {
  if (!isOpen) return null;

  const priorityOptions: Array<{ value: string; label: string }> = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
  ];

  const typeOptions = [{ value: '', label: 'Seleccionar tipo...' }, ...incidentTypes.map((t) => ({ value: t.id, label: t.name }))];
  const projectOptions = [{ value: '', label: 'Seleccionar proyecto...' }, ...projects.map((p) => ({ value: p.id, label: p.name }))];

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const handleCreateProject = async () => {
    const name = projectNameInput.trim();
    if (!name) return;
    setIsCreatingProject(true);
    try {
      const project = await projectApi.create({ name });
      onDraftChange('projectId', project.id);
      onProjectCreated?.(project);
      setShowCreateProject(false);
      setProjectNameInput('');
    } catch {
      // Error creating project
    } finally {
      setIsCreatingProject(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modal__header}>
          <h2 className={styles.modal__title}>Crear incidencia</h2>
          <button type="button" onClick={onClose} className={styles.modal__close} aria-label="Cerrar">
            <Icon name="x" size={18} color="#EBE1D1" />
          </button>
        </div>

        <div className={styles.modal__stepper}>
          <StepIndicator steps={WIZARD_STEPS} currentStep={step} />
        </div>

        <div className={styles.modal__body}>
          {step === 1 && (
            <div className={styles.modal__step}>
              <FormField
                label="Título *"
                placeholder="Título de la incidencia"
                value={draft.title}
                onChange={(e) => onDraftChange('title', e.target.value)}
                hasError={!!errors.title}
                errorMessage={errors.title}
              />
              <TextAreaField
                label="Descripción *"
                placeholder="Describe la incidencia"
                value={draft.description}
                onChange={(e) => onDraftChange('description', e.target.value)}
                hasError={!!errors.description}
                errorMessage={errors.description}
              />
              <SelectField
                label="Prioridad"
                value={draft.priority}
                options={priorityOptions}
                onChange={(value) => onDraftChange('priority', value as Priority)}
              />
              <SelectField
                label="Tipo"
                value={draft.incidentTypeId}
                options={typeOptions}
                onChange={(value) => onDraftChange('incidentTypeId', value)}
              />
              <SelectField
                label="Proyecto"
                value={draft.projectId}
                options={projectOptions}
                onChange={(value) => onDraftChange('projectId', value)}
              />
              {!showCreateProject ? (
                <button
                  type="button"
                  onClick={() => setShowCreateProject(true)}
                  className={styles.modal__createProjectBtn}
                >
                  + Crear proyecto
                </button>
              ) : (
                <div className={styles.modal__createProject}>
                  <Input
                    placeholder="Nombre del proyecto"
                    value={projectNameInput}
                    onChange={(e) => setProjectNameInput(e.target.value)}
                  />
                  <div className={styles.modal__createProjectActions}>
                    <Button
                      label={isCreatingProject ? 'Creando...' : 'Crear'}
                      onClick={handleCreateProject}
                      disabled={!projectNameInput.trim() || isCreatingProject}
                      fullWidth={false}
                    />
                    <button
                      type="button"
                      className={styles.modal__createProjectCancel}
                      onClick={() => {
                        setShowCreateProject(false);
                        setProjectNameInput('');
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
              <DateField
                label="Fecha de vencimiento"
                value={draft.dueDate}
                onChange={(value) => onDraftChange('dueDate', value)}
              />
              <FormField
                label="WhatsApp"
                placeholder="Número de contacto"
                value={draft.whatsappOwner}
                onChange={(e) => onDraftChange('whatsappOwner', e.target.value)}
              />
              <FormField
                label="Descripción de ubicación"
                placeholder="Describe la ubicación"
                value={draft.locationDescription}
                onChange={(e) => onDraftChange('locationDescription', e.target.value)}
              />
            </div>
          )}

          {step === 2 && (
            <div className={styles.modal__step}>
              <UserSelector
                label="Asignados"
                users={users}
                selectedIds={assigneeIds}
                onToggle={onToggleAssignee}
              />
              <UserSelector
                label="Observadores"
                users={users}
                selectedIds={observerIds}
                onToggle={onToggleObserver}
              />
              <TagSelector
                existingTags={existingTags}
                selectedTagIds={selectedTagIds}
                onToggleExisting={onToggleTag}
                pendingTags={pendingTags}
                onAddPending={onAddPendingTag}
                onRemovePending={onRemovePendingTag}
              />
            </div>
          )}

          {step === 3 && (
            <div className={styles.modal__step}>
              <FileUploader
                pendingFiles={pendingFiles}
                onFilesAdded={onFilesAdded}
                onFileRemoved={onFileRemoved}
                onRetryUpload={onRetryUpload}
                isCreatingDraft={isCreatingDraft}
              />
            </div>
          )}
        </div>

        {errors.submit && (
          <div className={styles.modal__error}>{errors.submit}</div>
        )}

        <div className={styles.modal__footer}>
          {step > 1 && (
            <Button
              label="Atrás"
              onClick={() => onStepChange((step - 1) as 1 | 2 | 3)}
              fullWidth={false}
            />
          )}
          {draftId && onCancel && (
            <Button
              label="Cancelar"
              onClick={onCancel}
              fullWidth={false}
            />
          )}
          {step < 3 ? (
            <Button
              label="Siguiente"
              onClick={() => onStepChange((step + 1) as 1 | 2 | 3)}
              disabled={isSubmitting}
              fullWidth={false}
            />
          ) : (
            <Button
              label={isSubmitting ? 'Creando...' : 'Crear incidencia'}
              onClick={onSubmit}
              disabled={isSubmitting}
              fullWidth={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
