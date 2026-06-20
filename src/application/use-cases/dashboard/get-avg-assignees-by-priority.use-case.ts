import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { AvgAssigneesByPriorityItem } from "@application/dto/dashboard.dto"

export class GetAvgAssigneesByPriorityUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<AvgAssigneesByPriorityItem[]> {
    return this.repo.getAvgAssigneesByPriority(projectId)
  }
}
