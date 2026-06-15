import { IIncidentRepository } from "@domain/ports/incident.repository"
import { NotFoundError } from "@domain/errors/domain.errors"

export class DeleteIncidentUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute(id: string): Promise<void> {
    const incident = await this.incidentRepository.findById(id)
    if (!incident) {
      throw new NotFoundError("Incident", id)
    }
    incident.softDelete()
    await this.incidentRepository.softDelete(id)
  }
}
