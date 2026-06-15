import { IIncidentRepository } from "@domain/ports/incident.repository"
import { NotFoundError } from "@domain/errors/domain.errors"
import { Incident } from "@domain/entities/incident.entity"

export class GetIncidentByIdUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute(id: string): Promise<Incident> {
    const incident = await this.incidentRepository.findById(id)
    if (!incident) {
      throw new NotFoundError("Incident", id)
    }
    return incident
  }
}
