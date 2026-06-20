import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { PriorityXStatusItem } from "@application/dto/dashboard.dto"

export class GetPriorityXStatusUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<PriorityXStatusItem[]> {
    return this.repo.getPriorityXStatus(projectId)
  }
}
