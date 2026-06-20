export interface StatusBreakdownItem {
  status: string
  count: number
}

export interface PriorityBreakdownItem {
  priority: string
  count: number
}

export interface PriorityXStatusItem {
  priority: string
  status: string
  count: number
}

export interface OverdueRateResult {
  overdueCount: number
  totalOpenWithDueDate: number
  overdueRatePercent: number | null
}

export interface OverdueSeverityResult {
  avgDays: number | null
  maxDays: number | null
}

export interface ResolutionTimeResult {
  avgDays: number | null
}

export interface ApprovalRateByTypeItem {
  typeKey: string
  total: number
  approvedCount: number
  approvalRatePercent: number
}

export interface OverdueRateByTypeItem {
  typeKey: string
  overdueCount: number
  totalOpenWithDueDate: number
  overdueRatePercent: number | null
}

export interface ProjectComparisonItem {
  projectId: string
  projectName: string
  status: string
  count: number
}

export interface MonthlyTrendItem {
  month: string
  count: number
}

export interface TopTagsItem {
  tagName: string
  count: number
}

export interface TagsXPriorityItem {
  tagName: string
  priority: string
  count: number
}

export interface OwnerWorkloadItem {
  ownerId: string
  ownerName: string
  totalIncidents: number
  totalOpen: number
  totalOverdue: number
  overdueRatePercent: number
  avgResolutionDays: number | null
}

export interface AssigneeWorkloadItem {
  assigneeId: string
  assigneeName: string
  totalAssignments: number
  openAssignments: number
}

export interface AvgAssigneesByPriorityItem {
  priority: string
  avgAssignees: number | null
}

export interface DashboardSectionEstadoGeneral {
  status: StatusBreakdownItem[]
  priority: PriorityBreakdownItem[]
  priorityXStatus: PriorityXStatusItem[]
  overdueRate: OverdueRateResult
  overdueSeverity: OverdueSeverityResult
}

export interface DashboardSectionRiesgoCalidad {
  resolutionTime: ResolutionTimeResult
  approvalRateByType: ApprovalRateByTypeItem[]
  overdueRateByType: OverdueRateByTypeItem[]
  projectComparison: ProjectComparisonItem[]
}

export interface DashboardSectionTendencia {
  monthlyTrend: MonthlyTrendItem[]
  topTags: TopTagsItem[]
  tagsXPriority: TagsXPriorityItem[]
}

export interface DashboardSectionPersonal {
  ownerWorkload: OwnerWorkloadItem[]
  assigneeWorkload: AssigneeWorkloadItem[]
  avgAssigneesByPriority: AvgAssigneesByPriorityItem[]
}

export interface DashboardData {
  estadoGeneral: DashboardSectionEstadoGeneral
  riesgoCalidad: DashboardSectionRiesgoCalidad
  tendencia: DashboardSectionTendencia
  personal: DashboardSectionPersonal
}
