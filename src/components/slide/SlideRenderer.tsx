import type { DeckData, SlideContent } from "@/deck/types";
import { ChartBlock } from "./ChartBlock";
import { KpiCard } from "./KpiCard";
import { RecommendationCard } from "./RecommendationCard";

interface Props {
  slide: SlideContent;
  deck: DeckData;
  slideNumber: number;
  totalSlides: number;
}

const useKpis = (slide: SlideContent, deck: DeckData) =>
  (slide.kpis ?? []).map((id) => ({ id, ...deck.metrics[id] })).filter((m) => m.label);

function SlideHeader({ deck, slideNumber, totalSlides }: { deck: DeckData; slideNumber: number; totalSlides: number }) {
  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-16 pt-10 slide-mono"
      style={{ zIndex: 30, fontSize: 13, color: "hsl(var(--slide-muted))", letterSpacing: "0.18em", textTransform: "uppercase" }}>
      <div className="flex items-center gap-3">
        <span style={{ color: "hsl(var(--slide-primary))", fontWeight: 700 }}>{deck.meta.brand}</span>
        <span style={{ opacity: 0.4 }}>×</span>
        <span style={{ color: "hsl(var(--slide-secondary))", fontWeight: 700 }}>{deck.meta.client}</span>
      </div>
      <div className="flex items-center gap-6">
        <span>{deck.meta.market}</span>
        <span>{deck.meta.date}</span>
        <span style={{ color: "hsl(var(--slide-primary))", fontWeight: 700 }}>{String(slideNumber).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

function SlideFooter({ deck }: { deck: DeckData }) {
  return (
    <div className="absolute bottom-8 left-16 right-16 flex items-center justify-between slide-mono"
      style={{ zIndex: 30, fontSize: 12, color: "hsl(var(--slide-muted))", letterSpacing: "0.16em", textTransform: "uppercase" }}>
      <span>{deck.meta.footer}</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 24, height: 1, background: "hsl(var(--slide-border))" }} />
        TryGC Presentation Engine
      </span>
    </div>
  );
}

function SectionHeader({ slide }: { slide: SlideContent }) {
  return (
    <>
      <div className="kicker-pill mb-6">{slide.kicker}</div>
      <h1 className="slide-display" style={{ fontSize: 64, fontWeight: 800, color: "hsl(var(--slide-ink))", maxWidth: 1300, lineHeight: 1.04 }}>
        {slide.title}
      </h1>
      <p style={{ fontSize: 22, color: "hsl(var(--slide-text))", lineHeight: 1.5, marginTop: 18, maxWidth: 1300 }}>
        {slide.lead}
      </p>
    </>
  );
}

