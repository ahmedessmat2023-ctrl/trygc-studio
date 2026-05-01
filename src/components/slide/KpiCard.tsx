import type { MetricItem } from "@/deck/types";

interface KpiCardProps {
  metric: MetricItem;
  variant?: "default" | "accent" | "ghost";
}

export function KpiCard({ metric, variant = "default" }: KpiCardProps) {
  const valueColor =
    variant === "accent"
      ? "hsl(var(--slide-secondary))"
      : variant === "ghost"
      ? "hsl(var(--slide-ink))"
      : "hsl(var(--slide-primary))";

  const bg =
    variant === "accent"
      ? "hsl(var(--slide-soft-2))"
      : variant === "ghost"
      ? "transparent"
      : "hsl(var(--slide-bg))";

  return (
    <div className="kpi-card" style={{ background: bg }}>
      <div className="kpi-label">{metric.label}</div>
      <div className="kpi-value" style={{ color: valueColor }}>
        {metric.value}
      </div>
      {metric.note ? <div className="kpi-note">{metric.note}</div> : null}
    </div>
  );
}
