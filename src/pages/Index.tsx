import { useEffect } from "react";
import { useDeckStore } from "@/deck/store";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SlideCanvas } from "@/components/SlideCanvas";
import { SlideThumbnailRail } from "@/components/SlideThumbnailRail";
import { EditorPanel } from "@/components/EditorPanel";
import { ScaledSlide } from "@/components/slide/ScaledSlide";
import { SlideRenderer } from "@/components/slide/SlideRenderer";
import { Sparkles } from "lucide-react";

function PrintDeck() {
  const deck = useDeckStore((s) => s.deck);
  const visible = deck.slideOrder.filter((id) => deck.slides[id]?.visible);
  return (
    <div className="print-deck hidden print:block">
      {visible.map((id, i) => (
        <div className="print-page" key={id}>
          <ScaledSlide padding={0}>
            <SlideRenderer slide={deck.slides[id]} deck={deck} slideNumber={i + 1} totalSlides={visible.length} />
          </ScaledSlide>
        </div>
      ))}
    </div>
  );
}

const Index = () => {
  const setSelected = useDeckStore((s) => s.setSelectedSlide);
  const order = useDeckStore((s) => s.deck.slideOrder);
  const selected = useDeckStore((s) => s.selectedSlideId);
  const client = useDeckStore((s) => s.deck.meta.client);
  const brand = useDeckStore((s) => s.deck.meta.brand);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const idx = order.indexOf(selected);
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        setSelected(order[Math.min(order.length - 1, idx + 1)]);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setSelected(order[Math.max(0, idx - 1)]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [order, selected, setSelected]);

  const idx = order.indexOf(selected);

  return (
    <ThemeProvider>
      <div className="h-screen w-screen flex flex-col bg-background overflow-hidden print:hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-5 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display text-lg font-bold leading-none tracking-tight">
                TryGC <span className="text-primary">Presentation Generator</span>
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5">
                {brand} × {client}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Slide {String(idx + 1).padStart(2, "0")} / {String(order.length).padStart(2, "0")}
            </div>
          </div>
        </header>

        {/* Main split */}
        <div className="flex-1 grid min-h-0" style={{ gridTemplateColumns: "1fr 420px" }}>
          <div className="flex flex-col min-h-0">
            <div className="flex-1 min-h-0 bg-gradient-to-br from-background to-soft-orange/40">
              <SlideCanvas />
            </div>
            <SlideThumbnailRail />
          </div>
          <EditorPanel />
        </div>
      </div>
      <PrintDeck />
    </ThemeProvider>
  );
};

export default Index;
