import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/buttons/Button';
import { Icon } from '@/components/atoms/icons/Icon';
import { StepIndicator } from '@/components/atoms/navigation/StepIndicator';
import { Input } from '@/components/atoms/forms/Input';
import { FormField } from '@/components/molecules/forms/FormField';
import { SelectField } from '@/components/molecules/forms/SelectField';
import { TextAreaField } from '@/components/molecules/forms/TextAreaField';
import { DateField } from '@/components/molecules/forms/DateField';
import { UserSelector } from '@/components/molecules/wizard/UserSelector';
import { TagSelector } from '@/components/molecules/wizard/TagSelector';
import { useIncidentStore } from '@/store/incidentStore';
import { projectApi } from '@/services/projectApi';
import { incidentApi } from '@/services/incidentApi';
import type { Incident, Priority, Project } from '@/store/types';
import styles from './incident-detail-modal.module.scss';

const WIZARD_STEPS = [
  { label: 'Información' },
  { label: 'Asignaciones' },
  { label: 'Archivos' },
];

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

export interface IncidentDetailModalProps {
  incident: Incident;
  incidentTypes: TagOption[];
  projects: TagOption[];
  users: UserOption[];
  existingTags: TagOption[];
  onClose: () => void;
}

export function IncidentDetailModal({
  incident,
  incidentTypes,
  projects,
  users,
  existingTags,
  onClose,
}: IncidentDetailModalProps) {
  const updateIncident = useIncidentStore((s) => s.updateIncident);
  const deleteIncident = useIncidentStore((s) => s.deleteIncident);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Local form state initialized from incident
  const [title, setTitle] = useState(incident.title);
  const [description, setDescription] = useState(incident.description);
  const [priority, setPriority] = useState(incident.priority);
  const [status, setStatus] = useState<string>(incident.status);
  const [incidentTypeId, setIncidentTypeId] = useState(incident.type?.id ?? '');
  const [projectId, setProjectId] = useState(incident.project?.id ?? '');
  const [dueDate, setDueDate] = useState(incident.dueDate ?? '');
  const [whatsappOwner, setWhatsappOwner] = useState(incident.whatsappOwner ?? '');
  const [locationDescription, setLocationDescription] = useState(incident.locationDescription);

  // Media state
  const [mediaList, setMediaList] = useState(incident.media);

  // Assignments state
  const [assigneeIds, setAssigneeIds] = useState(incident.assignees.map((a) => a.id));
  const [observerIds, setObserverIds] = useState(incident.observers.map((o) => o.id));
  const [selectedTagIds, setSelectedTagIds] = useState(incident.tags.map((t) => t.id));
  const [pendingTags, setPendingTags] = useState<Array<{ name: string; color: string }>>([]);

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Auto-save helpers
  const save = (changes: Record<string, unknown>) => {
    updateIncident(incident.id, changes as any);
  };

  const priorityOptions = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
  ];

  const statusOptions = [
    { value: 'open', label: 'Abierto' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'resolved', label: 'Resuelto' },
    { value: 'closed', label: 'Cerrado' },
    { value: 'rejected', label: 'Rechazado' },
  ];

  const typeOptions = [{ value: '', label: 'Seleccionar tipo...' }, ...incidentTypes.map((t) => ({ value: t.id, label: t.name }))];
  const projectOptions = [{ value: '', label: 'Seleccionar proyecto...' }, ...projects.map((p) => ({ value: p.id, label: p.name }))];

  // Assignment handlers
  const handleToggleAssignee = (userId: string) => {
    const next = assigneeIds.includes(userId)
      ? assigneeIds.filter((id) => id !== userId)
      : [...assigneeIds, userId];
    setAssigneeIds(next);
    save({ assigneeIds: next });
  };

  const handleToggleObserver = (userId: string) => {
    const next = observerIds.includes(userId)
      ? observerIds.filter((id) => id !== userId)
      : [...observerIds, userId];
    setObserverIds(next);
    save({ observerIds: next });
  };

  const handleToggleTag = (tagId: string) => {
    const next = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];
    setSelectedTagIds(next);
    save({ tagIds: next });
  };

  const handleAddPendingTag = (name: string, color: string) => {
    setPendingTags((prev) => [...prev, { name, color }]);
  };

  const handleRemovePendingTag = (index: number) => {
    setPendingTags((prev) => prev.filter((_, i) => i !== index));
  };

  // Media handlers
  const handleDeleteMedia = async (mediaId: string) => {
    try {
      await incidentApi.deleteMedia(incident.id, mediaId);
      setMediaList((prev) => prev.filter((m) => m.id !== mediaId));
    } catch {
      // Ignore delete errors
    }
  };

  const handleAddFiles = async (files: File[]) => {
    setIsUploading(true);
    try {
      for (const file of files) {
        const result = await incidentApi.uploadMedia(incident.id, file);
        // Refresh media list by re-fetching incident
        const updated = await incidentApi.fetchById(incident.id);
        setMediaList(updated.media);
      }
    } catch {
      // Ignore upload errors
    } finally {
      setIsUploading(false);
    }
  };

  // Create project handler
  const handleCreateProject = async () => {
    const name = projectNameInput.trim();
    if (!name) return;
    setIsCreatingProject(true);
    try {
      const project = await projectApi.create({ name });
      setProjectId(project.id);
      save({ projectId: project.id });
      useIncidentStore.setState((state) => ({
        projects: [...state.projects, project],
      }));
      setShowCreateProject(false);
      setProjectNameInput('');
    } catch {
      // Error creating project
    } finally {
      setIsCreatingProject(false);
    }
  };

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft' && lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1);
      if (e.key === 'ArrowRight' && lightboxIndex < mediaList.length - 1) setLightboxIndex(lightboxIndex + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, mediaList.length]);

  // Delete handler
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteIncident(incident.id);
      onClose();
    } catch {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modal__header}>
          <h2 className={styles.modal__title}>Detalles de incidencia</h2>
          <button type="button" onClick={onClose} className={styles.modal__close} aria-label="Cerrar">
            <Icon name="x" size={18} color="#EBE1D1" />
          </button>
        </div>

        <div className={styles.modal__stepper}>
          <StepIndicator steps={WIZARD_STEPS} currentStep={step} onStepClick={(s) => setStep(s as 1 | 2 | 3)} />
        </div>

        <div className={styles.modal__body} style={{ position: 'relative' }}>
          {step === 1 && (
            <div className={styles.modal__step}>
              <FormField
                label="Título"
                placeholder="Título de la incidencia"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => title !== incident.title && save({ title })}
              />
              <TextAreaField
                label="Descripción"
                placeholder="Describe la incidencia"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => description !== incident.description && save({ description })}
              />
              <SelectField
                label="Prioridad"
                value={priority}
                options={priorityOptions}
                onChange={(value) => {
                  setPriority(value as Priority);
                  save({ priority: value });
                }}
              />
              <SelectField
                label="Estado"
                value={status}
                options={statusOptions}
                onChange={(value) => {
                  setStatus(value);
                  save({ status: value });
                }}
              />
              <SelectField
                label="Tipo"
                value={incidentTypeId}
                options={typeOptions}
                onChange={(value) => {
                  setIncidentTypeId(value);
                  save({ incidentTypeId: value || undefined });
                }}
              />
              <SelectField
                label="Proyecto"
                value={projectId}
                options={projectOptions}
                onChange={(value) => {
                  setProjectId(value);
                  save({ projectId: value || undefined });
                }}
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
                value={dueDate}
                onChange={(value) => {
                  setDueDate(value);
                  save({ dueDate: value || null });
                }}
              />
              <FormField
                label="WhatsApp"
                placeholder="Número de contacto"
                value={whatsappOwner}
                onChange={(e) => setWhatsappOwner(e.target.value)}
                onBlur={() => whatsappOwner !== (incident.whatsappOwner ?? '') && save({ whatsappOwner: whatsappOwner || null })}
              />
              <FormField
                label="Descripción de ubicación"
                placeholder="Describe la ubicación"
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
                onBlur={() => locationDescription !== incident.locationDescription && save({ locationDescription })}
              />
            </div>
          )}

          {step === 2 && (
            <div className={styles.modal__step}>
              <UserSelector
                label="Asignados"
                users={users}
                selectedIds={assigneeIds}
                onToggle={handleToggleAssignee}
              />
              <UserSelector
                label="Observadores"
                users={users}
                selectedIds={observerIds}
                onToggle={handleToggleObserver}
              />
              <TagSelector
                existingTags={existingTags}
                selectedTagIds={selectedTagIds}
                onToggleExisting={handleToggleTag}
                pendingTags={pendingTags}
                onAddPending={handleAddPendingTag}
                onRemovePending={handleRemovePendingTag}
              />
            </div>
          )}

          {step === 3 && (
            <div className={styles.modal__step}>
              {mediaList.length > 0 ? (
                <div className={styles.detail__gallery}>
                  {mediaList.map((m, index) => (
                    <div key={m.id}>
                      <div className={styles.detail__imageWrapper} onClick={() => setLightboxIndex(index)}>
                        <img src={m.url} alt={m.name} className={styles.detail__image} />
                        <button
                          type="button"
                          className={styles.detail__imageDelete}
                          onClick={(e) => { e.stopPropagation(); handleDeleteMedia(m.id); }}
                          aria-label="Eliminar imagen"
                        >
                          ×
                        </button>
                      </div>
                      <span className={styles.detail__imageName}>{m.name}</span>
                    </div>
                  ))}
                  <button type="button" className={styles.detail__addBtn} onClick={() => document.getElementById('detail-file-input')?.click()} disabled={isUploading}>
                    <span>+</span>
                    <span className={styles.detail__addLabel}>{isUploading ? 'Subiendo...' : 'Agregar imagen'}</span>
                  </button>
                </div>
              ) : (
                <div className={styles.detail__empty}>
                  <p>Sin imágenes subidas.</p>
                  <button
                    type="button"
                    onClick={() => document.getElementById('detail-file-input')?.click()}
                    className={styles.modal__createProjectBtn}
                    style={{ marginTop: 8 }}
                  >
                    + Agregar imagen
                  </button>
                </div>
              )}
              <input
                id="detail-file-input"
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleAddFiles(Array.from(files));
                    e.target.value = '';
                  }
                }}
              />
            </div>
          )}

          {showDeleteConfirm && (
            <div className={styles.detail__confirmOverlay}>
              <div className={styles.detail__confirmBox}>
                <p className={styles.detail__confirmText}>
                  ¿Estás seguro de eliminar <strong>{incident.title}</strong>?
                </p>
                <div className={styles.detail__confirmActions}>
                  <button
                    type="button"
                    className={styles.detail__deleteBtn}
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Eliminando...' : 'Sí'}
                  </button>
                  <Button
                    label="No"
                    onClick={() => setShowDeleteConfirm(false)}
                    fullWidth={false}
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        <div className={styles.modal__footer}>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            className={styles.detail__deleteBtn}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Eliminar
          </button>
          <Button label="Cerrar" onClick={onClose} fullWidth={false} />
        </div>
      </div>
    </div>

      {lightboxIndex !== null && (
        <div className={styles.detail__lightboxOverlay} onClick={() => setLightboxIndex(null)}>
          <button
            type="button"
            className={styles.detail__lightboxClose}
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
            aria-label="Cerrar lightbox"
          >
            <Icon name="x" size={18} color="#EBE1D1" />
          </button>

          {lightboxIndex > 0 && (
            <button
              type="button"
              className={`${styles.detail__lightboxNav} ${styles['detail__lightboxNav--prev']}`}
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
              aria-label="Anterior"
            >
              ‹
            </button>
          )}

          <div className={styles.detail__lightboxContent} onClick={(e) => e.stopPropagation()}>
            {mediaList[lightboxIndex].type === 'video' ? (
              <video src={mediaList[lightboxIndex].url} controls className={styles.detail__lightboxMedia} />
            ) : (
              <img src={mediaList[lightboxIndex].url} alt={mediaList[lightboxIndex].name} className={styles.detail__lightboxMedia} />
            )}
            <span className={styles.detail__lightboxName}>{mediaList[lightboxIndex].name}</span>
          </div>

          {lightboxIndex < mediaList.length - 1 && (
            <button
              type="button"
              className={`${styles.detail__lightboxNav} ${styles['detail__lightboxNav--next']}`}
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
              aria-label="Siguiente"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
