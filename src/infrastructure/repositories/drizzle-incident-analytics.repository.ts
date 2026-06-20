import { sql } from "drizzle-orm"
import type { IIncidentAnalyticsRepository } from "@domain/ports/incident-analytics.repository"
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

export class DrizzleIncidentAnalyticsRepository implements IIncidentAnalyticsRepository {
  constructor(private db: any) {}

  private async queryRows(sqlQuery: any): Promise<any[]> {
    const result = await this.db.execute(sqlQuery)
    return result.rows ?? result
  }

  async getStatusBreakdown(projectId?: string): Promise<StatusBreakdownItem[]> {
    const rows = await this.queryRows(sql`
      SELECT status, COUNT(*)::int as count
      FROM incidents
      WHERE deleted IS NOT TRUE AND status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR project_id = ${projectId ?? null})
      GROUP BY status
    `)
    return rows as StatusBreakdownItem[]
  }

  async getPriorityBreakdown(projectId?: string): Promise<PriorityBreakdownItem[]> {
    const rows = await this.queryRows(sql`
      SELECT priority, COUNT(*)::int as count
      FROM incidents
      WHERE deleted IS NOT TRUE AND status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR project_id = ${projectId ?? null})
      GROUP BY priority
    `)
    return rows as PriorityBreakdownItem[]
  }

  async getPriorityXStatus(projectId?: string): Promise<PriorityXStatusItem[]> {
    const rows = await this.queryRows(sql`
      SELECT priority, status, COUNT(*)::int as count
      FROM incidents
      WHERE deleted IS NOT TRUE AND status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR project_id = ${projectId ?? null})
      GROUP BY priority, status
      ORDER BY priority, status
    `)
    return rows as PriorityXStatusItem[]
  }

