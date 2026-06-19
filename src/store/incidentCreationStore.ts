import { create } from 'zustand';
import { tagApi } from '@/services/tagApi';
import { incidentApi } from '@/services/incidentApi';
import { useIncidentStore } from './incidentStore';
import type { Coordinates, Priority } from './types';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface PendingFile {
  file: File;
  preview: string;
  status: UploadStatus;
  error?: string;
  mediaId?: string;
  mediaUrl?: string;
}

interface PendingTag {
  name: string;
  color: string;
}

interface CreationDraft {
  title: string;
  description: string;
  priority: Priority;
  incidentTypeId: string;
  projectId: string;
  dueDate: string;
  whatsappOwner: string;
  locationDescription: string;
  coordinates: Coordinates | null;
}

interface CreationState {
  isOpen: boolean;
  step: 1 | 2 | 3;
  draft: CreationDraft;
  assigneeIds: string[];
  observerIds: string[];
  selectedTagIds: string[];
  pendingTags: PendingTag[];
  pendingFiles: PendingFile[];
  errors: Record<string, string>;
  isSubmitting: boolean;
  draftId: string | null;
  isCreatingDraft: boolean;
}

interface CreationActions {
  open: () => void;
  close: () => void;
  reset: () => void;
  setStep: (step: 1 | 2 | 3) => void;
  updateDraft: (field: keyof CreationDraft, value: string | Coordinates | null) => void;
  toggleAssignee: (userId: string) => void;
  toggleObserver: (userId: string) => void;
  toggleTag: (tagId: string) => void;
  addPendingTag: (name: string, color: string) => void;
  removePendingTag: (index: number) => void;
  addFiles: (files: File[]) => Promise<void>;
  removeFile: (index: number) => void;
  retryUpload: (index: number) => Promise<void>;
  clearErrors: () => void;
  submit: () => Promise<void>;
  cancelDraft: () => Promise<void>;
}

const INITIAL_DRAFT: CreationDraft = {
  title: '',
  description: '',
  priority: 'medium',
  incidentTypeId: '',
  projectId: '',
  dueDate: '',
  whatsappOwner: '',
  locationDescription: '',
  coordinates: null,
};

