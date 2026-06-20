"use client"

import { useState, useCallback, useEffect } from "react"
import { DashboardLayout } from "./components/DashboardLayout"
import { ProjectFilter } from "./components/ProjectFilter"
import { IncidentMap } from "./components/IncidentMap"
import { SkeletonLoader } from "./components/SkeletonLoader"
import { EstadoGeneralSection } from "./components/EstadoGeneralSection"
import { RiesgoCalidadSection } from "./components/RiesgoCalidadSection"
import { TendenciaSection } from "./components/TendenciaSection"
import { PersonalSection } from "./components/PersonalSection"
import { useDashboard } from "@/hooks/useDashboard"
import { useIncidentStore } from "@/store/incidentStore"

export default function DashboardPage() {
  const [projectId, setProjectId] = useState<string | undefined>(undefined)
  const { data, loading, error, refetch } = useDashboard(projectId)

  const incidents = useIncidentStore((s) => s.incidents)
  const storeLoading = useIncidentStore((s) => s.loading)
  const fetchIncidents = useIncidentStore((s) => s.fetchIncidents)

  useEffect(() => {
    fetchIncidents()
  }, [fetchIncidents])

  const handleProjectChange = useCallback((pid: string | undefined) => {
    setProjectId(pid)
  }, [])

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "#f38ba8" }}>Error: {error}</p>
        <button
          onClick={refetch}
          style={{
            marginTop: "1rem",
            background: "#313244",
            color: "#cdd6f4",
            border: "1px solid #45475a",
            borderRadius: 8,
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </div>
    )
  }

  const mapLoading = loading || storeLoading

  return (
    <DashboardLayout
      header={
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <ProjectFilter value={projectId} onChange={handleProjectChange} />
          <button
            onClick={refetch}
            style={{
              background: "#313244",
              color: "#cdd6f4",
              border: "1px solid #45475a",
              borderRadius: 8,
              padding: "0.4rem 0.75rem",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            Actualizar
          </button>
        </div>
      }
      map={
        mapLoading ? <SkeletonLoader height={400} /> : <IncidentMap incidents={incidents} />
      }
      estadoGeneral={
        <EstadoGeneralSection data={data?.estadoGeneral ?? null} loading={loading} />
      }
      riesgoCalidad={
        <RiesgoCalidadSection data={data?.riesgoCalidad ?? null} loading={loading} />
      }
      tendencia={
        <TendenciaSection data={data?.tendencia ?? null} loading={loading} />
      }
      personal={
        <PersonalSection data={data?.personal ?? null} loading={loading} />
      }
    />
  )
}
