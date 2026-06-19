import { create } from 'zustand';
import type { Incident, IncidentType, User, Tag, Project, Filters, CreateIncidentInput, UpdateIncidentInput } from './types';
import { incidentApi } from '@/services/incidentApi';
import { incidentTypeApi } from '@/services/incidentTypeApi';
import { userApi } from '@/services/userApi';
import { tagApi } from '@/services/tagApi';
import { projectApi } from '@/services/projectApi';

const INITIAL_FILTERS: Filters = {
  status: [],
  priority: [],
  type: [],
  search: '',
  project: [],
  assignee: [],
  observer: [],
  owner: [],
};

interface IncidentState {
  incidents: Incident[];
  incidentTypes: IncidentType[];
  users: User[];
  tags: Tag[];
  projects: Project[];
  filters: Filters;
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

interface IncidentActions {
  setFilter: (key: keyof Filters, value: string[]) => void;
  setSearch: (query: string) => void;
  clearFilters: () => void;
  setSelected: (id: string | null) => void;
  fetchIncidents: () => Promise<void>;
  fetchIncidentTypes: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchTags: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  createIncident: (draft: CreateIncidentInput) => Promise<void>;
  updateIncident: (id: string, changes: UpdateIncidentInput) => Promise<void>;
  deleteIncident: (id: string) => Promise<void>;
}

type IncidentStore = IncidentState & IncidentActions;

export const useIncidentStore = create<IncidentStore>((set, get) => ({
  incidents: [],
  incidentTypes: [],
  users: [],
  tags: [],
  projects: [],
  filters: INITIAL_FILTERS,
  selectedId: null,
  loading: false,
  error: null,

  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),

  setSearch: (query) =>
    set((state) => ({ filters: { ...state.filters, search: query } })),

  clearFilters: () => set({ filters: INITIAL_FILTERS }),

  setSelected: (id) => set({ selectedId: id }),

  fetchIncidents: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await incidentApi.fetchAll();
      set({ incidents: data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar incidencias',
        loading: false,
      });
    }
  },

  fetchIncidentTypes: async () => {
    try {
      const data = await incidentTypeApi.fetchAll();
      set({ incidentTypes: data });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar tipos de incidencia',
      });
    }
  },

  fetchUsers: async () => {
    try {
      const data = await userApi.fetchAll();
      set({ users: data });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar usuarios',
      });
    }
  },

  fetchTags: async () => {
    try {
      const data = await tagApi.fetchAll();
      set({ tags: data });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar etiquetas',
      });
    }
  },

  fetchProjects: async () => {
    try {
      const data = await projectApi.fetchAll();
      set({ projects: data });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar proyectos',
      });
    }
  },

  createIncident: async (draft) => {
    const tempId = `temp_${Date.now()}`;
    const now = new Date().toISOString();

    const optimistic: Incident = {
      id: tempId,
      sequenceId: '',
      order: 0,
      title: draft.title,
      description: draft.description,
      priority: draft.priority,
      status: 'open',
      approval: false,
      type: draft.incidentTypeId ? { id: draft.incidentTypeId } : null,
      project: draft.projectId ? { id: draft.projectId } : null,
      owner: null,
      whatsappOwner: draft.whatsappOwner || null,
      assignees: [],
      observers: [],
      coordinates: draft.coordinates,
      locationDescription: draft.locationDescription || '',
      dueDate: draft.dueDate || null,
      closingDate: null,
      media: [],
      tags: [],
      deleted: null,
      createdAt: now,
      updatedAt: now,
    };

    const previous = get().incidents;
    set((state) => ({ incidents: [optimistic, ...state.incidents] }));

    try {
      const created = await incidentApi.create(draft);
      set((state) => ({
        incidents: state.incidents.map((i) => (i.id === tempId ? created : i)),
      }));
    } catch {
      set({ incidents: previous });
    }
  },

  updateIncident: async (id, changes) => {
    const previous = get().incidents;

    set((state) => ({
      incidents: state.incidents.map((i) =>
        i.id === id ? { ...i, ...changes, updatedAt: new Date().toISOString() } : i,
      ),
    }));

    try {
      const updated = await incidentApi.update(id, changes);
      set((state) => ({
        incidents: state.incidents.map((i) => (i.id === id ? updated : i)),
      }));
    } catch {
      set({ incidents: previous });
    }
  },

  deleteIncident: async (id) => {
    const previous = get().incidents;
    set((state) => ({
      incidents: state.incidents.filter((i) => i.id !== id),
    }));

    try {
      await incidentApi.remove(id);
    } catch {
      set({ incidents: previous });
    }
  },
}));
