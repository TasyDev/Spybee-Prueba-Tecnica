"use client"

import dynamic from "next/dynamic"
import { useRef } from "react"
import type { MapViewRef } from "@/components/organisms/maps/MapView"
import type { Incident } from "@/store/types"

const MapView = dynamic(
  () => import("@/components/organisms/maps/MapView").then((m) => ({ default: m.MapView })),
  { ssr: false },
)

interface IncidentMapProps {
  incidents: Incident[]
}

export function IncidentMap({ incidents }: IncidentMapProps) {
  const mapRef = useRef<MapViewRef>(null)

  if (!incidents || incidents.length === 0) {
    return (
      <div style={{ height: 400, background: "#1e1e2e", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#6c7086" }}>
        No hay incidentes para mostrar en el mapa
      </div>
    )
  }

  return <MapView ref={mapRef} incidents={incidents} />
}
