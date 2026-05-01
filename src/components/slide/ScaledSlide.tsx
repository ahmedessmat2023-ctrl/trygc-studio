import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Wraps a 1600x900 slide in a scale-to-fit container.
 * The slide stays at native resolution; we use transform scale to fit.
 */
export function ScaledSlide({ children, padding = 16 }: { children: ReactNode; padding?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth - padding * 2;
      const h = el.clientHeight - padding * 2;
      const s = Math.min(w / 1600, h / 900);
      setScale(Math.max(0.05, s));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [padding]);

  return (
    <div ref={wrapRef} className="relative w-full h-full overflow-hidden flex items-center justify-center">
      <div
        style={{
          width: 1600,
          height: 900,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
          boxShadow: "var(--shadow-elegant)",
          borderRadius: 8,
          overflow: "hidden",
          background: "hsl(var(--slide-bg))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
