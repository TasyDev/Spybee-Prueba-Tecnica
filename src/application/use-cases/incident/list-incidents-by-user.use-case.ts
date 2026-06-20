import { IIncidentRepository } from "@domain/ports/incident.repository"
import { Incident } from "@domain/entities/incident.entity"

export class ListIncidentsByUserUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute(userId: string): Promise<Incident[]> {
    const asOwner = await this.incidentRepository.findAll({ ownerId: userId })
    const asAssignee = await this.incidentRepository.findAll({ assigneeId: userId })
    const asObserver = await this.incidentRepository.findAll({ observerId: userId })

    const map = new Map<string, Incident>()
    for (const incident of [...asOwner, ...asAssignee, ...asObserver]) {
      map.set(incident.id, incident)
    }

    return Array.from(map.values())
  }
}
