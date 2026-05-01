export type SlideLayout =
  | "poster"
  | "matrix"
  | "dashboard"
  | "spotlight"
  | "chartFull"
  | "map"
  | "ranking"
  | "mixed"
  | "finance"
  | "ems"
  | "closing";

export interface SlideContent {
  visible: boolean;
  layout: SlideLayout;
  kicker: string;
  title: string;
  lead: string;
  chart?: string;
  kpis?: string[];
}

export interface MetricItem {
  label: string;
  value: string;
  note: string;
}

export interface Recommendation {
  title: string;
  priority: string;
  desc: string;
  owner?: string;
  cadence?: string;
  nextStep?: string;
}

export interface DeckMeta {
  brand: string;
  client: string;
  date: string;
  market: string;
  footer: string;
}

export interface DeckData {
  theme: string;
  font: string;
  meta: DeckMeta;
  slideOrder: string[];
  slides: Record<string, SlideContent>;
  metrics: Record<string, MetricItem>;
  charts: Record<string, Array<Record<string, string | number>>>;
  recommendations: Recommendation[];
}

export interface Palette {
  id: string;
  name: string;
  bg: string;       // HSL triplet "h s% l%"
  ink: string;
  text: string;
  muted: string;
  primary: string;
  secondary: string;
  accent: string;
  lavender: string;
  soft1: string;
  soft2: string;
  border: string;
}

export interface FontPreset {
  id: string;
  name: string;
  display: string;
  body: string;
  mono: string;
}
