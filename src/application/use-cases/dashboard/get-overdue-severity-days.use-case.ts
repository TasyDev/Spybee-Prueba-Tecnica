import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { OverdueSeverityResult } from "@application/dto/dashboard.dto"

export class GetOverdueSeverityDaysUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<OverdueSeverityResult> {
    return this.repo.getOverdueSeverityDays(projectId)
  }
}
