import { IIncidentRepository } from "@domain/ports/incident.repository"
import { IFileStorageService } from "@domain/ports/storage.service"
import { NotFoundError } from "@domain/errors/domain.errors"

export class CancelDraftUseCase {
  constructor(
    private readonly incidentRepository: IIncidentRepository,
    private readonly storageService: IFileStorageService,
  ) {}

  async execute(incidentId: string): Promise<void> {
    const incident = await this.incidentRepository.findByIdIncludingDeleted(incidentId)
    if (!incident) {
      throw new NotFoundError("Incident", incidentId)
    }

    const mediaList = await this.incidentRepository.findMediaByIncidentId(incidentId)

    for (const media of mediaList) {
      try {
        await this.storageService.delete(media.storageBucket, media.storagePath)
      } catch {
        // Ignore storage deletion errors during cleanup
      }
      await this.incidentRepository.deleteMedia(media.id)
    }

    await this.incidentRepository.hardDelete(incidentId)
  }
}
