import { Incident } from "@entities/incident.entity"
import { Media } from "@entities/media.entity"

export interface IncidentFilters {
  projectId?: string
  status?: string
  priority?: string
  incidentTypeId?: string
  assigneeId?: string
  tagId?: string
  deletedOnly?: boolean
  page?: number
  limit?: number
  orderBy?: "createdAt" | "updatedAt" | "priority"
  orderDir?: "asc" | "desc"
}

export interface IIncidentRepository {
  findAll(filters: IncidentFilters): Promise<Incident[]>
  findById(id: string): Promise<Incident | null>
  findMediaById(mediaId: string): Promise<Media | null>
  save(incident: Incident): Promise<Incident>
  update(incident: Incident): Promise<Incident>
  softDelete(id: string): Promise<void>
  restore(id: string): Promise<void>
  addAssignee(incidentId: string, userId: string): Promise<void>
  removeAssignee(incidentId: string, userId: string): Promise<void>
  addObserver(incidentId: string, userId: string): Promise<void>
  removeObserver(incidentId: string, userId: string): Promise<void>
  attachTag(incidentId: string, tagId: string): Promise<void>
  detachTag(incidentId: string, tagId: string): Promise<void>
  addMedia(incidentId: string, media: Media): Promise<Media>
  updateMedia(media: Media): Promise<Media>
  deleteMedia(mediaId: string): Promise<void>
}
