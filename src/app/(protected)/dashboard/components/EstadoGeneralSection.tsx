"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { DashboardSectionEstadoGeneral } from "@/application/dto/dashboard.dto"
import { MetricCard } from "./MetricCard"
import { SkeletonLoader } from "./SkeletonLoader"
import { translateStatus, translatePriority } from "../lib/i18n"

interface Props {
  data: DashboardSectionEstadoGeneral | null
  loading: boolean
}

const STATUS_COLORS: Record<string, string> = {
  open: "#f9e2af",
  in_progress: "#cba6f7",
  resolved: "#a6e3a1",
  closed: "#585b70",
  rejected: "#f38ba8",
}

const PRIORITY_COLORS: Record<string, string> = {
  high: "#f38ba8",
  medium: "#fab387",
  low: "#a6e3a1",
}

export function EstadoGeneralSection({ data, loading }: Props) {
  if (loading) return <SkeletonLoader height={500} />
  if (!data) return <EmptyState />

  const { status, priority, priorityXStatus, overdueRate, overdueSeverity } = data

  const statusData = status.map((s) => ({
    name: translateStatus(s.status),
    count: s.count,
    fill: STATUS_COLORS[s.status] ?? "#585b70",
  }))

  const priorityData = priority.map((p) => ({
    name: translatePriority(p.priority),
    count: p.count,
    fill: PRIORITY_COLORS[p.priority] ?? "#585b70",
  }))

  const priorityXStatusData = priorityXStatus.map((p) => ({
    name: `${translatePriority(p.priority)} - ${translateStatus(p.status)}`,
    count: p.count,
  }))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <MetricCard
          label="Vencidos"
          value={overdueRate.overdueCount}
          subtitle={overdueRate.overdueRatePercent !== null ? `${overdueRate.overdueRatePercent}% del total con fecha` : "Sin datos"}
          color="#f38ba8"
        />
        <MetricCard
          label="Vencidos promedio"
          value={overdueSeverity.avgDays !== null ? `${overdueSeverity.avgDays} días` : "—"}
          subtitle={overdueSeverity.maxDays !== null ? `Máximo: ${overdueSeverity.maxDays} días` : undefined}
          color="#fab387"
        />
        <MetricCard
          label="Total abiertos con fecha"
          value={overdueRate.totalOpenWithDueDate}
          color="#94e2d5"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <ChartBox title="Por estado">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" tick={{ fill: "#a6adc8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#a6adc8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#313244", border: "none", borderRadius: 8, color: "#cdd6f4" }} formatter={(value: any) => [value, "Cantidad"]} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Por prioridad">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData}>
              <XAxis dataKey="name" tick={{ fill: "#a6adc8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#a6adc8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#313244", border: "none", borderRadius: 8, color: "#cdd6f4" }} formatter={(value: any) => [value, "Cantidad"]} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>

      <ChartBox title="Prioridad × Estado">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={priorityXStatusData}>
            <XAxis dataKey="name" tick={{ fill: "#a6adc8", fontSize: 10 }} />
            <YAxis tick={{ fill: "#a6adc8", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#313244", border: "none", borderRadius: 8, color: "#cdd6f4" }} formatter={(value: any) => [value, "Cantidad"]} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#cba6f7" />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  )
}

function ChartBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1e1e2e", borderRadius: 12, padding: "1rem" }}>
      <h3 style={{ color: "#a6adc8", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: 1, marginBottom: "0.75rem", margin: 0 }}>{title}</h3>
      {children}
    </div>
  )
}

function EmptyState() {
  return <div style={{ color: "#6c7086", textAlign: "center", padding: "2rem" }}>No hay datos disponibles</div>
}
