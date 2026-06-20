"use client"

interface MetricCardProps {
  label: string
  value: string | number | null | undefined
  subtitle?: string
  color?: string
  trend?: "up" | "down" | "neutral"
}

export function MetricCard({ label, value, subtitle, color, trend }: MetricCardProps) {
  const trendIcon =
    trend === "up" ? "↑" : trend === "down" ? "↓" : "→"

  return (
    <div
      style={{
        background: "#1e1e2e",
        borderRadius: 12,
        padding: "1rem 1.25rem",
        borderLeft: color ? `4px solid ${color}` : "4px solid #585b70",
        flex: 1,
        minWidth: 140,
      }}
    >
      <div style={{ color: "#a6adc8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: "#cdd6f4", fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.1 }}>
        {value ?? "—"}
      </div>
      {subtitle && (
        <div style={{ color: "#6c7086", fontSize: "0.75rem", marginTop: 4 }}>
          {trend ? <span style={{ marginRight: 4 }}>{trendIcon}</span> : null}
          {subtitle}
        </div>
      )}
    </div>
  )
}
