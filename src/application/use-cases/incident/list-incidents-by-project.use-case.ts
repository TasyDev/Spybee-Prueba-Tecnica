import { IIncidentRepository } from "@domain/ports/incident.repository"
import { Incident } from "@domain/entities/incident.entity"

export class ListIncidentsByProjectUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  execute(projectId: string): Promise<Incident[]> {
    return this.incidentRepository.findAll({ projectId })
  }
}