export function SlideRenderer({ slide, deck, slideNumber, totalSlides }: Props) {
  const kpis = useKpis(slide, deck);
  const chart = slide.chart ? deck.charts[slide.chart] : undefined;

  const Body = () => {
    switch (slide.layout) {
      case "poster":
        return (
          <div className="absolute inset-0 flex flex-col px-24 pt-32 pb-24" style={{ background: `linear-gradient(135deg, hsl(var(--slide-bg)) 0%, hsl(var(--slide-soft-1)) 100%)` }}>
            <div className="flex-1 flex flex-col justify-center">
              <div className="kicker-pill mb-8">{slide.kicker}</div>
              <h1 className="slide-display" style={{ fontSize: 110, fontWeight: 900, color: "hsl(var(--slide-ink))", lineHeight: 0.95, maxWidth: 1400, letterSpacing: "-0.02em" }}>
                {slide.title}
              </h1>
              <p style={{ fontSize: 24, color: "hsl(var(--slide-text))", lineHeight: 1.5, marginTop: 28, maxWidth: 1100 }}>
                {slide.lead}
              </p>
            </div>
            {kpis.length > 0 && (
              <div className="grid grid-cols-3 gap-6 mt-10">
                {kpis.slice(0, 3).map((k) => <KpiCard key={k.id} metric={k} variant={k === kpis[1] ? "accent" : "default"} />)}
              </div>
            )}
            {/* Editorial watermark */}
            <div className="absolute bottom-0 right-0 select-none pointer-events-none slide-display" style={{ fontSize: 360, fontWeight: 900, color: "hsl(var(--slide-soft-1))", lineHeight: 0.8, transform: "translate(8%, 30%)" }}>
              {deck.meta.client?.charAt(0) || "•"}
            </div>
          </div>
        );

      case "matrix":
        return (
          <div className="absolute inset-0 px-16 pt-28 pb-20 flex flex-col">
            <SectionHeader slide={slide} />
            <div className="grid grid-cols-12 gap-6 mt-10 flex-1">
              <div className="col-span-7 grid grid-cols-2 gap-5">
                {kpis.slice(0, 4).map((k, i) => <KpiCard key={k.id} metric={k} variant={i === 0 ? "default" : i === 1 ? "accent" : "default"} />)}
              </div>
              <div className="col-span-5 rounded-2xl p-6 flex flex-col" style={{ background: "hsl(var(--slide-soft-2))", border: "1px solid hsl(var(--slide-border))" }}>
                <div className="slide-mono" style={{ fontSize: 12, color: "hsl(var(--slide-muted))", letterSpacing: "0.16em", textTransform: "uppercase" }}>Trend</div>
                <div className="flex-1 mt-2">
                  {chart ? <ChartBlock data={chart} type="line" height={300} /> : <div className="flex items-center justify-center h-full" style={{ color: "hsl(var(--slide-muted))" }}>No chart</div>}
                </div>
              </div>
            </div>
          </div>
        );

      case "dashboard":
        return (
          <div className="absolute inset-0 px-16 pt-28 pb-20 flex flex-col">
            <SectionHeader slide={slide} />
            <div className="grid grid-cols-4 gap-5 mt-10">
              {kpis.slice(0, 4).map((k, i) => <KpiCard key={k.id} metric={k} variant={i === 0 ? "accent" : "default"} />)}
            </div>
            <div className="flex-1 mt-6 rounded-2xl p-6" style={{ background: "hsl(var(--slide-soft-1))", border: "1px solid hsl(var(--slide-border))" }}>
              {chart ? <ChartBlock data={chart} type="bar" height={260} /> : <div className="flex items-center justify-center h-full slide-mono" style={{ color: "hsl(var(--slide-muted))" }}>Add chart in editor</div>}
            </div>
          </div>
        );

      case "spotlight": {
        const hero = kpis[0];
        const supporting = kpis.slice(1);
        return (
          <div className="absolute inset-0 px-16 pt-28 pb-20 flex flex-col">
            <SectionHeader slide={slide} />
            <div className="grid grid-cols-12 gap-8 mt-10 flex-1 items-center">
              <div className="col-span-6 flex flex-col items-start justify-center rounded-3xl p-12" style={{ background: "hsl(var(--slide-soft-1))" }}>
                <div className="kicker-pill" style={{ background: "hsl(var(--slide-bg))" }}>{hero?.label || "Spotlight"}</div>
                <div className="slide-display mt-6" style={{ fontSize: 220, fontWeight: 900, color: "hsl(var(--slide-primary))", lineHeight: 0.9, letterSpacing: "-0.04em" }}>
                  {hero?.value || "—"}
                </div>
                <div style={{ fontSize: 18, color: "hsl(var(--slide-text))", marginTop: 12, maxWidth: 520 }}>{hero?.note}</div>
              </div>
              <div className="col-span-6 grid grid-cols-1 gap-5">
                {supporting.slice(0, 3).map((k) => <KpiCard key={k.id} metric={k} variant="default" />)}
              </div>
            </div>
          </div>
        );
      }

      case "chartFull":
        return (
          <div className="absolute inset-0 px-16 pt-28 pb-20 flex flex-col">
            <SectionHeader slide={slide} />
            <div className="grid grid-cols-12 gap-6 mt-8 flex-1">
              <div className="col-span-8 rounded-2xl p-6" style={{ background: "hsl(var(--slide-bg))", border: "1px solid hsl(var(--slide-border))", boxShadow: "var(--shadow-card)" }}>
                {chart ? <ChartBlock data={chart} type="bar" height={420} /> : <div className="flex items-center justify-center h-full" style={{ color: "hsl(var(--slide-muted))" }}>No chart</div>}
              </div>
              <div className="col-span-4 grid grid-cols-1 gap-4">
                {kpis.slice(0, 3).map((k, i) => <KpiCard key={k.id} metric={k} variant={i === 0 ? "accent" : "default"} />)}
              </div>
            </div>
          </div>
        );

      case "map":
        return (
          <div className="absolute inset-0 px-16 pt-28 pb-20 flex flex-col">
            <SectionHeader slide={slide} />
            <div className="grid grid-cols-12 gap-6 mt-10 flex-1">
              <div className="col-span-7 rounded-3xl relative overflow-hidden" style={{ background: "hsl(var(--slide-soft-2))", border: "1px solid hsl(var(--slide-border))" }}>
                {/* Stylized abstract coverage */}
                <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full">
                  <defs>
                    <radialGradient id="dot" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="hsl(var(--slide-primary))" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="hsl(var(--slide-primary))" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {/* abstract country shape */}
                  <path d="M120 150 L300 90 L520 110 L660 180 L700 320 L580 420 L380 440 L200 400 L130 290 Z"
                    fill="hsl(var(--slide-bg))" stroke="hsl(var(--slide-border))" strokeWidth="2" />
                  {[
                    [320, 220, 60], [440, 200, 50], [380, 290, 38], [240, 250, 30], [520, 320, 28], [580, 240, 22], [300, 360, 20]
                  ].map(([cx, cy, r], i) => (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r={r * 1.6} fill="url(#dot)" />
                      <circle cx={cx} cy={cy} r={6} fill="hsl(var(--slide-primary))" />
                    </g>
                  ))}
                </svg>
                <div className="absolute bottom-6 left-6 slide-mono" style={{ fontSize: 12, color: "hsl(var(--slide-muted))", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                  {deck.meta.market} Coverage
                </div>
              </div>
              <div className="col-span-5 grid grid-cols-2 gap-4 content-start">
                {kpis.slice(0, 4).map((k) => <KpiCard key={k.id} metric={k} variant="default" />)}
              </div>
            </div>
          </div>
        );

      case "ranking": {
        const rows = chart ?? [];
        const max = Math.max(1, ...rows.map((r) => Number(r.value) || 0));
        return (
          <div className="absolute inset-0 px-16 pt-28 pb-20 flex flex-col">
            <SectionHeader slide={slide} />
            <div className="grid grid-cols-12 gap-8 mt-10 flex-1">
              <div className="col-span-8 flex flex-col gap-4 justify-center">
                {rows.map((r, i) => {
                  const pct = (Number(r.value) || 0) / max;
                  return (
                    <div key={i} className="flex items-center gap-5">
                      <div className="slide-mono" style={{ width: 36, fontSize: 14, color: "hsl(var(--slide-muted))" }}>{String(i + 1).padStart(2, "0")}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div style={{ fontSize: 22, fontWeight: 700, color: "hsl(var(--slide-ink))" }}>{r.name}</div>
                          <div className="slide-display" style={{ fontSize: 28, fontWeight: 800, color: "hsl(var(--slide-primary))" }}>{r.value}</div>
                        </div>
                        <div style={{ height: 12, borderRadius: 999, background: "hsl(var(--slide-soft-2))", overflow: "hidden" }}>
                          <div style={{ width: `${pct * 100}%`, height: "100%", background: i === 0 ? "hsl(var(--slide-primary))" : i === 1 ? "hsl(var(--slide-secondary))" : "hsl(var(--slide-lavender))" }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="col-span-4 grid gap-4 content-start">
                {kpis.slice(0, 2).map((k) => <KpiCard key={k.id} metric={k} variant="default" />)}
              </div>
            </div>
          </div>
        );
      }

      case "mixed":
        return (
          <div className="absolute inset-0 px-16 pt-28 pb-20 flex flex-col">
            <SectionHeader slide={slide} />
            <div className="grid grid-cols-12 gap-8 mt-10 flex-1">
              <div className="col-span-7 rounded-3xl p-8 flex items-center justify-center" style={{ background: "hsl(var(--slide-soft-2))" }}>
                {chart ? <ChartBlock data={chart} type="donut" height={420} showLegend /> : null}
              </div>
              <div className="col-span-5 grid gap-4 content-start">
                {kpis.slice(0, 3).map((k, i) => <KpiCard key={k.id} metric={k} variant={i === 0 ? "accent" : "default"} />)}
              </div>
            </div>
          </div>
        );

      case "finance":
        return (
          <div className="absolute inset-0 px-16 pt-28 pb-20 flex flex-col">
            <SectionHeader slide={slide} />
            <div className="grid grid-cols-12 gap-6 mt-10 flex-1">
              <div className="col-span-7 rounded-2xl p-6" style={{ background: "hsl(var(--slide-soft-1))", border: "1px solid hsl(var(--slide-border))" }}>
                {chart ? <ChartBlock data={chart} type="line" height={380} /> : null}
              </div>
              <div className="col-span-5 grid gap-5 content-start">
                {kpis.slice(0, 2).map((k, i) => (
                  <div key={k.id} className="rounded-2xl p-8" style={{ background: i === 0 ? "hsl(var(--slide-secondary))" : "hsl(var(--slide-bg))", color: i === 0 ? "hsl(var(--slide-bg))" : "inherit", border: "1px solid hsl(var(--slide-border))", boxShadow: "var(--shadow-card)" }}>
                    <div className="slide-mono" style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", opacity: i === 0 ? 0.8 : 0.7, color: i === 0 ? "hsl(var(--slide-bg))" : "hsl(var(--slide-muted))" }}>{k.label}</div>
                    <div className="slide-display" style={{ fontSize: 72, fontWeight: 900, marginTop: 8, lineHeight: 1, color: i === 0 ? "hsl(var(--slide-bg))" : "hsl(var(--slide-primary))" }}>{k.value}</div>
                    <div style={{ fontSize: 15, marginTop: 12, lineHeight: 1.4, opacity: i === 0 ? 0.85 : 1, color: i === 0 ? "hsl(var(--slide-bg))" : "hsl(var(--slide-text))" }}>{k.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "ems":
        return (
          <div className="absolute inset-0 px-16 pt-28 pb-20 flex flex-col">
            <SectionHeader slide={slide} />
            <div className="grid grid-cols-3 gap-5 mt-10 flex-1 content-start overflow-hidden">
              {deck.recommendations.slice(0, 6).map((r, i) => (
                <RecommendationCard key={i} rec={r} index={i} />
              ))}
            </div>
          </div>
        );

      case "closing":
        return (
          <div className="absolute inset-0 px-24 pt-32 pb-24 flex flex-col" style={{ background: `linear-gradient(135deg, hsl(var(--slide-soft-2)) 0%, hsl(var(--slide-bg)) 100%)` }}>
            <div className="flex-1 flex flex-col justify-center">
              <div className="kicker-pill mb-8">{slide.kicker}</div>
              <h1 className="slide-display" style={{ fontSize: 96, fontWeight: 900, color: "hsl(var(--slide-ink))", lineHeight: 1.0, maxWidth: 1400, letterSpacing: "-0.02em" }}>
                {slide.title}
              </h1>
              <p style={{ fontSize: 24, color: "hsl(var(--slide-text))", lineHeight: 1.5, marginTop: 28, maxWidth: 1100 }}>
                {slide.lead}
              </p>
            </div>
            {kpis.length > 0 && (
              <div className="grid grid-cols-4 gap-5">
                {kpis.slice(0, 4).map((k) => (
                  <div key={k.id} className="rounded-2xl p-5" style={{ background: "hsl(var(--slide-bg))", border: "1px solid hsl(var(--slide-border))" }}>
                    <div className="slide-mono" style={{ fontSize: 11, color: "hsl(var(--slide-muted))", letterSpacing: "0.16em", textTransform: "uppercase" }}>{k.label}</div>
                    <div className="slide-display" style={{ fontSize: 42, fontWeight: 800, color: "hsl(var(--slide-primary))", lineHeight: 1, marginTop: 6 }}>{k.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="slide-root">
      <SlideHeader deck={deck} slideNumber={slideNumber} totalSlides={totalSlides} />
      <Body />
      <SlideFooter deck={deck} />
    </div>
  );
}
