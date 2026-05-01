import { useDeckStore } from "@/deck/store";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StableInput, StableTextarea } from "./StableInput";

function CopyField({ slideId, field, label, multi }: { slideId: string; field: "kicker" | "title" | "lead"; label: string; multi?: boolean }) {
  const value = useDeckStore((s) => s.deck.slides[slideId]?.[field] ?? "");
  const setSlideField = useDeckStore((s) => s.setSlideField);
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</Label>
      {multi ? (
        <StableTextarea value={value} onCommit={(v) => setSlideField(slideId, field, v)} rows={3} />
      ) : (
        <StableInput value={value} onCommit={(v) => setSlideField(slideId, field, v)} />
      )}
    </div>
  );
}

function ChartPicker({ slideId }: { slideId: string }) {
  const chart = useDeckStore((s) => s.deck.slides[slideId]?.chart ?? "");
  const charts = useDeckStore((s) => Object.keys(s.deck.charts));
  const setSlideField = useDeckStore((s) => s.setSlideField);
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Chart</Label>
      <Select value={chart || "__none"} onValueChange={(v) => setSlideField(slideId, "chart", v === "__none" ? undefined : v)}>
        <SelectTrigger><SelectValue placeholder="Select chart" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__none">None</SelectItem>
          {charts.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function KpiPicker({ slideId }: { slideId: string }) {
  const selectedKpis = useDeckStore((s) => s.deck.slides[slideId]?.kpis ?? []);
  const metrics = useDeckStore((s) => s.deck.metrics);
  const toggle = useDeckStore((s) => s.toggleSlideKpi);
  const ids = Object.keys(metrics);
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">KPIs on slide ({selectedKpis.length})</Label>
      <div className="grid grid-cols-1 gap-1 max-h-72 overflow-y-auto p-1 border border-border rounded-lg bg-muted/30">
        {ids.map((id) => {
          const on = selectedKpis.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggle(slideId, id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs ${on ? "bg-primary/10 text-foreground" : "hover:bg-card"}`}
            >
              <span className={`w-3 h-3 rounded border ${on ? "bg-primary border-primary" : "border-border"}`} />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground w-32 truncate">{id}</span>
              <span className="flex-1 truncate">{metrics[id].label}</span>
              <span className="font-mono text-[10px] text-primary">{metrics[id].value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CopyTab() {
  const slideId = useDeckStore((s) => s.selectedSlideId);
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase tracking-wider text-primary">Editing: {slideId}</div>
      <CopyField slideId={slideId} field="kicker" label="Kicker" />
      <CopyField slideId={slideId} field="title" label="Title" multi />
      <CopyField slideId={slideId} field="lead" label="Lead paragraph" multi />
      <ChartPicker slideId={slideId} />
      <KpiPicker slideId={slideId} />
    </div>
  );
}
