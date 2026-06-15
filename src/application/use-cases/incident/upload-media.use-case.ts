import { IIncidentRepository } from "@domain/ports/incident.repository"
import { Media } from "@domain/entities/media.entity"
import { MediaStatus } from "@domain/value-objects/media-status.vo"
import { NotFoundError } from "@domain/errors/domain.errors"
import { UploadMediaDto } from "@application/dto/incident.dto"

export class UploadMediaUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute(incidentId: string, dto: UploadMediaDto): Promise<Media> {
    const incident = await this.incidentRepository.findById(incidentId)
    if (!incident) {
      throw new NotFoundError("Incident", incidentId)
    }
    const media = Media.create({
      id: crypto.randomUUID(),
      incidentId: incidentId,
      name: dto.filename,
      type: dto.mimeType,
      format: dto.mimeType.split("/").pop() ?? "unknown",
      sizeBytes: dto.size,
      status: MediaStatus.uploaded,
      url: dto.url,
    })
    return this.incidentRepository.addMedia(incidentId, media)
  }
}
