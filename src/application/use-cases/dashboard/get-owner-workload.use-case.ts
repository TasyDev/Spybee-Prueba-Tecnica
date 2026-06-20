import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { OwnerWorkloadItem } from "@application/dto/dashboard.dto"

export class GetOwnerWorkloadUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<OwnerWorkloadItem[]> {
    return this.repo.getOwnerWorkload(projectId)
  }
}
