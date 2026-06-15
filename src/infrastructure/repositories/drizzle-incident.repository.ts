import { eq, and, or, isNull, asc, desc, inArray } from "drizzle-orm"
import { IIncidentRepository, IncidentFilters } from "@domain/ports/incident.repository"
import { Incident } from "@domain/entities/incident.entity"
import { Media } from "@domain/entities/media.entity"
import {
  incidents,
  media,
  incidentAssignees,
  incidentObservers,
  incidentTagsMapping,
} from "@db/schema"
import { IncidentMapper } from "@mappers/incident.mapper"
import { MediaMapper } from "@mappers/media.mapper"

export class DrizzleIncidentRepository implements IIncidentRepository {
  constructor(private db: any) {}

  async findAll(filters: IncidentFilters): Promise<Incident[]> {
    const conditions = []

    if (filters.projectId) {
      conditions.push(eq(incidents.projectId, filters.projectId))
    }
    if (filters.status) {
      conditions.push(eq(incidents.status, filters.status))
    }
    if (filters.priority) {
      conditions.push(eq(incidents.priority, filters.priority))
    }
    if (filters.incidentTypeId) {
      conditions.push(eq(incidents.typeId, filters.incidentTypeId))
    }
    if (filters.ownerId) {
      conditions.push(eq(incidents.ownerId, filters.ownerId))
    }
    if (filters.deletedOnly) {
      conditions.push(eq(incidents.deleted, true))
    } else {
      conditions.push(or(eq(incidents.deleted, false), isNull(incidents.deleted)))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const orderBy = filters.orderBy ?? "createdAt"
    const orderDir = filters.orderDir ?? "desc"
    const orderFn = orderDir === "asc" ? asc : desc
    const orderColumn =
      orderBy === "priority"
        ? incidents.priority
        : orderBy === "updatedAt"
          ? incidents.updatedAt
          : incidents.createdAt

    const limit = filters.limit ?? 20
    const page = filters.page ?? 1
    const offset = (page - 1) * limit

    const rows = await this.db.query.incidents.findMany({
      where,
      limit,
      offset,
      orderBy: orderFn(orderColumn),
      with: {
        owner: true,
        project: true,
        type: true,
        media: true,
        assignees: { with: { user: true } },
        observers: { with: { user: true } },
        tagsMapping: { with: { tag: true } },
      },
    })

    let result = rows.map((row: any) => IncidentMapper.toDomain(row))

    if (filters.assigneeId) {
      result = result.filter((incident: Incident) =>
        incident.assigneeIds.includes(filters.assigneeId!)
      )
    }
    if (filters.tagId) {
      result = result.filter((incident: Incident) =>
        incident.tagIds.includes(filters.tagId!)
      )
    }
    if (filters.observerId) {
      result = result.filter((incident: Incident) =>
        incident.observerIds.includes(filters.observerId!)
      )
    }

    return result
  }

  async findById(id: string): Promise<Incident | null> {
    const row = await this.db.query.incidents.findFirst({
      where: eq(incidents.id, id),
      with: {
        owner: true,
        project: true,
        type: true,
        media: true,
        assignees: { with: { user: true } },
        observers: { with: { user: true } },
        tagsMapping: { with: { tag: true } },
      },
    })
    if (!row) return null
    return IncidentMapper.toDomain(row)
  }

  async findMediaById(mediaId: string): Promise<Media | null> {
    const row = await this.db.query.media.findFirst({
      where: eq(media.id, mediaId),
    })
    if (!row) return null
    return MediaMapper.toDomain(row)
  }

  async save(incident: Incident): Promise<Incident> {
    const props = incident.toProps()
    await this.db.insert(incidents).values({
      id: props.id,
      sequenceId: props.sequenceId,
      orderId: props.orderId,
      title: props.title,
      description: props.description,
      priority: props.priority,
      status: props.status,
      approval: props.approval,
      deleted: props.deleted,
      projectId: props.projectId,
      typeId: props.typeId,
      ownerId: props.ownerId,
      whatsappOwner: props.whatsappOwner,
      latitude: props.location.latitude,
      longitude: props.location.longitude,
      locationDescription: props.locationDescription,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      dueDate: props.dueDate,
      closingDate: props.closingDate,
    })
    return this.findById(props.id) as Promise<Incident>
  }

  async update(incident: Incident): Promise<Incident> {
    const props = incident.toProps()
    await this.db.update(incidents).set({
      sequenceId: props.sequenceId,
      orderId: props.orderId,
      title: props.title,
      description: props.description,
      priority: props.priority,
      status: props.status,
      approval: props.approval,
      deleted: props.deleted,
      projectId: props.projectId,
      typeId: props.typeId,
      ownerId: props.ownerId,
      whatsappOwner: props.whatsappOwner,
      latitude: props.location.latitude,
      longitude: props.location.longitude,
      locationDescription: props.locationDescription,
      updatedAt: new Date(),
      dueDate: props.dueDate,
      closingDate: props.closingDate,
    }).where(eq(incidents.id, props.id))
    return this.findById(props.id) as Promise<Incident>
  }

  async softDelete(id: string): Promise<void> {
    await this.db.update(incidents).set({
      deleted: true,
      updatedAt: new Date(),
    }).where(eq(incidents.id, id))
  }

  async restore(id: string): Promise<void> {
    await this.db.update(incidents).set({
      deleted: false,
      updatedAt: new Date(),
    }).where(eq(incidents.id, id))
  }

  async addAssignee(incidentId: string, userId: string): Promise<void> {
    await this.db.insert(incidentAssignees).values({ incidentId, userId })
  }

  async removeAssignee(incidentId: string, userId: string): Promise<void> {
    await this.db.delete(incidentAssignees).where(
      and(
        eq(incidentAssignees.incidentId, incidentId),
        eq(incidentAssignees.userId, userId)
      )
    )
  }

  async addObserver(incidentId: string, userId: string): Promise<void> {
    await this.db.insert(incidentObservers).values({ incidentId, userId })
  }

  async removeObserver(incidentId: string, userId: string): Promise<void> {
    await this.db.delete(incidentObservers).where(
      and(
        eq(incidentObservers.incidentId, incidentId),
        eq(incidentObservers.userId, userId)
      )
    )
  }

  async attachTag(incidentId: string, tagId: string): Promise<void> {
    await this.db.insert(incidentTagsMapping).values({ incidentId, tagId })
  }

  async detachTag(incidentId: string, tagId: string): Promise<void> {
    await this.db.delete(incidentTagsMapping).where(
      and(
        eq(incidentTagsMapping.incidentId, incidentId),
        eq(incidentTagsMapping.tagId, tagId)
      )
    )
  }

  async addMedia(incidentId: string, mediaEntity: Media): Promise<Media> {
    const props = mediaEntity.toProps()
    await this.db.insert(media).values({
      id: props.id,
      incidentId: incidentId,
      name: props.name,
      type: props.type,
      format: props.format,
      sizeBytes: props.sizeBytes,
      status: props.status,
      url: props.url,
    })
    return this.findMediaById(props.id) as Promise<Media>
  }

  async updateMedia(mediaEntity: Media): Promise<Media> {
    const props = mediaEntity.toProps()
    await this.db.update(media).set({
      status: props.status,
    }).where(eq(media.id, props.id))
    return this.findMediaById(props.id) as Promise<Media>
  }

  async deleteMedia(mediaId: string): Promise<void> {
    await this.db.delete(media).where(eq(media.id, mediaId))
  }
}
