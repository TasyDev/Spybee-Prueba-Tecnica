import { IIncidentRepository } from "@domain/ports/incident.repository"
import { IFileStorageService } from "@domain/ports/storage.service"
import { Media } from "@domain/entities/media.entity"
import { MediaStatus } from "@domain/value-objects/media-status.vo"
import { NotFoundError } from "@domain/errors/domain.errors"
import { UploadMediaDto } from "@application/dto/incident.dto"

export class UploadMediaUseCase {
  constructor(
    private readonly incidentRepository: IIncidentRepository,
    private readonly storageService: IFileStorageService,
  ) {}

  async execute(incidentId: string, dto: UploadMediaDto): Promise<Media> {
    const incident = await this.incidentRepository.findById(incidentId)
    if (!incident) {
      throw new NotFoundError("Incident", incidentId)
    }

    const bucket = this.getBucketForMimeType(dto.mimeType)
    const path = `${incidentId}/${crypto.randomUUID()}-${dto.filename}`
    
    const uploadResult = await this.storageService.upload(
      bucket,
      path,
      dto.file,
      dto.mimeType,
    )

    const media = Media.create({
      id: crypto.randomUUID(),
      incidentId: incidentId,
      name: dto.filename,
      type: dto.mimeType,
      format: dto.mimeType.split("/").pop() ?? "unknown",
      sizeBytes: dto.size,
      status: MediaStatus.uploaded,
      url: uploadResult.url,
      storagePath: uploadResult.path,
      storageBucket: uploadResult.bucket,
    })
    return this.incidentRepository.addMedia(incidentId, media)
  }

  private getBucketForMimeType(mimeType: string): string {
    if (mimeType.startsWith("video/")) {
      return process.env.SUPABASE_STORAGE_BUCKET_VIDEO ?? "video"
    }
    return process.env.SUPABASE_STORAGE_BUCKET_MEDIA ?? "media"
  }
}
