import { useEffect } from "react";
import { useDeckStore } from "@/deck/store";
import { getFontPreset, getPalette } from "@/deck/themes";

/** Applies theme + font CSS variables globally so slides + thumbnails update together. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeId = useDeckStore((s) => s.deck.theme);
  const fontId = useDeckStore((s) => s.deck.font);

  useEffect(() => {
    const p = getPalette(themeId);
    const f = getFontPreset(fontId);
    const root = document.documentElement;
    root.style.setProperty("--slide-bg", p.bg);
    root.style.setProperty("--slide-ink", p.ink);
    root.style.setProperty("--slide-text", p.text);
    root.style.setProperty("--slide-muted", p.muted);
    root.style.setProperty("--slide-primary", p.primary);
    root.style.setProperty("--slide-secondary", p.secondary);
    root.style.setProperty("--slide-accent", p.accent);
    root.style.setProperty("--slide-lavender", p.lavender);
    root.style.setProperty("--slide-soft-1", p.soft1);
    root.style.setProperty("--slide-soft-2", p.soft2);
    root.style.setProperty("--slide-border", p.border);
    root.style.setProperty("--slide-font-display", f.display);
    root.style.setProperty("--slide-font-body", f.body);
    root.style.setProperty("--slide-font-mono", f.mono);
  }, [themeId, fontId]);

  return <>{children}</>;
}
