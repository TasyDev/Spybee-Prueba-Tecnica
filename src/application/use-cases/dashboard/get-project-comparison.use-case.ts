import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { ProjectComparisonItem } from "@application/dto/dashboard.dto"

export class GetProjectComparisonUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<ProjectComparisonItem[]> {
    return this.repo.getProjectComparison(projectId)
  }
}
