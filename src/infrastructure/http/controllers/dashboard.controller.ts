import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { dashboardQuerySchema } from "@schemas/dashboard-query.schema"

export function createDashboardRouter(deps: {
  getStatusBreakdownUseCase: any
  getPriorityBreakdownUseCase: any
  getPriorityXStatusUseCase: any
  getOverdueRateUseCase: any
  getOverdueSeverityDaysUseCase: any
  getResolutionTimeUseCase: any
  getApprovalRateByTypeUseCase: any
  getOverdueRateByTypeUseCase: any
  getProjectComparisonUseCase: any
  getMonthlyTrendUseCase: any
  getTopTagsUseCase: any
  getTagsXPriorityUseCase: any
  getOwnerWorkloadUseCase: any
  getAssigneeWorkloadUseCase: any
  getAvgAssigneesByPriorityUseCase: any
}) {
  const router = new Hono()

  const validateQuery = zValidator("query", dashboardQuerySchema)

  router.get("/estado-general", validateQuery, async (c) => {
    const { projectId } = c.req.valid("query")
    const [status, priority, priorityXStatus, overdueRate, overdueSeverity] = await Promise.all([
      deps.getStatusBreakdownUseCase.execute(projectId),
      deps.getPriorityBreakdownUseCase.execute(projectId),
      deps.getPriorityXStatusUseCase.execute(projectId),
      deps.getOverdueRateUseCase.execute(projectId),
      deps.getOverdueSeverityDaysUseCase.execute(projectId),
    ])
    return c.json({ status, priority, priorityXStatus, overdueRate, overdueSeverity })
  })

  router.get("/riesgo-calidad", validateQuery, async (c) => {
    const { projectId } = c.req.valid("query")
    const [resolutionTime, approvalRateByType, overdueRateByType, projectComparison] = await Promise.all([
      deps.getResolutionTimeUseCase.execute(projectId),
      deps.getApprovalRateByTypeUseCase.execute(projectId),
      deps.getOverdueRateByTypeUseCase.execute(projectId),
      deps.getProjectComparisonUseCase.execute(projectId),
    ])
    return c.json({ resolutionTime, approvalRateByType, overdueRateByType, projectComparison })
  })

  router.get("/tendencia", validateQuery, async (c) => {
    const { projectId } = c.req.valid("query")
    const [monthlyTrend, topTags, tagsXPriority] = await Promise.all([
      deps.getMonthlyTrendUseCase.execute(projectId),
      deps.getTopTagsUseCase.execute(projectId),
      deps.getTagsXPriorityUseCase.execute(projectId),
    ])
    return c.json({ monthlyTrend, topTags, tagsXPriority })
  })

  router.get("/personal", validateQuery, async (c) => {
    const { projectId } = c.req.valid("query")
    const [ownerWorkload, assigneeWorkload, avgAssigneesByPriority] = await Promise.all([
      deps.getOwnerWorkloadUseCase.execute(projectId),
      deps.getAssigneeWorkloadUseCase.execute(projectId),
      deps.getAvgAssigneesByPriorityUseCase.execute(projectId),
    ])
    return c.json({ ownerWorkload, assigneeWorkload, avgAssigneesByPriority })
  })

  return router
}
