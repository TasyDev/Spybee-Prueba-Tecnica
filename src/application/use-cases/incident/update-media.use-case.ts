import { IIncidentRepository } from "@domain/ports/incident.repository"
import { Media } from "@domain/entities/media.entity"
import { NotFoundError } from "@domain/errors/domain.errors"
import { UpdateMediaDto } from "@application/dto/incident.dto"
import { MediaStatus } from "@domain/value-objects/media-status.vo"

export class UpdateMediaUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute(mediaId: string, dto: UpdateMediaDto): Promise<Media> {
    const media = await this.incidentRepository.findMediaById(mediaId)
    if (!media) {
      throw new NotFoundError("Media", mediaId)
    }

    const status = Object.values(MediaStatus).find((s) => s === dto.status) as MediaStatus | undefined
    if (!status) {
      throw new Error(`Invalid media status: ${dto.status}`)
    }

    media.updateStatus(status)
    return this.incidentRepository.updateMedia(media)
  }
}
