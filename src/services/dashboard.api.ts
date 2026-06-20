import type {
  DashboardSectionEstadoGeneral,
  DashboardSectionRiesgoCalidad,
  DashboardSectionTendencia,
  DashboardSectionPersonal,
} from "@/application/dto/dashboard.dto"

const BASE = "/api/dashboard"

async function fetchSection<T>(path: string, projectId?: string): Promise<T> {
  const params = projectId ? `?projectId=${encodeURIComponent(projectId)}` : ""
  const res = await fetch(`${BASE}${path}${params}`)
  if (!res.ok) {
    throw new Error(`Dashboard API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function fetchEstadoGeneral(projectId?: string) {
  return fetchSection<DashboardSectionEstadoGeneral>("/estado-general", projectId)
}

export async function fetchRiesgoCalidad(projectId?: string) {
  return fetchSection<DashboardSectionRiesgoCalidad>("/riesgo-calidad", projectId)
}

export async function fetchTendencia(projectId?: string) {
  return fetchSection<DashboardSectionTendencia>("/tendencia", projectId)
}

export async function fetchPersonal(projectId?: string) {
  return fetchSection<DashboardSectionPersonal>("/personal", projectId)
}

export async function fetchAllDashboard(projectId?: string) {
  const [estadoGeneral, riesgoCalidad, tendencia, personal] = await Promise.all([
    fetchEstadoGeneral(projectId),
    fetchRiesgoCalidad(projectId),
    fetchTendencia(projectId),
    fetchPersonal(projectId),
  ])
  return { estadoGeneral, riesgoCalidad, tendencia, personal }
}
