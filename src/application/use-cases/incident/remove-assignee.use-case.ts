import { IIncidentRepository } from "@domain/ports/incident.repository"
import { NotFoundError } from "@domain/errors/domain.errors"

export class RemoveAssigneeUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute(incidentId: string, userId: string): Promise<void> {
    const incident = await this.incidentRepository.findById(incidentId)
    if (!incident) {
      throw new NotFoundError("Incident", incidentId)
    }
    incident.removeAssignee(userId)
    await this.incidentRepository.removeAssignee(incidentId, userId)
  }
}
