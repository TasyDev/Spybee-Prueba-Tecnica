import { IIncidentRepository } from "@domain/ports/incident.repository"
import { NotFoundError } from "@domain/errors/domain.errors"

export class RemoveObserverUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute(incidentId: string, userId: string): Promise<void> {
    const incident = await this.incidentRepository.findById(incidentId)
    if (!incident) {
      throw new NotFoundError("Incident", incidentId)
    }
    incident.removeObserver(userId)
    await this.incidentRepository.removeObserver(incidentId, userId)
  }
}
