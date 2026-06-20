import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { OverdueRateResult } from "@application/dto/dashboard.dto"

export class GetOverdueRateUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<OverdueRateResult> {
    return this.repo.getOverdueRate(projectId)
  }
}
