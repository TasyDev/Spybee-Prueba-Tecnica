"use client"

import type { ReactNode } from "react"

interface DashboardLayoutProps {
  header: ReactNode
  map: ReactNode
  estadoGeneral: ReactNode
  riesgoCalidad: ReactNode
  tendencia: ReactNode
  personal: ReactNode
}

export function DashboardLayout({ header, map, estadoGeneral, riesgoCalidad, tendencia, personal }: DashboardLayoutProps) {
  return (
    <div style={{ padding: "1.5rem", maxWidth: 1400, margin: "0 auto" }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#cdd6f4", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Dashboard</h1>
        {header}
      </div>

      <div style={{ marginBottom: "1.5rem", borderRadius: 12, overflow: "hidden", height: 400, width: "100%" }}>
        {map}
      </div>

      <Section title="Estado General">{estadoGeneral}</Section>
      <Section title="Riesgo y Calidad">{riesgoCalidad}</Section>
      <Section title="Tendencia">{tendencia}</Section>
      <Section title="Personal">{personal}</Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ color: "#cdd6f4", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem" }}>
        {title}
      </h2>
      {children}
    </div>
  )
}
