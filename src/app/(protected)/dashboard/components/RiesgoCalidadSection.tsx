"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { DashboardSectionRiesgoCalidad } from "@/application/dto/dashboard.dto"
import { MetricCard } from "./MetricCard"
import { SkeletonLoader } from "./SkeletonLoader"
import { translateStatus, translateTypeKey } from "../lib/i18n"

interface Props {
  data: DashboardSectionRiesgoCalidad | null
  loading: boolean
}

export function RiesgoCalidadSection({ data, loading }: Props) {
  if (loading) return <SkeletonLoader height={500} />
  if (!data) return <Empty />

  const { resolutionTime, approvalRateByType, overdueRateByType, projectComparison } = data

  const approvalChartData = approvalRateByType.map((a) => ({
    name: translateTypeKey(a.typeKey),
    rate: a.approvalRatePercent,
    total: a.total,
  }))

  const overdueTypeChartData = overdueRateByType.map((o) => ({
    name: translateTypeKey(o.typeKey),
    rate: o.overdueRatePercent ?? 0,
    overdue: o.overdueCount,
  }))

  const projectChartData = projectComparison.map((p) => ({
    name: `${p.projectName} (${translateStatus(p.status)})`,
    count: p.count,
  }))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <MetricCard
          label="Tiempo resolución (promedio)"
          value={resolutionTime.avgDays !== null ? `${resolutionTime.avgDays} días` : "—"}
          color="#a6e3a1"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <ChartBox title="% Aprobación por tipo (menor primero)">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={approvalChartData} layout="vertical">
              <XAxis type="number" tick={{ fill: "#a6adc8", fontSize: 12 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#a6adc8", fontSize: 10 }} width={160} interval={0} />
              <Tooltip contentStyle={{ background: "#313244", border: "none", borderRadius: 8, color: "#cdd6f4" }} formatter={(value: any) => [`${value}%`, "Aprobación"]} />
              <Bar dataKey="rate" fill="#fab387" radius={[0, 4, 4, 0]} name="% Aprobación" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="% Vencidos por tipo (>=3 incidentes abiertos)">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={overdueTypeChartData} layout="vertical">
              <XAxis type="number" tick={{ fill: "#a6adc8", fontSize: 12 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#a6adc8", fontSize: 10 }} width={160} interval={0} />
              <Tooltip contentStyle={{ background: "#313244", border: "none", borderRadius: 8, color: "#cdd6f4" }} formatter={(value: any) => [`${value}%`, "Vencidos"]} />
              <Bar dataKey="rate" fill="#f38ba8" radius={[0, 4, 4, 0]} name="% Vencidos" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>

      {projectChartData.length > 0 && (
        <ChartBox title="Comparación por proyecto">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={projectChartData}>
              <XAxis dataKey="name" tick={{ fill: "#a6adc8", fontSize: 10 }} />
              <YAxis tick={{ fill: "#a6adc8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#313244", border: "none", borderRadius: 8, color: "#cdd6f4" }} formatter={(value: any) => [value, "Cantidad"]} />
              <Bar dataKey="count" fill="#cba6f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      )}
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

function Empty() {
  return <div style={{ color: "#6c7086", textAlign: "center", padding: "2rem" }}>No hay datos disponibles</div>
}
