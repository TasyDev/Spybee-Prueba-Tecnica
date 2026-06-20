import type {
  StatusBreakdownItem,
  PriorityBreakdownItem,
  PriorityXStatusItem,
  OverdueRateResult,
  OverdueSeverityResult,
  ResolutionTimeResult,
  ApprovalRateByTypeItem,
  OverdueRateByTypeItem,
  ProjectComparisonItem,
  MonthlyTrendItem,
  TopTagsItem,
  TagsXPriorityItem,
  OwnerWorkloadItem,
  AssigneeWorkloadItem,
  AvgAssigneesByPriorityItem,
} from "@application/dto/dashboard.dto"

export interface IIncidentAnalyticsRepository {
  getStatusBreakdown(projectId?: string): Promise<StatusBreakdownItem[]>
  getPriorityBreakdown(projectId?: string): Promise<PriorityBreakdownItem[]>
  getPriorityXStatus(projectId?: string): Promise<PriorityXStatusItem[]>
  getOverdueRate(projectId?: string): Promise<OverdueRateResult>
  getOverdueSeverityDays(projectId?: string): Promise<OverdueSeverityResult>
  getResolutionTime(projectId?: string): Promise<ResolutionTimeResult>
  getApprovalRateByType(projectId?: string): Promise<ApprovalRateByTypeItem[]>
  getOverdueRateByType(projectId?: string): Promise<OverdueRateByTypeItem[]>
  getProjectComparison(projectId?: string): Promise<ProjectComparisonItem[]>
  getMonthlyTrend(projectId?: string): Promise<MonthlyTrendItem[]>
  getTopTags(projectId?: string): Promise<TopTagsItem[]>
  getTagsXPriority(projectId?: string): Promise<TagsXPriorityItem[]>
  getOwnerWorkload(projectId?: string): Promise<OwnerWorkloadItem[]>
  getAssigneeWorkload(projectId?: string): Promise<AssigneeWorkloadItem[]>
  getAvgAssigneesByPriority(projectId?: string): Promise<AvgAssigneesByPriorityItem[]>
}
