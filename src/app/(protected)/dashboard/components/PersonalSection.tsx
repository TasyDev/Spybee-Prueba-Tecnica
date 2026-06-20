"use client"

import type { DashboardSectionPersonal } from "@/application/dto/dashboard.dto"
import { SkeletonLoader } from "./SkeletonLoader"
import { translatePriority } from "../lib/i18n"

interface Props {
  data: DashboardSectionPersonal | null
  loading: boolean
}

export function PersonalSection({ data, loading }: Props) {
  if (loading) return <SkeletonLoader height={400} />
  if (!data) return <Empty />

  const { ownerWorkload, assigneeWorkload, avgAssigneesByPriority } = data

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <TableBox title="Carga de trabajo por responsable">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr style={{ color: "#a6adc8", borderBottom: "1px solid #313244" }}>
                <th style={thStyle}>Responsable</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Abiertos</th>
                <th style={thStyle}>Vencidos</th>
                <th style={thStyle}>% Vencidos</th>
                <th style={thStyle}>Resolución (días)</th>
              </tr>
            </thead>
            <tbody>
              {ownerWorkload.map((o) => (
                <tr key={o.ownerId} style={{ borderBottom: "1px solid #313244", color: "#cdd6f4" }}>
                  <td style={tdStyle}>{o.ownerName}</td>
                  <td style={tdStyle}>{o.totalIncidents}</td>
                  <td style={tdStyle}>{o.totalOpen}</td>
                  <td style={tdStyle}><span style={{ color: o.totalOverdue > 0 ? "#f38ba8" : undefined }}>{o.totalOverdue}</span></td>
                  <td style={tdStyle}>{o.overdueRatePercent}%</td>
                  <td style={tdStyle}>{o.avgResolutionDays !== null ? `${o.avgResolutionDays}d` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableBox>

        <TableBox title="Carga de trabajo por asignado">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr style={{ color: "#a6adc8", borderBottom: "1px solid #313244" }}>
                <th style={thStyle}>Asignado</th>
                <th style={thStyle}>Total asignaciones</th>
                <th style={thStyle}>Abiertas</th>
              </tr>
            </thead>
            <tbody>
              {assigneeWorkload.map((a) => (
                <tr key={a.assigneeId} style={{ borderBottom: "1px solid #313244", color: "#cdd6f4" }}>
                  <td style={tdStyle}>{a.assigneeName}</td>
                  <td style={tdStyle}>{a.totalAssignments}</td>
                  <td style={tdStyle}>{a.openAssignments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableBox>
      </div>

      <TableBox title="Promedio de asignados por prioridad">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ color: "#a6adc8", borderBottom: "1px solid #313244" }}>
              <th style={thStyle}>Prioridad</th>
              <th style={thStyle}>Promedio de asignados</th>
            </tr>
          </thead>
          <tbody>
            {avgAssigneesByPriority.map((a) => (
              <tr key={a.priority} style={{ borderBottom: "1px solid #313244", color: "#cdd6f4" }}>
                <td style={tdStyle}>{translatePriority(a.priority)}</td>
                <td style={tdStyle}>{a.avgAssignees !== null ? a.avgAssignees.toFixed(2) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "0.5rem 0.75rem",
  fontWeight: 600,
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: 0.5,
}

const tdStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
}

function TableBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1e1e2e", borderRadius: 12, padding: "1rem", overflow: "auto" }}>
      <h3 style={{ color: "#a6adc8", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: 1, marginBottom: "0.75rem", margin: 0 }}>{title}</h3>
      {children}
    </div>
  )
}

function Empty() {
  return <div style={{ color: "#6c7086", textAlign: "center", padding: "2rem" }}>No hay datos disponibles</div>
}
