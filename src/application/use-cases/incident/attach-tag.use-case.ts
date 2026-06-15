import { IIncidentRepository } from "@domain/ports/incident.repository"
import { ITagRepository } from "@domain/ports/tag.repository"
import { NotFoundError } from "@domain/errors/domain.errors"

export class AttachTagUseCase {
  constructor(
    private readonly incidentRepository: IIncidentRepository,
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(incidentId: string, tagId: string): Promise<void> {
    const incident = await this.incidentRepository.findById(incidentId)
    if (!incident) {
      throw new NotFoundError("Incident", incidentId)
    }
    const tag = await this.tagRepository.findById(tagId)
    if (!tag) {
      throw new NotFoundError("Tag", tagId)
    }
    incident.attachTag(tagId)
    await this.incidentRepository.attachTag(incidentId, tagId)
  }
}
