import { useDeckStore } from "@/deck/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SlideLayout } from "@/deck/types";

const LAYOUTS: { id: SlideLayout; name: string }[] = [
  { id: "poster", name: "Poster (Cover)" },
  { id: "matrix", name: "Matrix (KPI + Trend)" },
  { id: "dashboard", name: "Dashboard (4 KPI + Chart)" },
  { id: "spotlight", name: "Spotlight (Hero metric)" },
  { id: "chartFull", name: "Chart Full" },
  { id: "map", name: "Map (Coverage)" },
  { id: "ranking", name: "Ranking (Bars)" },
  { id: "mixed", name: "Mixed (Donut + KPI)" },
  { id: "finance", name: "Finance (SAR cards)" },
  { id: "ems", name: "EMS Recommendations" },
  { id: "closing", name: "Closing" },
];

function SlideRow({ id, index }: { id: string; index: number }) {
  const slide = useDeckStore((s) => s.deck.slides[id]);
  const selected = useDeckStore((s) => s.selectedSlideId === id);
  const setSelected = useDeckStore((s) => s.setSelectedSlide);
  const moveSlide = useDeckStore((s) => s.moveSlide);
  const toggle = useDeckStore((s) => s.toggleSlideVisible);
  const dup = useDeckStore((s) => s.duplicateSlide);
  const del = useDeckStore((s) => s.deleteSlide);
  if (!slide) return null;
  return (
    <div
      className={cn(
        "group flex items-center gap-2 p-2 rounded-lg border",
        selected ? "border-primary bg-soft-orange/40" : "border-border bg-card hover:border-primary/40"
      )}
    >
      <button onClick={() => setSelected(id)} className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground w-6">{String(index + 1).padStart(2, "0")}</span>
          <div className="flex-1 min-w-0">
            <div className={cn("text-sm font-semibold truncate", !slide.visible && "opacity-50")}>{slide.title || id}</div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{slide.layout}</div>
          </div>
        </div>
      </button>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveSlide(id, -1)} title="Move up"><ArrowUp className="w-3.5 h-3.5" /></Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveSlide(id, 1)} title="Move down"><ArrowDown className="w-3.5 h-3.5" /></Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toggle(id)} title="Toggle visibility">
          {slide.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => dup(id)} title="Duplicate"><Copy className="w-3.5 h-3.5" /></Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => del(id)} title="Delete"><Trash2 className="w-3.5 h-3.5" /></Button>
      </div>
    </div>
  );
}

export function SlidesTab() {
  const order = useDeckStore((s) => s.deck.slideOrder);
  const addSlide = useDeckStore((s) => s.addSlide);
  const selectedId = useDeckStore((s) => s.selectedSlideId);
  const layout = useDeckStore((s) => s.deck.slides[s.selectedSlideId]?.layout);
  const setSlideField = useDeckStore((s) => s.setSlideField);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Layout for selected slide</Label>
        <Select value={layout} onValueChange={(v) => setSlideField(selectedId, "layout", v as SlideLayout)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {LAYOUTS.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Slides</Label>
          <Select onValueChange={(v) => addSlide(v as SlideLayout)}>
            <SelectTrigger className="h-8 w-auto gap-1"><Plus className="w-3.5 h-3.5" /><span className="text-xs">Add slide</span></SelectTrigger>
            <SelectContent>
              {LAYOUTS.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
          {order.map((id, i) => <SlideRow key={id} id={id} index={i} />)}
        </div>
      </div>
    </div>
  );
}
