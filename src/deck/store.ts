import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DeckData, MetricItem, Recommendation, SlideContent, SlideLayout } from "./types";
import { SAMPLE_DECK } from "./sampleDeck";

interface DeckState {
  deck: DeckData;
  selectedSlideId: string;
  setSelectedSlide: (id: string) => void;

  // Field-level setters (stable refs via getState pattern not needed; selectors prevent re-renders)
  setMeta: <K extends keyof DeckData["meta"]>(key: K, value: DeckData["meta"][K]) => void;
  setTheme: (id: string) => void;
  setFont: (id: string) => void;

  setSlideField: <K extends keyof SlideContent>(slideId: string, key: K, value: SlideContent[K]) => void;
  toggleSlideVisible: (slideId: string) => void;
  reorderSlides: (order: string[]) => void;
  addSlide: (layout: SlideLayout) => void;
  duplicateSlide: (slideId: string) => void;
  deleteSlide: (slideId: string) => void;
  moveSlide: (slideId: string, direction: -1 | 1) => void;

  setMetric: <K extends keyof MetricItem>(metricId: string, key: K, value: MetricItem[K]) => void;
  addMetric: () => string;
  deleteMetric: (metricId: string) => void;
  toggleSlideKpi: (slideId: string, metricId: string) => void;

  setChartCell: (chartId: string, rowIdx: number, key: string, value: string | number) => void;
  addChartRow: (chartId: string) => void;
  deleteChartRow: (chartId: string, rowIdx: number) => void;

  setRecommendation: <K extends keyof Recommendation>(idx: number, key: K, value: Recommendation[K]) => void;
  addRecommendation: () => void;
  deleteRecommendation: (idx: number) => void;

