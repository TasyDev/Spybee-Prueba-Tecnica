import { IIncidentTypeRepository } from "@domain/ports/incident-type.repository"
import { IncidentType } from "@domain/entities/incident-type.entity"
import { NotFoundError } from "@domain/errors/domain.errors"
import { PatchIncidentTypeDto } from "@application/dto/incident-type.dto"

export class PatchIncidentTypeUseCase {
  constructor(private readonly incidentTypeRepository: IIncidentTypeRepository) {}

  async execute(id: string, dto: PatchIncidentTypeDto): Promise<IncidentType> {
    const type = await this.incidentTypeRepository.findById(id)
    if (!type) {
      throw new NotFoundError("IncidentType", id)
    }
    if (dto.name) {
      type.updateNameEs(dto.name)
      type.updateNameEn(dto.name)
    }
    return this.incidentTypeRepository.update(type)
  }
}
