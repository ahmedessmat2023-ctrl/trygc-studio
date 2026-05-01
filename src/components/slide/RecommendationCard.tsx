import type { Recommendation } from "@/deck/types";

const priorityStyle = (p: string) => {
  const k = p.toLowerCase();
  if (k.includes("high")) return { bg: "hsl(var(--slide-soft-1))", color: "hsl(var(--slide-primary))" };
  if (k.includes("medium")) return { bg: "hsl(var(--slide-soft-2))", color: "hsl(var(--slide-secondary))" };
  return { bg: "hsl(var(--slide-soft-2))", color: "hsl(var(--slide-muted))" };
};

export function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const ps = priorityStyle(rec.priority);
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-3"
      style={{
        background: "hsl(var(--slide-bg))",
        border: "1px solid hsl(var(--slide-border))",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="slide-mono"
          style={{ fontSize: 12, color: "hsl(var(--slide-muted))", letterSpacing: "0.18em", textTransform: "uppercase" }}
        >
          R{String(index + 1).padStart(2, "0")}
        </div>
        <div
          className="slide-mono"
          style={{
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 999,
            background: ps.bg,
            color: ps.color,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {rec.priority}
        </div>
      </div>
      <div className="slide-display" style={{ fontSize: 26, fontWeight: 700, color: "hsl(var(--slide-ink))", lineHeight: 1.1 }}>
        {rec.title}
      </div>
      <div style={{ fontSize: 15, color: "hsl(var(--slide-text))", lineHeight: 1.5 }}>{rec.desc}</div>
      {(rec.owner || rec.cadence || rec.nextStep) && (
        <div className="grid grid-cols-3 gap-3 mt-1 pt-3" style={{ borderTop: "1px dashed hsl(var(--slide-border))" }}>
          {[
            ["Owner", rec.owner],
            ["Cadence", rec.cadence],
            ["Next step", rec.nextStep],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="slide-mono" style={{ fontSize: 10, color: "hsl(var(--slide-muted))", textTransform: "uppercase", letterSpacing: "0.16em" }}>{k}</div>
              <div style={{ fontSize: 13, color: "hsl(var(--slide-ink))", marginTop: 2 }}>{v || "—"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
