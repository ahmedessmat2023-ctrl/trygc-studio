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
  ResponsiveContainer,
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

export function ChartBlock({ data, type = "bar", height = 360, showLegend = false }: ChartBlockProps) {
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

  if (type === "pie" || type === "donut") {
    const innerRadius = type === "donut" ? 80 : 0;
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={innerRadius} outerRadius={140} paddingAngle={2} stroke="hsl(var(--slide-bg))" strokeWidth={3}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--slide-border))", fontFamily: "var(--slide-font-mono)", fontSize: 13 }} />
          {showLegend && <Legend wrapperStyle={{ fontFamily: "var(--slide-font-mono)", fontSize: 13 }} />}
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--slide-border))" vertical={false} />
          <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--slide-border))", fontFamily: "var(--slide-font-mono)", fontSize: 13 }} />
          <Line type="monotone" dataKey="value" stroke="hsl(var(--slide-primary))" strokeWidth={3} dot={{ r: 5, fill: "hsl(var(--slide-primary))" }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // bar
  const valueKey = data[0] && "views" in data[0] ? "views" : "value";
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
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
    </ResponsiveContainer>
  );
}
