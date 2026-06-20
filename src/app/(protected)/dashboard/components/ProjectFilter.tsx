"use client"

import { useState, useEffect } from "react"

interface ProjectOption {
  id: string
  name: string
}

interface ProjectFilterProps {
  value: string | undefined
  onChange: (projectId: string | undefined) => void
}

export function ProjectFilter({ value, onChange }: ProjectFilterProps) {
  const [projects, setProjects] = useState<ProjectOption[]>([])

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : [])
      })
      .catch(() => {})
  }, [])

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label htmlFor="project-filter" style={{ color: "#a6adc8", fontSize: "0.8rem" }}>
        Proyecto:
      </label>
      <select
        id="project-filter"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        style={{
          background: "#313244",
          color: "#cdd6f4",
          border: "1px solid #45475a",
          borderRadius: 8,
          padding: "0.4rem 0.75rem",
          fontSize: "0.85rem",
          cursor: "pointer",
        }}
      >
        <option value="">Todos los proyectos</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  )
}
