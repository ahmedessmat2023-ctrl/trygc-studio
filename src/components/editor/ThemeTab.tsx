import { useDeckStore } from "@/deck/store";
import { FONT_PRESETS, PALETTES } from "@/deck/themes";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ThemeTab() {
  const themeId = useDeckStore((s) => s.deck.theme);
  const setTheme = useDeckStore((s) => s.setTheme);
  return (
    <div className="space-y-3">
      <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Color palette</Label>
      <div className="grid grid-cols-1 gap-2">
        {PALETTES.map((p) => {
          const active = p.id === themeId;
          return (
            <button
              key={p.id}
              onClick={() => setTheme(p.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                active ? "border-primary bg-soft-orange/40" : "border-border hover:border-primary/40 bg-card"
              )}
            >
              <div className="flex gap-1">
                {[p.primary, p.secondary, p.accent, p.lavender].map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-md border border-border" style={{ background: `hsl(${c})` }} />
                ))}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{p.id}</div>
              </div>
              {active && <Check className="w-4 h-4 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TypographyTab() {
  const fontId = useDeckStore((s) => s.deck.font);
  const setFont = useDeckStore((s) => s.setFont);
  return (
    <div className="space-y-3">
      <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Font preset</Label>
      <div className="grid grid-cols-1 gap-2">
        {FONT_PRESETS.map((f) => {
          const active = f.id === fontId;
          return (
            <button
              key={f.id}
              onClick={() => setFont(f.id)}
              className={cn(
                "flex flex-col gap-1 p-3 rounded-lg border text-left transition-all",
                active ? "border-primary bg-soft-orange/40" : "border-border hover:border-primary/40 bg-card"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{f.name}</div>
                {active && <Check className="w-4 h-4 text-primary" />}
              </div>
              <div style={{ fontFamily: f.display, fontSize: 22, lineHeight: 1, fontWeight: 700 }}>The Quick Brown Fox</div>
              <div style={{ fontFamily: f.body, fontSize: 12, color: "hsl(var(--muted-foreground))" }}>Display · {f.display.split(",")[0].replace(/"/g, "")}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
