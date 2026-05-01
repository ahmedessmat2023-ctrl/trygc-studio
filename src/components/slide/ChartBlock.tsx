import { useLayoutEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartBlockProps {
  data: Array<Record<string, string | number>>;
  type?: "bar" | "line" | "pie" | "donut";
  height?: number;
  showLegend?: boolean;
}

const COLORS = [
  "hsl(var(--slide-primary))",
  "hsl(var(--slide-secondary))",
  "hsl(var(--slide-accent))",
  "hsl(var(--slide-lavender))",
  "hsl(var(--slide-soft-1))",
  "hsl(var(--slide-soft-2))",
];

const tickStyle = { fill: "hsl(var(--slide-muted))", fontSize: 14, fontFamily: "var(--slide-font-mono)" };

/**
 * Measures the parent width once (and on actual resize) and renders the chart
 * at fixed pixel dimensions. Avoids Recharts ResponsiveContainer infinite-loop
 * issues that occur when its parent uses CSS transform: scale().
 */
function useMeasuredWidth(fallback = 800) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(fallback);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w > 0 && w !== width) setWidth(w);
    const ro = new ResizeObserver((entries) => {
      const next = Math.round(entries[0].contentRect.width);
      // guard: only update on meaningful change to avoid loops with scaled parents
      setWidth((prev) => (Math.abs(prev - next) > 2 && next > 0 ? next : prev));
    });
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, width] as const;
}

export function ChartBlock({ data, type = "bar", height = 360, showLegend = false }: ChartBlockProps) {
  const [ref, width] = useMeasuredWidth();

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border"
        style={{
          height,
          borderColor: "hsl(var(--slide-border))",
          color: "hsl(var(--slide-muted))",
          fontFamily: "var(--slide-font-mono)",
          fontSize: 14,
        }}
      >
        No chart data
      </div>
    );
  }

  const renderChart = () => {
    if (type === "pie" || type === "donut") {
      const innerRadius = type === "donut" ? 80 : 0;
      return (
        <PieChart width={width} height={height}>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={innerRadius} outerRadius={140} paddingAngle={2} stroke="hsl(var(--slide-bg))" strokeWidth={3}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--slide-border))", fontFamily: "var(--slide-font-mono)", fontSize: 13 }} />
          {showLegend && <Legend wrapperStyle={{ fontFamily: "var(--slide-font-mono)", fontSize: 13 }} />}
        </PieChart>
      );
    }

    if (type === "line") {
      return (
        <LineChart width={width} height={height} data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--slide-border))" vertical={false} />
          <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--slide-border))", fontFamily: "var(--slide-font-mono)", fontSize: 13 }} />
          <Line type="monotone" dataKey="value" stroke="hsl(var(--slide-primary))" strokeWidth={3} dot={{ r: 5, fill: "hsl(var(--slide-primary))" }} />
        </LineChart>
      );
    }

    const valueKey = data[0] && "views" in data[0] ? "views" : "value";
    return (
      <BarChart width={width} height={height} data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
        <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--slide-border))" vertical={false} />
        <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: "hsl(var(--slide-soft-1))" }} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--slide-border))", fontFamily: "var(--slide-font-mono)", fontSize: 13 }} />
        <Bar dataKey={valueKey} radius={[10, 10, 0, 0]} maxBarSize={80}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    );
  };

  return (
    <div ref={ref} style={{ width: "100%", height, overflow: "hidden" }}>
      {width > 0 ? renderChart() : null}
    </div>
  );
}
