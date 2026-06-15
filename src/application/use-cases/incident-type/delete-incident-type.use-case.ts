import { IIncidentTypeRepository } from "@domain/ports/incident-type.repository"
import { NotFoundError } from "@domain/errors/domain.errors"

export class DeleteIncidentTypeUseCase {
  constructor(private readonly incidentTypeRepository: IIncidentTypeRepository) {}

  async execute(id: string): Promise<void> {
    const type = await this.incidentTypeRepository.findById(id)
    if (!type) {
      throw new NotFoundError("IncidentType", id)
    }
    await this.incidentTypeRepository.delete(id)
  }
}
