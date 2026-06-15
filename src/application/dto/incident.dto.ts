import { IncidentPriority } from "@domain/value-objects/incident-priority.vo"
import { Location } from "@domain/value-objects/location.vo"
import { IncidentStatus } from "@domain/value-objects/incident-status.vo"

export interface CreateIncidentDto {
  title: string
  description: string
  priority: IncidentPriority
  location: Location
  projectId?: string
  incidentTypeId?: string
  reportedById?: string
}

export interface PatchIncidentDto {
  title?: string
  description?: string
  priority?: IncidentPriority
  location?: Location
  status?: IncidentStatus
  incidentTypeId?: string
}

export interface UploadMediaDto {
  url: string
  filename: string
  mimeType: string
  size: number
}

export interface UpdateMediaDto {
  status: string
}
