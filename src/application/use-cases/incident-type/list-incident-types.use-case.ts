import { IIncidentTypeRepository } from "@domain/ports/incident-type.repository"
import { IncidentType } from "@domain/entities/incident-type.entity"

export class ListIncidentTypesUseCase {
  constructor(private readonly incidentTypeRepository: IIncidentTypeRepository) {}

  execute(): Promise<IncidentType[]> {
    return this.incidentTypeRepository.findAll()
  }
}
