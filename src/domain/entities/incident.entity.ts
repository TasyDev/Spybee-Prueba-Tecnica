import { IncidentStatus, VALID_STATUS_TRANSITIONS } from "@value-objects/incident-status.vo"
import { IncidentPriority } from "@value-objects/incident-priority.vo"
import { Location } from "@value-objects/location.vo"
import {
  InvalidStatusTransitionError,
  IncidentAlreadyDeletedError,
  IncidentNotDeletedError,
  AssigneeAlreadyExistsError,
  AssigneeNotFoundError,
  ObserverAlreadyExistsError,
  ObserverNotFoundError,
} from "@errors/incident.errors"

export interface IncidentProps {
  id: string
  sequenceId: string
  orderId: number
  title: string
  description: string
  priority: IncidentPriority
  status: IncidentStatus
  approval: boolean
  deleted: boolean
  projectId: string | null
  typeId: string | null
  ownerId: string | null
  whatsappOwner: string | null
  location: Location
  locationDescription: string
  createdAt: Date
  updatedAt: Date
  dueDate: Date | null
  closingDate: Date | null
  assigneeIds: string[]
  observerIds: string[]
  tagIds: string[]
  mediaIds: string[]
}

export class Incident {
  private constructor(private props: IncidentProps) {}

  get id() { return this.props.id }
  get sequenceId() { return this.props.sequenceId }
  get orderId() { return this.props.orderId }
  get title() { return this.props.title }
  get description() { return this.props.description }
  get priority() { return this.props.priority }
  get status() { return this.props.status }
  get approval() { return this.props.approval }
  get deleted() { return this.props.deleted }
  get projectId() { return this.props.projectId }
  get typeId() { return this.props.typeId }
  get ownerId() { return this.props.ownerId }
  get whatsappOwner() { return this.props.whatsappOwner }
  get location() { return this.props.location }
  get locationDescription() { return this.props.locationDescription }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }
  get dueDate() { return this.props.dueDate }
  get closingDate() { return this.props.closingDate }
  get assigneeIds() { return [...this.props.assigneeIds] }
  get observerIds() { return [...this.props.observerIds] }
  get tagIds() { return [...this.props.tagIds] }
  get mediaIds() { return [...this.props.mediaIds] }

  static create(props: IncidentProps): Incident {
    return new Incident({ ...props })
  }

  toProps(): IncidentProps {
    return {
      ...this.props,
      assigneeIds: [...this.props.assigneeIds],
      observerIds: [...this.props.observerIds],
      tagIds: [...this.props.tagIds],
      mediaIds: [...this.props.mediaIds],
    }
  }

  updateTitle(title: string): void {
    this.props.title = title
    this.props.updatedAt = new Date()
  }

  updateDescription(description: string): void {
    this.props.description = description
    this.props.updatedAt = new Date()
  }

  updatePriority(priority: IncidentPriority): void {
    this.props.priority = priority
    this.props.updatedAt = new Date()
  }

  updateLocation(location: Location): void {
    this.props.location = location
    this.props.updatedAt = new Date()
  }

  updateLocationDescription(locationDescription: string): void {
    this.props.locationDescription = locationDescription
    this.props.updatedAt = new Date()
  }

  updateProjectId(projectId: string | null): void {
    this.props.projectId = projectId
    this.props.updatedAt = new Date()
  }

  updateTypeId(typeId: string | null): void {
    this.props.typeId = typeId
    this.props.updatedAt = new Date()
  }

  updateDueDate(dueDate: Date | null): void {
    this.props.dueDate = dueDate
    this.props.updatedAt = new Date()
  }

  updateWhatsappOwner(whatsappOwner: string | null): void {
    this.props.whatsappOwner = whatsappOwner
    this.props.updatedAt = new Date()
  }

  updateOwnerId(ownerId: string | null): void {
    this.props.ownerId = ownerId
    this.props.updatedAt = new Date()
  }

  updateSequenceId(sequenceId: string): void {
    this.props.sequenceId = sequenceId
    this.props.updatedAt = new Date()
  }

  updateOrderId(orderId: number): void {
    this.props.orderId = orderId
    this.props.updatedAt = new Date()
  }

  transitionTo(newStatus: IncidentStatus): void {
    const valid = VALID_STATUS_TRANSITIONS[this.props.status]
    if (!valid.includes(newStatus)) {
      throw new InvalidStatusTransitionError(this.props.status, newStatus)
    }
    this.props.status = newStatus
    if (newStatus === IncidentStatus.closed) {
      this.props.closingDate = new Date()
    }
    this.props.updatedAt = new Date()
  }

  softDelete(): void {
    if (this.props.deleted) {
      throw new IncidentAlreadyDeletedError(this.props.id)
    }
    this.props.deleted = true
    this.props.updatedAt = new Date()
  }

  restore(): void {
    if (!this.props.deleted) {
      throw new IncidentNotDeletedError(this.props.id)
    }
    this.props.deleted = false
    this.props.updatedAt = new Date()
  }

  approve(): void {
    this.props.approval = true
    this.props.updatedAt = new Date()
  }

  setApproval(approval: boolean): void {
    this.props.approval = approval
    this.props.updatedAt = new Date()
  }

  addAssignee(userId: string): void {
    if (this.props.assigneeIds.includes(userId)) {
      throw new AssigneeAlreadyExistsError(this.props.id, userId)
    }
    this.props.assigneeIds.push(userId)
    this.props.updatedAt = new Date()
  }

  removeAssignee(userId: string): void {
    const idx = this.props.assigneeIds.indexOf(userId)
    if (idx === -1) {
      throw new AssigneeNotFoundError(this.props.id, userId)
    }
    this.props.assigneeIds.splice(idx, 1)
    this.props.updatedAt = new Date()
  }

  addObserver(userId: string): void {
    if (this.props.observerIds.includes(userId)) {
      throw new ObserverAlreadyExistsError(this.props.id, userId)
    }
    this.props.observerIds.push(userId)
    this.props.updatedAt = new Date()
  }

  removeObserver(userId: string): void {
    const idx = this.props.observerIds.indexOf(userId)
    if (idx === -1) {
      throw new ObserverNotFoundError(this.props.id, userId)
    }
    this.props.observerIds.splice(idx, 1)
    this.props.updatedAt = new Date()
  }

  attachTag(tagId: string): void {
    if (this.props.tagIds.includes(tagId)) return
    this.props.tagIds.push(tagId)
    this.props.updatedAt = new Date()
  }

  detachTag(tagId: string): void {
    const idx = this.props.tagIds.indexOf(tagId)
    if (idx === -1) return
    this.props.tagIds.splice(idx, 1)
    this.props.updatedAt = new Date()
  }
}