export const useIncidentCreationStore = create<CreationState & CreationActions>((set, get) => ({
  isOpen: false,
  step: 1,
  draft: { ...INITIAL_DRAFT },
  assigneeIds: [],
  observerIds: [],
  selectedTagIds: [],
  pendingTags: [],
  pendingFiles: [],
  errors: {},
  isSubmitting: false,
  draftId: null,
  isCreatingDraft: false,

  open: () => set({ isOpen: true }),

  close: () => {
    const { pendingFiles } = get();
    pendingFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    set({ isOpen: false });
  },

  reset: () => {
    const { pendingFiles } = get();
    pendingFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    set({
      step: 1,
      draft: { ...INITIAL_DRAFT },
      assigneeIds: [],
      observerIds: [],
      selectedTagIds: [],
      pendingTags: [],
      pendingFiles: [],
      errors: {},
      isSubmitting: false,
      draftId: null,
      isCreatingDraft: false,
    });
  },

  setStep: (step) => set({ step }),

  updateDraft: (field, value) =>
    set((state) => ({
      draft: { ...state.draft, [field]: value },
    })),

  toggleAssignee: (userId) =>
    set((state) => ({
      assigneeIds: state.assigneeIds.includes(userId)
        ? state.assigneeIds.filter((id) => id !== userId)
        : [...state.assigneeIds, userId],
    })),

  toggleObserver: (userId) =>
    set((state) => ({
      observerIds: state.observerIds.includes(userId)
        ? state.observerIds.filter((id) => id !== userId)
        : [...state.observerIds, userId],
    })),

  toggleTag: (tagId) =>
    set((state) => ({
      selectedTagIds: state.selectedTagIds.includes(tagId)
        ? state.selectedTagIds.filter((id) => id !== tagId)
        : [...state.selectedTagIds, tagId],
    })),

  addPendingTag: (name, color) =>
    set((state) => ({
      pendingTags: [...state.pendingTags, { name, color }],
    })),

  removePendingTag: (index) =>
    set((state) => ({
      pendingTags: state.pendingTags.filter((_, i) => i !== index),
    })),

  addFiles: async (files) => {
    const state = get();
    const newFiles: PendingFile[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'idle',
    }));

    set((state) => ({
      pendingFiles: [...state.pendingFiles, ...newFiles],
    }));

    let draftId = state.draftId;

    // Lazy create draft if needed
    if (!draftId) {
      const { draft, assigneeIds, observerIds, selectedTagIds, pendingTags } = get();
      if (!draft.coordinates) {
        set((state) => ({
          pendingFiles: state.pendingFiles.map((f) => {
            const isNew = newFiles.some((nf) => nf.preview === f.preview);
            return isNew ? { ...f, status: 'error' as UploadStatus, error: 'Las coordenadas son obligatorias' } : f;
          }),
        }));
        return;
      }

      set({ isCreatingDraft: true });
      try {
        // Create tags first so they can be attached to the draft
        const createdTags = await Promise.all(
          pendingTags.map((t) => tagApi.create({ name: t.name, color: t.color }))
        );
        const allTagIds = [...selectedTagIds, ...createdTags.map((t) => t.id)];

        const created = await incidentApi.createDraft({
          title: draft.title || 'Borrador',
          description: draft.description || 'Incidencia borrador',
          priority: draft.priority,
          coordinates: draft.coordinates,
          incidentTypeId: draft.incidentTypeId || undefined,
          projectId: draft.projectId || undefined,
          locationDescription: draft.locationDescription || undefined,
          dueDate: draft.dueDate || undefined,
          whatsappOwner: draft.whatsappOwner || undefined,
          assigneeIds: assigneeIds.length > 0 ? assigneeIds : undefined,
          observerIds: observerIds.length > 0 ? observerIds : undefined,
          tagIds: allTagIds.length > 0 ? allTagIds : undefined,
        });

        draftId = created.id;
        set({ draftId, pendingTags: [], selectedTagIds: allTagIds });
      } catch (err) {
        set((state) => ({
          pendingFiles: state.pendingFiles.map((f) => {
            const isNew = newFiles.some((nf) => nf.preview === f.preview);
            return isNew ? { ...f, status: 'error' as UploadStatus, error: 'Error al crear borrador' } : f;
          }),
          isCreatingDraft: false,
          errors: { submit: err instanceof Error ? err.message : 'Error al crear borrador' },
        }));
        return;
      } finally {
        set({ isCreatingDraft: false });
      }
    }

    // Upload each new file
    const currentFiles = get().pendingFiles;
    for (const newFile of newFiles) {
      const fileIndex = currentFiles.findIndex((f) => f.preview === newFile.preview);
      if (fileIndex === -1) continue;

      set((state) => ({
        pendingFiles: state.pendingFiles.map((f, i) =>
          i === fileIndex ? { ...f, status: 'uploading' as UploadStatus, error: undefined } : f
        ),
      }));

      try {
        const result = await incidentApi.uploadMedia(draftId, newFile.file);
        set((state) => ({
          pendingFiles: state.pendingFiles.map((f, i) =>
            i === fileIndex
              ? { ...f, status: 'success' as UploadStatus, mediaId: result.id, mediaUrl: result.url }
              : f
          ),
        }));
      } catch (err) {
        set((state) => ({
          pendingFiles: state.pendingFiles.map((f, i) =>
            i === fileIndex
              ? { ...f, status: 'error' as UploadStatus, error: err instanceof Error ? err.message : 'Error al subir archivo' }
              : f
          ),
        }));
      }
    }
  },

  removeFile: (index) =>
    set((state) => {
      const file = state.pendingFiles[index];
      if (file) URL.revokeObjectURL(file.preview);
      return {
        pendingFiles: state.pendingFiles.filter((_, i) => i !== index),
      };
    }),

  retryUpload: async (index) => {
    const state = get();
    const file = state.pendingFiles[index];
    if (!file || !state.draftId) return;

    set((state) => ({
      pendingFiles: state.pendingFiles.map((f, i) =>
        i === index ? { ...f, status: 'uploading' as UploadStatus, error: undefined } : f
      ),
    }));

    try {
      const result = await incidentApi.uploadMedia(state.draftId, file.file);
      set((state) => ({
        pendingFiles: state.pendingFiles.map((f, i) =>
          i === index
            ? { ...f, status: 'success' as UploadStatus, mediaId: result.id, mediaUrl: result.url }
            : f
        ),
      }));
    } catch (err) {
      set((state) => ({
        pendingFiles: state.pendingFiles.map((f, i) =>
          i === index
            ? { ...f, status: 'error' as UploadStatus, error: err instanceof Error ? err.message : 'Error al subir archivo' }
            : f
        ),
      }));
    }
  },

  clearErrors: () => set({ errors: {} }),

  submit: async () => {
    set({ isSubmitting: true, errors: {} });
    try {
      const {
        draft,
        assigneeIds,
        observerIds,
        selectedTagIds,
        pendingTags,
        draftId,
      } = get();

      // 1. Handle remaining pending tags
      const createdTags = await Promise.all(
        pendingTags.map((t) => tagApi.create({ name: t.name, color: t.color }))
      );
      const allTagIds = [...selectedTagIds, ...createdTags.map((t) => t.id)];

      if (draftId) {
        // Finalize existing draft
        const finalized = await incidentApi.finalizeDraft(draftId, {
          title: draft.title,
          description: draft.description,
          priority: draft.priority,
          coordinates: draft.coordinates!,
          incidentTypeId: draft.incidentTypeId || undefined,
          projectId: draft.projectId || undefined,
          locationDescription: draft.locationDescription || undefined,
          dueDate: draft.dueDate || undefined,
          whatsappOwner: draft.whatsappOwner || undefined,
          assigneeIds: assigneeIds.length > 0 ? assigneeIds : undefined,
          observerIds: observerIds.length > 0 ? observerIds : undefined,
          tagIds: allTagIds.length > 0 ? allTagIds : undefined,
        });

        useIncidentStore.setState((state) => ({
          incidents: [finalized, ...state.incidents],
        }));
      } else {
        // Normal create path (no files were uploaded)
        const created = await incidentApi.create({
          title: draft.title,
          description: draft.description,
          priority: draft.priority,
          coordinates: draft.coordinates!,
          incidentTypeId: draft.incidentTypeId || undefined,
          projectId: draft.projectId || undefined,
          locationDescription: draft.locationDescription || undefined,
          dueDate: draft.dueDate || undefined,
          whatsappOwner: draft.whatsappOwner || undefined,
          assigneeIds: assigneeIds.length > 0 ? assigneeIds : undefined,
          observerIds: observerIds.length > 0 ? observerIds : undefined,
          tagIds: allTagIds.length > 0 ? allTagIds : undefined,
        });

        useIncidentStore.setState((state) => ({
          incidents: [created, ...state.incidents],
        }));
      }

      // 3. Clean up
      const { pendingFiles } = get();
      pendingFiles.forEach((f) => URL.revokeObjectURL(f.preview));
      set({
        isOpen: false,
        step: 1,
        draft: { ...INITIAL_DRAFT },
        assigneeIds: [],
        observerIds: [],
        selectedTagIds: [],
        pendingTags: [],
        pendingFiles: [],
        errors: {},
        isSubmitting: false,
        draftId: null,
      });
    } catch (err) {
      set({
        errors: { submit: err instanceof Error ? err.message : 'Error al crear incidencia' },
        isSubmitting: false,
      });
    }
  },

  cancelDraft: async () => {
    const { draftId, pendingFiles } = get();
    if (draftId) {
      try {
        await incidentApi.cancelDraft(draftId);
      } catch {
        // Ignore cleanup errors
      }
    }
    pendingFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    set({
      isOpen: false,
      step: 1,
      draft: { ...INITIAL_DRAFT },
      assigneeIds: [],
      observerIds: [],
      selectedTagIds: [],
      pendingTags: [],
      pendingFiles: [],
      errors: {},
      isSubmitting: false,
      draftId: null,
      isCreatingDraft: false,
    });
  },
}));
