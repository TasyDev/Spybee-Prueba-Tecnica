"use client"

import { useState, useEffect, useCallback } from "react"
import type { DashboardData } from "@/application/dto/dashboard.dto"
import { fetchAllDashboard } from "@/services/dashboard.api"

interface UseDashboardResult {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useDashboard(projectId?: string): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (pid?: string) => {
    setLoading(true)
    setError(null)

    try {
      const dashboardData = await fetchAllDashboard(pid)
      setData(dashboardData)
    } catch (err: any) {
      setError(err.message ?? "Error al cargar el dashboard")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(projectId)
  }, [projectId, fetchData])

  return { data, loading, error, refetch: () => fetchData(projectId) }
}
