import { IIncidentRepository, IncidentFilters } from "@domain/ports/incident.repository"
import { Incident } from "@domain/entities/incident.entity"

export class ListIncidentsUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  execute(filters: IncidentFilters): Promise<Incident[]> {
    return this.incidentRepository.findAll(filters)
  }
}
