export const STATUS_TRANSLATIONS: Record<string, string> = {
  open: "Abierto",
  closed: "Cerrado",
  on_pause: "En pausa",
  in_progress: "En progreso",
  resolved: "Resuelto",
  rejected: "Rechazado",
  draft: "Borrador",
}

export const PRIORITY_TRANSLATIONS: Record<string, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
}

export const TYPE_TRANSLATIONS: Record<string, string> = {
  plumbing: "Hidrosanitario",
  coordination: "Coordinación de Diseños",
  electrical: "Eléctrico",
  infrastructure: "Infraestructura",
  safety_hazard: "Prevención de Riesgos",
  structural: "Estructural",
  materials: "Materiales",
  masonry: "Mampostería",
  achitectural: "Arquitectónico",
  stability: "Estabilidad",
  excavation: "Excavación",
  urban_planning: "Urbanismo",
  "soil-study": "Estudio de Suelos",
  observation: "Observación General",
  foundation: "Cimentación",
}

export function translateStatus(status: string): string {
  return STATUS_TRANSLATIONS[status] ?? status
}

export function translatePriority(priority: string): string {
  return PRIORITY_TRANSLATIONS[priority] ?? priority
}

export function translateTypeKey(key: string): string {
  return TYPE_TRANSLATIONS[key] ?? key
}
