import { IIncidentTypeRepository } from "@domain/ports/incident-type.repository"
import { IncidentType } from "@domain/entities/incident-type.entity"
import { CreateIncidentTypeDto } from "@application/dto/incident-type.dto"

export class CreateIncidentTypeUseCase {
  constructor(private readonly incidentTypeRepository: IIncidentTypeRepository) {}

  execute(dto: CreateIncidentTypeDto): Promise<IncidentType> {
    const type = IncidentType.create({
      id: crypto.randomUUID(),
      key: dto.name.toLowerCase().replace(/\s+/g, "_"),
      nameEs: dto.name,
      nameEn: dto.name,
      description: dto.description ?? null,
    })
    return this.incidentTypeRepository.save(type)
  }
}
