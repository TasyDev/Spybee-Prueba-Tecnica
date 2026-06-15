import { IIncidentRepository } from "@domain/ports/incident.repository"
import { Incident } from "@domain/entities/incident.entity"
import { IncidentPriority } from "@domain/value-objects/incident-priority.vo"
import { IncidentStatus } from "@domain/value-objects/incident-status.vo"
import { Location } from "@domain/value-objects/location.vo"
import { CreateIncidentDto } from "@application/dto/incident.dto"

export class CreateIncidentUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute(dto: CreateIncidentDto): Promise<Incident> {
    const now = new Date()
    const incident = Incident.create({
      id: crypto.randomUUID(),
      sequenceId: "",
      orderId: 0,
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      status: IncidentStatus.open,
      approval: false,
      deleted: false,
      projectId: dto.projectId ?? null,
      typeId: dto.incidentTypeId ?? null,
      ownerId: dto.reportedById ?? null,
      whatsappOwner: dto.whatsappOwner ?? null,
      location: dto.location,
      locationDescription: dto.locationDescription ?? "",
      createdAt: now,
      updatedAt: now,
      dueDate: dto.dueDate ?? null,
      closingDate: null,
      assigneeIds: [],
      observerIds: [],
      tagIds: [],
      mediaIds: [],
    })
    return this.incidentRepository.save(incident)
  }
}
