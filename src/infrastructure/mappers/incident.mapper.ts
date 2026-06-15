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
    return Incident.create({
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
  }

  static toResponse(entity: Incident, row?: any): any {
    const type = row?.type
      ? IncidentTypeMapper.toResponse(row.type)
      : { id: entity.typeId }
    const project = row?.project
      ? ProjectMapper.toResponse(row.project)
      : { id: entity.projectId }
    const owner = row?.owner
      ? UserMapper.toResponse(row.owner)
      : { id: entity.ownerId }
    const assignees = row?.assignees?.map((a: any) =>
      UserMapper.toResponse(a.user)
    ) ?? []
    const observers = row?.observers?.map((o: any) =>
      UserMapper.toResponse(o.user)
    ) ?? []
    const media = row?.media?.map((m: any) =>
      MediaMapper.toResponse(MediaMapper.toDomain(m))
    ) ?? []
    const tags = row?.tagsMapping?.map((t: any) =>
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
