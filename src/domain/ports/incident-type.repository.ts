import { IncidentType } from "@entities/incident-type.entity"

export interface IIncidentTypeRepository {
  findById(id: string): Promise<IncidentType | null>
  findAll(): Promise<IncidentType[]>
  save(type: IncidentType): Promise<void>
  update(type: IncidentType): Promise<void>
  delete(id: string): Promise<void>
}
