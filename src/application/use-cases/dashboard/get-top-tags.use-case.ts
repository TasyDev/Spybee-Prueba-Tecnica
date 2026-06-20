import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { TopTagsItem } from "@application/dto/dashboard.dto"

export class GetTopTagsUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<TopTagsItem[]> {
    return this.repo.getTopTags(projectId)
  }
}
