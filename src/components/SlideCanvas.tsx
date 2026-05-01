import { useDeckStore } from "@/deck/store";
import { ScaledSlide } from "./slide/ScaledSlide";
import { SlideRenderer } from "./slide/SlideRenderer";

export function SlideCanvas() {
  const deck = useDeckStore((s) => s.deck);
  const selected = useDeckStore((s) => s.selectedSlideId);
  const slide = deck.slides[selected];
  const idx = deck.slideOrder.indexOf(selected);

  if (!slide) return null;

  return (
    <div className="w-full h-full p-6">
      <ScaledSlide>
        <SlideRenderer slide={slide} deck={deck} slideNumber={idx + 1} totalSlides={deck.slideOrder.length} />
      </ScaledSlide>
    </div>
  );
}
