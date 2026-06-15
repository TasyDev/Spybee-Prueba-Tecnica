import { IIncidentRepository } from "@domain/ports/incident.repository"
import { Incident } from "@domain/entities/incident.entity"
import { NotFoundError } from "@domain/errors/domain.errors"
import { PatchIncidentDto } from "@application/dto/incident.dto"

export class PatchIncidentUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute(id: string, dto: PatchIncidentDto): Promise<Incident> {
    const incident = await this.incidentRepository.findById(id)
    if (!incident) {
      throw new NotFoundError("Incident", id)
    }

    if (dto.status) {
      incident.transitionTo(dto.status)
    }
    if (dto.title) {
      incident.updateTitle(dto.title)
    }
    if (dto.description) {
      incident.updateDescription(dto.description)
    }
    if (dto.priority) {
      incident.updatePriority(dto.priority)
    }
    if (dto.location) {
      incident.updateLocation(dto.location)
    }
    if (dto.incidentTypeId !== undefined) {
      incident.updateTypeId(dto.incidentTypeId)
    }

    return this.incidentRepository.update(incident)
  }
}
