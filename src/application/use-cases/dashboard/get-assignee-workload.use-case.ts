import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { AssigneeWorkloadItem } from "@application/dto/dashboard.dto"

export class GetAssigneeWorkloadUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<AssigneeWorkloadItem[]> {
    return this.repo.getAssigneeWorkload(projectId)
  }
}
