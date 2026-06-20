import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { TagsXPriorityItem } from "@application/dto/dashboard.dto"

export class GetTagsXPriorityUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<TagsXPriorityItem[]> {
    return this.repo.getTagsXPriority(projectId)
  }
}
