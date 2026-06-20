import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { StatusBreakdownItem } from "@application/dto/dashboard.dto"

export class GetStatusBreakdownUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<StatusBreakdownItem[]> {
    return this.repo.getStatusBreakdown(projectId)
  }
}