  importDeck: (data: DeckData) => void;
  resetDeck: () => void;
  newDeck: (init: { client: string; market: string; brand: string; theme: string; font: string }) => void;
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `slide-${Date.now()}`;

const uniqueId = (existing: string[], base: string) => {
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
};

export const useDeckStore = create<DeckState>()(
  persist(
    (set, get) => ({
      deck: SAMPLE_DECK,
      selectedSlideId: SAMPLE_DECK.slideOrder[0],
      setSelectedSlide: (id) => set({ selectedSlideId: id }),

      setMeta: (key, value) =>
        set((s) => ({ deck: { ...s.deck, meta: { ...s.deck.meta, [key]: value } } })),
      setTheme: (id) => set((s) => ({ deck: { ...s.deck, theme: id } })),
      setFont: (id) => set((s) => ({ deck: { ...s.deck, font: id } })),

      setSlideField: (slideId, key, value) =>
        set((s) => ({
          deck: {
            ...s.deck,
            slides: {
              ...s.deck.slides,
              [slideId]: { ...s.deck.slides[slideId], [key]: value },
            },
          },
        })),
      toggleSlideVisible: (slideId) =>
        set((s) => ({
          deck: {
            ...s.deck,
            slides: {
              ...s.deck.slides,
              [slideId]: { ...s.deck.slides[slideId], visible: !s.deck.slides[slideId].visible },
            },
          },
        })),
      reorderSlides: (order) => set((s) => ({ deck: { ...s.deck, slideOrder: order } })),
      addSlide: (layout) =>
        set((s) => {
          const id = uniqueId(s.deck.slideOrder, `slide-${layout}`);
          const newSlide: SlideContent = {
            visible: true,
            layout,
            kicker: "New Section",
            title: "New slide title",
            lead: "Add a one-line description for the audience.",
            kpis: [],
          };
          return {
            deck: {
              ...s.deck,
              slideOrder: [...s.deck.slideOrder, id],
              slides: { ...s.deck.slides, [id]: newSlide },
            },
            selectedSlideId: id,
          };
        }),
      duplicateSlide: (slideId) =>
        set((s) => {
          const src = s.deck.slides[slideId];
          if (!src) return s;
          const id = uniqueId(s.deck.slideOrder, `${slideId}-copy`);
          const idx = s.deck.slideOrder.indexOf(slideId);
          const order = [...s.deck.slideOrder];
          order.splice(idx + 1, 0, id);
          return {
            deck: {
              ...s.deck,
              slideOrder: order,
              slides: { ...s.deck.slides, [id]: { ...src, kpis: [...(src.kpis ?? [])] } },
            },
            selectedSlideId: id,
          };
        }),
      deleteSlide: (slideId) =>
        set((s) => {
          if (s.deck.slideOrder.length <= 1) return s;
          const order = s.deck.slideOrder.filter((id) => id !== slideId);
          const slides = { ...s.deck.slides };
          delete slides[slideId];
          return {
            deck: { ...s.deck, slideOrder: order, slides },
            selectedSlideId: order[0],
          };
        }),
      moveSlide: (slideId, direction) =>
        set((s) => {
          const order = [...s.deck.slideOrder];
          const idx = order.indexOf(slideId);
          const target = idx + direction;
          if (idx < 0 || target < 0 || target >= order.length) return s;
          [order[idx], order[target]] = [order[target], order[idx]];
          return { deck: { ...s.deck, slideOrder: order } };
        }),

      setMetric: (metricId, key, value) =>
        set((s) => ({
          deck: {
            ...s.deck,
            metrics: {
              ...s.deck.metrics,
              [metricId]: { ...s.deck.metrics[metricId], [key]: value },
            },
          },
        })),
      addMetric: () => {
        const id = `metric-${Date.now()}`;
        set((s) => ({
          deck: {
            ...s.deck,
            metrics: { ...s.deck.metrics, [id]: { label: "New KPI", value: "0", note: "Description" } },
          },
        }));
        return id;
      },
      deleteMetric: (metricId) =>
        set((s) => {
          const metrics = { ...s.deck.metrics };
          delete metrics[metricId];
          const slides = Object.fromEntries(
            Object.entries(s.deck.slides).map(([id, slide]) => [
              id,
              { ...slide, kpis: (slide.kpis ?? []).filter((m) => m !== metricId) },
            ])
          );
          return { deck: { ...s.deck, metrics, slides } };
        }),
      toggleSlideKpi: (slideId, metricId) =>
        set((s) => {
          const current = s.deck.slides[slideId].kpis ?? [];
          const next = current.includes(metricId)
            ? current.filter((m) => m !== metricId)
            : [...current, metricId];
          return {
            deck: {
              ...s.deck,
              slides: { ...s.deck.slides, [slideId]: { ...s.deck.slides[slideId], kpis: next } },
            },
          };
        }),

      setChartCell: (chartId, rowIdx, key, value) =>
        set((s) => {
          const rows = [...(s.deck.charts[chartId] ?? [])];
          rows[rowIdx] = { ...rows[rowIdx], [key]: value };
          return { deck: { ...s.deck, charts: { ...s.deck.charts, [chartId]: rows } } };
        }),
      addChartRow: (chartId) =>
        set((s) => {
          const rows = [...(s.deck.charts[chartId] ?? [])];
          const template = rows[0] ? Object.fromEntries(Object.keys(rows[0]).map((k) => [k, k === "name" ? "New row" : 0])) : { name: "New row", value: 0 };
          rows.push(template);
          return { deck: { ...s.deck, charts: { ...s.deck.charts, [chartId]: rows } } };
        }),
      deleteChartRow: (chartId, rowIdx) =>
        set((s) => {
          const rows = (s.deck.charts[chartId] ?? []).filter((_, i) => i !== rowIdx);
          return { deck: { ...s.deck, charts: { ...s.deck.charts, [chartId]: rows } } };
        }),

      setRecommendation: (idx, key, value) =>
        set((s) => {
          const recs = [...s.deck.recommendations];
          recs[idx] = { ...recs[idx], [key]: value };
          return { deck: { ...s.deck, recommendations: recs } };
        }),
      addRecommendation: () =>
        set((s) => ({
          deck: {
            ...s.deck,
            recommendations: [
              ...s.deck.recommendations,
              { title: "New recommendation", priority: "Medium", desc: "Describe the action.", owner: "", cadence: "", nextStep: "" },
            ],
          },
        })),
      deleteRecommendation: (idx) =>
        set((s) => ({
          deck: { ...s.deck, recommendations: s.deck.recommendations.filter((_, i) => i !== idx) },
        })),

      importDeck: (data) =>
        set({ deck: data, selectedSlideId: data.slideOrder[0] }),
      resetDeck: () => set({ deck: SAMPLE_DECK, selectedSlideId: SAMPLE_DECK.slideOrder[0] }),
      newDeck: ({ client, market, brand, theme, font }) => {
        const blank: DeckData = {
          theme,
          font,
          meta: { brand, client, date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), market, footer: `${brand} · ${client}` },
          slideOrder: ["cover", "summary", "closing"],
          slides: {
            cover: { visible: true, layout: "poster", kicker: `${client} Partnership`, title: `Premium presentation for ${client}`, lead: `An executive view of strategy, performance, and next moves in ${market}.`, kpis: [] },
            summary: { visible: true, layout: "matrix", kicker: "Executive Summary", title: "Headline performance & opportunity", lead: "Top metrics, key insights, and the strongest opportunities ahead.", kpis: [] },
            closing: { visible: true, layout: "closing", kicker: "Thank You", title: `${brand} × ${client}`, lead: "We look forward to the next phase together.", kpis: [] },
          },
          metrics: {},
          charts: { monthly: [{ name: "M1", value: 10 }, { name: "M2", value: 14 }, { name: "M3", value: 18 }] },
          recommendations: [],
        };
        // touch slugify to silence unused
        void slugify;
        set({ deck: blank, selectedSlideId: "cover" });
      },
    }),
    {
      name: "trygc-deck-v1",
      partialize: (state) => ({ deck: state.deck, selectedSlideId: state.selectedSlideId }),
    }
  )
);
