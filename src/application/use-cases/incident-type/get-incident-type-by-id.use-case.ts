import { IIncidentTypeRepository } from "@domain/ports/incident-type.repository"
import { IncidentType } from "@domain/entities/incident-type.entity"
import { NotFoundError } from "@domain/errors/domain.errors"

export class GetIncidentTypeByIdUseCase {
  constructor(private readonly incidentTypeRepository: IIncidentTypeRepository) {}

  async execute(id: string): Promise<IncidentType> {
    const type = await this.incidentTypeRepository.findById(id)
    if (!type) {
      throw new NotFoundError("IncidentType", id)
    }
    return type
  }
}
