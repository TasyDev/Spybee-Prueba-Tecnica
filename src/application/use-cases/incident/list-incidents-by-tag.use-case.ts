import { IIncidentRepository } from "@domain/ports/incident.repository"
import { Incident } from "@domain/entities/incident.entity"

export class ListIncidentsByTagUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  execute(tagId: string): Promise<Incident[]> {
    return this.incidentRepository.findAll({ tagId })
  }
}
