import { Eye, EyeOff, GripVertical } from "lucide-react";
import { useDeckStore } from "@/deck/store";
import { ScaledSlide } from "./slide/ScaledSlide";
import { SlideRenderer } from "./slide/SlideRenderer";
import { cn } from "@/lib/utils";

export function SlideThumbnailRail() {
  const deck = useDeckStore((s) => s.deck);
  const selected = useDeckStore((s) => s.selectedSlideId);
  const setSelected = useDeckStore((s) => s.setSelectedSlide);
  const toggle = useDeckStore((s) => s.toggleSlideVisible);

  return (
    <div className="w-full bg-card border-t border-border">
      <div className="flex gap-3 overflow-x-auto p-4 no-scrollbar">
        {deck.slideOrder.map((id, i) => {
          const slide = deck.slides[id];
          if (!slide) return null;
          const active = id === selected;
          return (
            <div key={id} className={cn("group flex-shrink-0 cursor-pointer", active && "")}>
              <div
                onClick={() => setSelected(id)}
                className={cn(
                  "relative rounded-md overflow-hidden border-2 transition-all",
                  active ? "border-primary shadow-elegant" : "border-border hover:border-primary/40"
                )}
                style={{ width: 220, height: 124 }}
              >
                <div className="w-full h-full" style={{ opacity: slide.visible ? 1 : 0.35 }}>
                  <ScaledSlide padding={0}>
                    <SlideRenderer slide={slide} deck={deck} slideNumber={i + 1} totalSlides={deck.slideOrder.length} />
                  </ScaledSlide>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(id); }}
                  className="absolute top-1 right-1 bg-background/80 backdrop-blur rounded p-1 opacity-0 group-hover:opacity-100 transition"
                  title={slide.visible ? "Hide slide" : "Show slide"}
                >
                  {slide.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
                <div className="absolute top-1 left-1 bg-background/80 backdrop-blur rounded px-1.5 py-0.5 font-mono text-[10px] tracking-wider">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="mt-1.5 px-1 flex items-center gap-1">
                <GripVertical className="w-3 h-3 text-muted-foreground opacity-50" />
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground truncate" style={{ maxWidth: 200 }}>
                  {id}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
