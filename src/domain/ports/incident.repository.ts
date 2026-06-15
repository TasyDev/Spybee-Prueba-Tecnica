import { Incident } from "@entities/incident.entity"

export interface IncidentFilters {
  projectId?: string
  typeId?: string
  status?: string
  priority?: string
  deleted?: boolean
  page?: number
  limit?: number
  orderBy?: "createdAt" | "updatedAt" | "orderId"
  order?: "asc" | "desc"
}

export interface IIncidentRepository {
  findById(id: string): Promise<Incident | null>
  findAll(filters: IncidentFilters): Promise<{ data: Incident[]; total: number }>
  save(incident: Incident): Promise<void>
  update(incident: Incident): Promise<void>
  delete(id: string): Promise<void>
}
