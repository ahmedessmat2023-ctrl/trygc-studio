import { useDeckStore } from "@/deck/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { StableInput } from "./StableInput";

function KpiRow({ id }: { id: string }) {
  const m = useDeckStore((s) => s.deck.metrics[id]);
  const setMetric = useDeckStore((s) => s.setMetric);
  const del = useDeckStore((s) => s.deleteMetric);
  if (!m) return null;
  return (
    <div className="p-3 rounded-lg border border-border bg-card space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{id}</span>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del(id)}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-7">
          <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Label</Label>
          <StableInput value={m.label} onCommit={(v) => setMetric(id, "label", v)} />
        </div>
        <div className="col-span-5">
          <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Value</Label>
          <StableInput value={m.value} onCommit={(v) => setMetric(id, "value", v)} />
        </div>
        <div className="col-span-12">
          <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Note</Label>
          <StableInput value={m.note} onCommit={(v) => setMetric(id, "note", v)} />
        </div>
      </div>
    </div>
  );
}

export function KpiTab() {
  const ids = useDeckStore((s) => Object.keys(s.deck.metrics));
  const addMetric = useDeckStore((s) => s.addMetric);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{ids.length} KPI{ids.length === 1 ? "" : "s"} in library</p>
        <Button size="sm" variant="outline" onClick={() => addMetric()} className="gap-1"><Plus className="w-3.5 h-3.5" />Add KPI</Button>
      </div>
      <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
        {ids.map((id) => <KpiRow key={id} id={id} />)}
      </div>
    </div>
  );
}
