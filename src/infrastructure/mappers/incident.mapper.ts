import { Incident } from "@domain/entities/incident.entity"
import { IncidentStatus } from "@domain/value-objects/incident-status.vo"
import { IncidentPriority } from "@domain/value-objects/incident-priority.vo"
import { Location } from "@domain/value-objects/location.vo"
import { ProjectMapper } from "./project.mapper"
import { UserMapper } from "./user.mapper"
import { IncidentTypeMapper } from "./incident-type.mapper"
import { MediaMapper } from "./media.mapper"
import { TagMapper } from "./tag.mapper"

export class IncidentMapper {
  static toDomain(row: any): Incident {
    const entity = Incident.create({
      id: row.id,
      sequenceId: row.sequenceId,
      orderId: row.orderId,
      title: row.title,
      description: row.description,
      priority: row.priority as IncidentPriority,
      status: row.status as IncidentStatus,
      approval: row.approval ?? false,
      deleted: row.deleted ?? false,
      projectId: row.projectId,
      typeId: row.typeId,
      ownerId: row.ownerId,
      whatsappOwner: row.whatsappOwner,
      location: Location.create(row.latitude, row.longitude),
      locationDescription: row.locationDescription,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      dueDate: row.dueDate,
      closingDate: row.closingDate,
      assigneeIds: row.assignees?.map((a: any) => a.userId) ?? [],
      observerIds: row.observers?.map((o: any) => o.userId) ?? [],
      tagIds: row.tagsMapping?.map((t: any) => t.tagId) ?? [],
      mediaIds: row.media?.map((m: any) => m.id) ?? [],
    })
    Object.defineProperty(entity, '__joined', {
      value: {
        type: row.type,
        project: row.project,
        owner: row.owner,
        media: row.media,
        tagsMapping: row.tagsMapping,
        assignees: row.assignees,
        observers: row.observers,
      },
      enumerable: false,
      writable: false,
      configurable: false,
    })
    return entity
  }

  static toResponse(entity: Incident): any {
    const j = (entity as any).__joined
    const type = j?.type
      ? IncidentTypeMapper.toResponse(j.type)
      : { id: entity.typeId }
    const project = j?.project
      ? ProjectMapper.toResponse(j.project)
      : { id: entity.projectId }
    const owner = j?.owner
      ? UserMapper.toResponse(j.owner)
      : { id: entity.ownerId }
    const assignees = j?.assignees?.map((a: any) =>
      UserMapper.toResponse(a.user)
    ) ?? []
    const observers = j?.observers?.map((o: any) =>
      UserMapper.toResponse(o.user)
    ) ?? []
    const media = j?.media?.map((m: any) =>
      MediaMapper.toResponse(MediaMapper.toDomain(m))
    ) ?? []
    const tags = j?.tagsMapping?.map((t: any) =>
      TagMapper.toResponse(t.tag)
    ) ?? []

    return {
      id: entity.id,
      sequenceId: entity.sequenceId,
      order: entity.orderId,
      title: entity.title,
      description: entity.description,
      type,
      priority: entity.priority,
      status: entity.status,
      approval: entity.approval,
      project,
      owner,
      whatsappOwner: entity.whatsappOwner,
      assignees,
      observers,
      assigneeIds: entity.assigneeIds,
      observerIds: entity.observerIds,
      tagIds: entity.tagIds,
      mediaIds: entity.mediaIds,
      coordinates: { lat: entity.location.latitude, lng: entity.location.longitude },
      locationDescription: entity.locationDescription,
      dueDate: entity.dueDate,
      closingDate: entity.closingDate,
      media,
      tags,
      deleted: entity.deleted,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
