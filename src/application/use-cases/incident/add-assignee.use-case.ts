import { IIncidentRepository } from "@domain/ports/incident.repository"
import { IUserRepository } from "@domain/ports/user.repository"
import { NotFoundError } from "@domain/errors/domain.errors"

export class AddAssigneeUseCase {
  constructor(
    private readonly incidentRepository: IIncidentRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(incidentId: string, userId: string): Promise<void> {
    const incident = await this.incidentRepository.findById(incidentId)
    if (!incident) {
      throw new NotFoundError("Incident", incidentId)
    }
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError("User", userId)
    }
    incident.addAssignee(userId)
    await this.incidentRepository.addAssignee(incidentId, userId)
  }
}
