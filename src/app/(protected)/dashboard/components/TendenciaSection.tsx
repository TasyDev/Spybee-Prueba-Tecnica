"use client"

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import type { DashboardSectionTendencia } from "@/application/dto/dashboard.dto"
import { SkeletonLoader } from "./SkeletonLoader"
import { translatePriority } from "../lib/i18n"

interface Props {
  data: DashboardSectionTendencia | null
  loading: boolean
}

export function TendenciaSection({ data, loading }: Props) {
  if (loading) return <SkeletonLoader height={500} />
  if (!data) return <Empty />

  const { monthlyTrend, topTags, tagsXPriority } = data

  const trendData = monthlyTrend.map((m) => ({ name: m.month, incidentes: m.count }))
  const tagsData = topTags.map((t) => ({ name: t.tagName, count: t.count }))
  const tagsPriorityData = tagsXPriority.map((t) => ({
    name: `${t.tagName} (${translatePriority(t.priority)})`,
    tagName: t.tagName,
    priority: t.priority,
    count: t.count,
  }))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <ChartBox title="Tendencia mensual">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <XAxis dataKey="name" tick={{ fill: "#a6adc8", fontSize: 11 }} />
            <YAxis tick={{ fill: "#a6adc8", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#313244", border: "none", borderRadius: 8, color: "#cdd6f4" }} formatter={(value: any) => [value, "Incidentes"]} />
            <Line type="monotone" dataKey="incidentes" stroke="#cba6f7" strokeWidth={2} dot={{ fill: "#cba6f7", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <ChartBox title="Tags más usados">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tagsData} layout="vertical">
              <XAxis type="number" tick={{ fill: "#a6adc8", fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#a6adc8", fontSize: 10 }} width={140} interval={0} />
              <Tooltip contentStyle={{ background: "#313244", border: "none", borderRadius: 8, color: "#cdd6f4" }} formatter={(value: any) => [value, "Cantidad"]} />
              <Bar dataKey="count" fill="#cba6f7" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Tags × Prioridad">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tagsPriorityData}>
              <XAxis dataKey="name" tick={{ fill: "#a6adc8", fontSize: 9 }} />
              <YAxis tick={{ fill: "#a6adc8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#313244", border: "none", borderRadius: 8, color: "#cdd6f4" }} formatter={(value: any) => [value, "Cantidad"]} />
              <Bar dataKey="count" fill="#f5c2e7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>
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
