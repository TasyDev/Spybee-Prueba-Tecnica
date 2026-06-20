import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { PriorityBreakdownItem } from "@application/dto/dashboard.dto"

export class GetPriorityBreakdownUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<PriorityBreakdownItem[]> {
    return this.repo.getPriorityBreakdown(projectId)
  }
}
