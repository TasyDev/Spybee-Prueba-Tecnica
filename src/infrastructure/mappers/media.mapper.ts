import { Media } from "@domain/entities/media.entity"
import { MediaStatus } from "@domain/value-objects/media-status.vo"

export class MediaMapper {
  static toDomain(row: any): Media {
    return Media.create({
      id: row.id,
      incidentId: row.incidentId,
      name: row.name,
      type: row.type,
      format: row.format,
      sizeBytes: row.sizeBytes,
      status: row.status as MediaStatus,
      url: row.url,
    })
  }

  static toResponse(entity: Media): any {
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      format: entity.format,
      size: entity.sizeBytes,
      status: entity.status,
      url: entity.url,
    }
  }
}
