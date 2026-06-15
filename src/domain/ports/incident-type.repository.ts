import { IncidentType } from "@entities/incident-type.entity"

export interface IIncidentTypeRepository {
  findAll(): Promise<IncidentType[]>
  findById(id: string): Promise<IncidentType | null>
  save(type: IncidentType): Promise<IncidentType>
  update(type: IncidentType): Promise<IncidentType>
  delete(id: string): Promise<void>
}
