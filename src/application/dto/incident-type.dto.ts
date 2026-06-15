export interface CreateIncidentTypeDto {
  name: string
  description?: string
}

export interface PatchIncidentTypeDto {
  name?: string
  description?: string
}
