import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
import type { ApprovalRateByTypeItem } from "@application/dto/dashboard.dto"

export class GetApprovalRateByTypeUseCase {
  constructor(private readonly repo: IIncidentAnalyticsRepository) {}

  execute(projectId?: string): Promise<ApprovalRateByTypeItem[]> {
    return this.repo.getApprovalRateByType(projectId)
  }
}
