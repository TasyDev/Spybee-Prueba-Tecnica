import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { MonthlyTrendItem } from "@application/dto/dashboard.dto"

export class GetMonthlyTrendUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<MonthlyTrendItem[]> {
    return this.repo.getMonthlyTrend(projectId)
  }
}
