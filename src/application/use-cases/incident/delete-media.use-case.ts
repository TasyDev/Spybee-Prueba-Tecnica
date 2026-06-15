import { IIncidentRepository } from "@domain/ports/incident.repository"
import { IFileStorageService } from "@domain/ports/storage.service"
import { NotFoundError } from "@domain/errors/domain.errors"

export class DeleteMediaUseCase {
  constructor(
    private readonly incidentRepository: IIncidentRepository,
    private readonly storageService: IFileStorageService,
  ) {}

  async execute(mediaId: string): Promise<void> {
    const media = await this.incidentRepository.findMediaById(mediaId)
    if (!media) {
      throw new NotFoundError("Media", mediaId)
    }
    
    await this.storageService.delete(media.storageBucket, media.storagePath)
    await this.incidentRepository.deleteMedia(mediaId)
  }
}
