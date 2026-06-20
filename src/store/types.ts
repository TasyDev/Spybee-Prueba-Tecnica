export type Priority = 'low' | 'medium' | 'high';

export type Status = 'open' | 'in_progress' | 'resolved' | 'closed' | 'rejected';

export interface Coordinates {
  lat: number;
  lng: number;
}

interface IncidentTypeRef {
  id: string;
  key?: string;
  name?: string;
  name_en?: string;
}

interface ProjectRef {
  id: string;
  name?: string;
}

interface UserRef {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface MediaRef {
  id: string;
  name: string;
  type: string;
  format: string;
  size: number;
  status: string;
  url: string;
}

interface TagRef {
  id: string;
  name: string;
  color: string;
}

export interface Incident {
  id: string;
  sequenceId: string;
  order: number;
  title: string;
  description: string;
  type: IncidentTypeRef | null;
  priority: Priority;
  status: Status;
  approval: boolean;
  project: ProjectRef | null;
  owner: UserRef | null;
  whatsappOwner: string | null;
  assignees: UserRef[];
  observers: UserRef[];
  coordinates: Coordinates;
  locationDescription: string;
  dueDate: string | null;
  closingDate: string | null;
  media: MediaRef[];
  tags: TagRef[];
  deleted: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface IncidentType {
  id: string;
  key: string;
  name: string;
  name_en: string;
}

export interface Filters {
  status: Status[];
  priority: Priority[];
  type: string[];
  search: string;
  project: string[];
  assignee: string[];
  observer: string[];
  owner: string[];
}

export interface CreateIncidentInput {
  title: string;
  description: string;
  priority: Priority;
  coordinates: Coordinates;
  incidentTypeId?: string;
  projectId?: string;
  reportedById?: string;
  locationDescription?: string;
  dueDate?: string;
  whatsappOwner?: string;
  assigneeIds?: string[];
  observerIds?: string[];
  tagIds?: string[];
}

export interface UpdateIncidentInput {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  approval?: boolean;
  coordinates?: Coordinates;
  incidentTypeId?: string;
  locationDescription?: string;
  dueDate?: string;
  whatsappOwner?: string;
}
