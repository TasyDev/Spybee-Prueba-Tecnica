"use client"

export function SkeletonLoader({ height = 200 }: { height?: number }) {
  return (
    <div
      style={{
        background: "linear-gradient(90deg, #1e1e2e 25%, #313244 50%, #1e1e2e 75%)",
        backgroundSize: "200% 100%",
        borderRadius: 12,
        width: "100%",
        height,
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    />
  )
}
