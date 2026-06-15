import { IIncidentRepository } from "@domain/ports/incident.repository"
import { Incident } from "@domain/entities/incident.entity"

export class ListIncidentsByIncidentTypeUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  execute(incidentTypeId: string): Promise<Incident[]> {
    return this.incidentRepository.findAll({ incidentTypeId })
  }
}