  async getOverdueRate(projectId?: string): Promise<OverdueRateResult> {
    const rows = await this.queryRows(sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'open' AND due_date IS NOT NULL AND due_date < NOW())::int as overdue_count,
        COUNT(*) FILTER (WHERE status = 'open' AND due_date IS NOT NULL)::int as total_open_with_due_date
      FROM incidents
      WHERE deleted IS NOT TRUE AND status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR project_id = ${projectId ?? null})
    `)
    const row = rows[0] ?? { overdue_count: 0, total_open_with_due_date: 0 }
    return {
      overdueCount: row.overdue_count,
      totalOpenWithDueDate: row.total_open_with_due_date,
      overdueRatePercent:
        row.total_open_with_due_date > 0
          ? Math.round((row.overdue_count / row.total_open_with_due_date) * 10000) / 100
          : null,
    }
  }

  async getOverdueSeverityDays(projectId?: string): Promise<OverdueSeverityResult> {
    const rows = await this.queryRows(sql`
      SELECT
        AVG(EXTRACT(EPOCH FROM (NOW() - due_date)) / 86400)::float as avg_days,
        MAX(EXTRACT(EPOCH FROM (NOW() - due_date)) / 86400)::float as max_days
      FROM incidents
      WHERE status = 'open' AND due_date IS NOT NULL AND due_date < NOW()
        AND deleted IS NOT TRUE AND status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR project_id = ${projectId ?? null})
    `)
    const row = rows[0] ?? { avg_days: null, max_days: null }
    return {
      avgDays: row.avg_days ? parseFloat(row.avg_days.toFixed(1)) : null,
      maxDays: row.max_days ? parseFloat(row.max_days.toFixed(1)) : null,
    }
  }

  async getResolutionTime(projectId?: string): Promise<ResolutionTimeResult> {
    const rows = await this.queryRows(sql`
      SELECT AVG(EXTRACT(EPOCH FROM (closing_date - created_at)) / 86400)::float as avg_days
      FROM incidents
      WHERE status = 'closed' AND closing_date IS NOT NULL
        AND deleted IS NOT TRUE AND status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR project_id = ${projectId ?? null})
    `)
    const row = rows[0] ?? { avg_days: null }
    return { avgDays: row.avg_days ? parseFloat(row.avg_days.toFixed(1)) : null }
  }

  async getApprovalRateByType(projectId?: string): Promise<ApprovalRateByTypeItem[]> {
    const rows = await this.queryRows(sql`
      SELECT
        it.key as type_key,
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE i.approval = true)::int as approved_count,
        ROUND(COUNT(*) FILTER (WHERE i.approval = true) * 100.0 / NULLIF(COUNT(*), 0), 2)::float as approval_rate
      FROM incidents i
      JOIN incident_types it ON i.type_id = it.id
      WHERE i.deleted IS NOT TRUE AND i.status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR i.project_id = ${projectId ?? null})
      GROUP BY it.key
      HAVING COUNT(*) >= 3
      ORDER BY approval_rate ASC
    `)
    return rows.map((r: any) => ({
      typeKey: r.type_key,
      total: r.total,
      approvedCount: r.approved_count,
      approvalRatePercent: r.approval_rate,
    }))
  }

  async getOverdueRateByType(projectId?: string): Promise<OverdueRateByTypeItem[]> {
    const rows = await this.queryRows(sql`
      SELECT
        it.key as type_key,
        COUNT(*) FILTER (WHERE i.status = 'open' AND i.due_date IS NOT NULL AND i.due_date < NOW())::int as overdue_count,
        COUNT(*) FILTER (WHERE i.status = 'open' AND i.due_date IS NOT NULL)::int as total_open_with_due_date,
        ROUND(COUNT(*) FILTER (WHERE i.status = 'open' AND i.due_date IS NOT NULL AND i.due_date < NOW()) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE i.status = 'open' AND i.due_date IS NOT NULL), 0), 2)::float as overdue_rate
      FROM incidents i
      JOIN incident_types it ON i.type_id = it.id
      WHERE i.deleted IS NOT TRUE AND i.status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR i.project_id = ${projectId ?? null})
      GROUP BY it.key
      HAVING COUNT(*) FILTER (WHERE i.status = 'open' AND i.due_date IS NOT NULL) >= 3
    `)
    return rows.map((r: any) => ({
      typeKey: r.type_key,
      overdueCount: r.overdue_count,
      totalOpenWithDueDate: r.total_open_with_due_date,
      overdueRatePercent: r.overdue_rate,
    }))
  }

  async getProjectComparison(projectId?: string): Promise<ProjectComparisonItem[]> {
    const rows = await this.queryRows(sql`
      SELECT
        p.id as project_id,
        p.name as project_name,
        i.status,
        COUNT(*)::int as count
      FROM incidents i
      JOIN projects p ON i.project_id = p.id
      WHERE i.deleted IS NOT TRUE AND i.status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR i.project_id = ${projectId ?? null})
      GROUP BY p.id, p.name, i.status
      ORDER BY p.name, i.status
    `)
    return rows.map((r: any) => ({
      projectId: r.project_id,
      projectName: r.project_name,
      status: r.status,
      count: r.count,
    }))
  }

  async getMonthlyTrend(projectId?: string): Promise<MonthlyTrendItem[]> {
    const rows = await this.queryRows(sql`
      SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*)::int as count
      FROM incidents
      WHERE deleted IS NOT TRUE AND status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR project_id = ${projectId ?? null})
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month
    `)
    return rows as MonthlyTrendItem[]
  }

  async getTopTags(projectId?: string): Promise<TopTagsItem[]> {
    const rows = await this.queryRows(sql`
      SELECT t.name as tag_name, COUNT(*)::int as count
      FROM incident_tags_mapping itm
      JOIN tags t ON itm.tag_id = t.id
      JOIN incidents i ON itm.incident_id = i.id
      WHERE i.deleted IS NOT TRUE AND i.status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR i.project_id = ${projectId ?? null})
      GROUP BY t.name
      ORDER BY count DESC
    `)
    return rows.map((r: any) => ({ tagName: r.tag_name, count: r.count }))
  }

  async getTagsXPriority(projectId?: string): Promise<TagsXPriorityItem[]> {
    const rows = await this.queryRows(sql`
      SELECT t.name as tag_name, i.priority, COUNT(*)::int as count
      FROM incident_tags_mapping itm
      JOIN tags t ON itm.tag_id = t.id
      JOIN incidents i ON itm.incident_id = i.id
      WHERE i.deleted IS NOT TRUE AND i.status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR i.project_id = ${projectId ?? null})
      GROUP BY t.name, i.priority
      ORDER BY t.name, i.priority
    `)
    return rows.map((r: any) => ({ tagName: r.tag_name, priority: r.priority, count: r.count }))
  }

  async getOwnerWorkload(projectId?: string): Promise<OwnerWorkloadItem[]> {
    const rows = await this.queryRows(sql`
      SELECT
        COALESCE(u.id, 'sin_asignar') as owner_id,
        COALESCE(u.name, 'Sin asignar') as owner_name,
        COUNT(*)::int as total_incidents,
        COUNT(*) FILTER (WHERE i.status = 'open')::int as total_open,
        COUNT(*) FILTER (WHERE i.status = 'open' AND i.due_date IS NOT NULL AND i.due_date < NOW())::int as total_overdue,
        ROUND(COUNT(*) FILTER (WHERE i.status = 'open' AND i.due_date IS NOT NULL AND i.due_date < NOW()) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE i.status = 'open'), 0), 2)::float as overdue_rate,
        AVG(EXTRACT(EPOCH FROM (i.closing_date - i.created_at)) / 86400) FILTER (WHERE i.status = 'closed' AND i.closing_date IS NOT NULL)::float as avg_resolution_days
      FROM incidents i
      LEFT JOIN users u ON i.owner_id = u.id
      WHERE i.deleted IS NOT TRUE AND i.status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR i.project_id = ${projectId ?? null})
      GROUP BY u.id, u.name
      ORDER BY total_open DESC
    `)
    return rows.map((r: any) => ({
      ownerId: r.owner_id,
      ownerName: r.owner_name,
      totalIncidents: r.total_incidents,
      totalOpen: r.total_open,
      totalOverdue: r.total_overdue,
      overdueRatePercent: r.overdue_rate ?? 0,
      avgResolutionDays: r.avg_resolution_days ? parseFloat(r.avg_resolution_days.toFixed(1)) : null,
    }))
  }

  async getAssigneeWorkload(projectId?: string): Promise<AssigneeWorkloadItem[]> {
    const rows = await this.queryRows(sql`
      SELECT
        u.id as assignee_id,
        u.name as assignee_name,
        COUNT(*)::int as total_assignments,
        COUNT(*) FILTER (WHERE i.status = 'open')::int as open_assignments
      FROM incident_assignees ia
      JOIN users u ON ia.user_id = u.id
      JOIN incidents i ON ia.incident_id = i.id
      WHERE i.deleted IS NOT TRUE AND i.status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR i.project_id = ${projectId ?? null})
      GROUP BY u.id, u.name
      ORDER BY total_assignments DESC
    `)
    return rows.map((r: any) => ({
      assigneeId: r.assignee_id,
      assigneeName: r.assignee_name,
      totalAssignments: r.total_assignments,
      openAssignments: r.open_assignments,
    }))
  }

  async getAvgAssigneesByPriority(projectId?: string): Promise<AvgAssigneesByPriorityItem[]> {
    const rows = await this.queryRows(sql`
      SELECT
        i.priority,
        AVG(COALESCE(ac.assignee_count, 0))::float as avg_assignees
      FROM incidents i
      LEFT JOIN (
        SELECT incident_id, COUNT(*)::int as assignee_count
        FROM incident_assignees
        GROUP BY incident_id
      ) ac ON i.id = ac.incident_id
      WHERE i.deleted IS NOT TRUE AND i.status != 'draft'
        AND (${projectId ?? null}::text IS NULL OR i.project_id = ${projectId ?? null})
      GROUP BY i.priority
      ORDER BY i.priority
    `)
    return rows.map((r: any) => ({
      priority: r.priority,
      avgAssignees: r.avg_assignees !== null && r.avg_assignees !== undefined
        ? parseFloat(r.avg_assignees.toFixed(2))
        : null,
    }))
  }
}
