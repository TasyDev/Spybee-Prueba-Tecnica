import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { ResolutionTimeResult } from "@application/dto/dashboard.dto"

export class GetResolutionTimeUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<ResolutionTimeResult> {
    return this.repo.getResolutionTime(projectId)
  }
}
