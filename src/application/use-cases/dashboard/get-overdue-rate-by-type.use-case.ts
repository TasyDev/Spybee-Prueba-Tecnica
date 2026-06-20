import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { OverdueRateByTypeItem } from "@application/dto/dashboard.dto"

export class GetOverdueRateByTypeUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<OverdueRateByTypeItem[]> {
    return this.repo.getOverdueRateByType(projectId)
  }
}
