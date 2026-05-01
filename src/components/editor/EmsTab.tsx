import { useDeckStore } from "@/deck/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { StableInput, StableTextarea } from "./StableInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PRIORITIES = ["High", "Medium", "Low", "Ongoing"];

function RecRow({ idx }: { idx: number }) {
  const rec = useDeckStore((s) => s.deck.recommendations[idx]);
  const setRec = useDeckStore((s) => s.setRecommendation);
  const del = useDeckStore((s) => s.deleteRecommendation);
  if (!rec) return null;
  return (
    <div className="p-3 rounded-lg border border-border bg-card space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">R{String(idx + 1).padStart(2, "0")}</span>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del(idx)}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div>
        <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Title</Label>
        <StableInput value={rec.title} onCommit={(v) => setRec(idx, "title", v)} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Priority</Label>
          <Select value={rec.priority} onValueChange={(v) => setRec(idx, "priority", v)}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Owner</Label>
          <StableInput value={rec.owner ?? ""} onCommit={(v) => setRec(idx, "owner", v)} />
        </div>
        <div>
          <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Cadence</Label>
          <StableInput value={rec.cadence ?? ""} onCommit={(v) => setRec(idx, "cadence", v)} />
        </div>
      </div>
      <div>
        <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Description</Label>
        <StableTextarea value={rec.desc} onCommit={(v) => setRec(idx, "desc", v)} rows={2} />
      </div>
      <div>
        <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Next step</Label>
        <StableInput value={rec.nextStep ?? ""} onCommit={(v) => setRec(idx, "nextStep", v)} />
      </div>
    </div>
  );
}

export function EmsTab() {
  const recs = useDeckStore((s) => s.deck.recommendations);
  const addRec = useDeckStore((s) => s.addRecommendation);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{recs.length} recommendation{recs.length === 1 ? "" : "s"}</p>
        <Button size="sm" variant="outline" onClick={() => addRec()} className="gap-1"><Plus className="w-3.5 h-3.5" />Add</Button>
      </div>
      <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
        {recs.map((_, i) => <RecRow key={i} idx={i} />)}
      </div>
    </div>
  );
}
