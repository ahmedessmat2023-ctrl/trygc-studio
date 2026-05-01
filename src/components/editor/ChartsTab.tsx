import { useDeckStore } from "@/deck/store";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { StableInput } from "./StableInput";

function ChartTable({ chartId }: { chartId: string }) {
  const rows = useDeckStore((s) => s.deck.charts[chartId] ?? []);
  const setCell = useDeckStore((s) => s.setChartCell);
  const addRow = useDeckStore((s) => s.addChartRow);
  const delRow = useDeckStore((s) => s.deleteChartRow);
  const cols = rows[0] ? Object.keys(rows[0]) : ["name", "value"];

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="font-mono text-[11px] uppercase tracking-wider text-primary">{chartId}</div>
        <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={() => addRow(chartId)}>
          <Plus className="w-3.5 h-3.5" /> Row
        </Button>
      </div>
      <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
        <div className="grid gap-1 px-1" style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr)) 28px` }}>
          {cols.map((c) => <div key={c} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{c}</div>)}
          <div />
        </div>
        {rows.map((row, ri) => (
          <div key={ri} className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr)) 28px` }}>
            {cols.map((c) => (
              <StableInput
                key={c}
                value={String(row[c] ?? "")}
                onCommit={(v) => {
                  const num = c !== "name" && v !== "" && !isNaN(Number(v)) ? Number(v) : v;
                  setCell(chartId, ri, c, num);
                }}
                className="h-8 text-xs"
              />
            ))}
            <Button size="icon" variant="ghost" className="h-8 w-7 text-destructive" onClick={() => delRow(chartId, ri)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartsTab() {
  const ids = useDeckStore((s) => Object.keys(s.deck.charts));
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Edit chart datasets. Numeric cells are auto-converted.</p>
      <div className="space-y-3">
        {ids.map((id) => <ChartTable key={id} chartId={id} />)}
      </div>
    </div>
  );
}
