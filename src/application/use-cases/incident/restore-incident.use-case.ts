import { IIncidentRepository } from "@domain/ports/incident.repository"
import { NotFoundError } from "@domain/errors/domain.errors"

export class RestoreIncidentUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute(id: string): Promise<void> {
    const incident = await this.incidentRepository.findById(id)
    if (!incident) {
      throw new NotFoundError("Incident", id)
    }
    incident.restore()
    await this.incidentRepository.restore(id)
  }
}
