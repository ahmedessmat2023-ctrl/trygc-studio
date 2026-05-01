import { useDeckStore } from "@/deck/store";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface Issue {
  level: "warn" | "error" | "info";
  title: string;
  detail: string;
}

export function QualityTab() {
  const deck = useDeckStore((s) => s.deck);

  const issues: Issue[] = [];

  // Blank slides
  for (const id of deck.slideOrder) {
    const slide = deck.slides[id];
    if (!slide) continue;
    if (!slide.title.trim()) issues.push({ level: "error", title: `Blank title: ${id}`, detail: "Slides must have a title before export." });
    const hasContent = (slide.kpis ?? []).length > 0 || slide.chart || slide.layout === "ems" || slide.layout === "closing" || slide.layout === "poster";
    if (!hasContent) issues.push({ level: "warn", title: `Text-only slide: ${id}`, detail: "Add a KPI, chart, or visual to avoid pure-text slides." });
    if ((slide.kpis ?? []).length > 6) issues.push({ level: "warn", title: `Too many KPIs on ${id}`, detail: `${(slide.kpis ?? []).length} KPIs may overflow the layout.` });
  }

  // Duplicate KPI values across all metrics
  const seenValues = new Map<string, string[]>();
  Object.entries(deck.metrics).forEach(([id, m]) => {
    const k = m.value.trim();
    if (!k) return;
    const arr = seenValues.get(k) ?? [];
    arr.push(`${id} (${m.label})`);
    seenValues.set(k, arr);
  });
  seenValues.forEach((arr, value) => {
    if (arr.length > 1) issues.push({ level: "warn", title: `Duplicate KPI value: ${value}`, detail: arr.join(" · ") });
  });

  // Missing chart
  for (const id of deck.slideOrder) {
    const slide = deck.slides[id];
    if (slide?.chart && !deck.charts[slide.chart]) issues.push({ level: "error", title: `Missing chart on ${id}`, detail: `Chart "${slide.chart}" not found.` });
  }

  if (issues.length === 0) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-soft-orange/40">
        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <div className="text-sm font-semibold">Deck looks clean.</div>
          <div className="text-xs text-muted-foreground mt-1">No duplicate KPIs, no blank slides, no missing charts.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{issues.length} issue{issues.length === 1 ? "" : "s"} found.</p>
      <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
        {issues.map((i, idx) => {
          const Icon = i.level === "error" ? AlertTriangle : i.level === "warn" ? AlertTriangle : Info;
          const tone =
            i.level === "error"
              ? "border-destructive/40 bg-destructive/5 text-destructive"
              : i.level === "warn"
              ? "border-primary/30 bg-soft-orange/40 text-foreground"
              : "border-border bg-card";
          return (
            <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${tone}`}>
              <Icon className={`w-4 h-4 mt-0.5 ${i.level === "error" ? "text-destructive" : "text-primary"}`} />
              <div>
                <div className="text-sm font-semibold">{i.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{i.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
