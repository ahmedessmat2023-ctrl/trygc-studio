import { useRef } from "react";
import type { ChangeEvent } from "react";
import { useDeckStore } from "@/deck/store";
import { Button } from "@/components/ui/button";
import { Download, FileJson, Printer, RotateCcw, Upload } from "lucide-react";
import { toast } from "sonner";
import type { DeckData } from "@/deck/types";

export function ExportTab() {
  const deck = useDeckStore((s) => s.deck);
  const importDeck = useDeckStore((s) => s.importDeck);
  const reset = useDeckStore((s) => s.resetDeck);
  const fileRef = useRef<HTMLInputElement>(null);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(deck, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deck.meta.client.toLowerCase().replace(/\s+/g, "-")}-deck.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Deck JSON exported");
  };

  const exportHTML = () => {
    // Standalone export = re-open the page with the embedded deck and trigger print
    // Lightweight version: serialize current data + a minimal renderer note.
    const dataScript = `<script id="deck-data" type="application/json">${JSON.stringify(deck)}</script>`;
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${deck.meta.client} — ${deck.meta.brand}</title>
<style>body{font-family:system-ui,sans-serif;padding:40px;max-width:900px;margin:auto;color:#1A1220} h1{color:#E8630C}</style>
</head><body>
<h1>${deck.meta.client} × ${deck.meta.brand}</h1>
<p>${deck.meta.date} · ${deck.meta.market}</p>
<p>This is a portable export of the deck data. Re-import the JSON below into the TryGC Presentation Generator to render the full visual deck.</p>
<pre style="background:#FDF2E9;padding:16px;border-radius:8px;overflow:auto;font-size:12px">${JSON.stringify(deck, null, 2).replace(/</g, "&lt;")}</pre>
${dataScript}
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deck.meta.client.toLowerCase().replace(/\s+/g, "-")}-deck.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Standalone HTML exported");
  };

  const importJSON = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as DeckData;
        if (!data.slideOrder || !data.slides) throw new Error("Invalid deck structure");
        importDeck(data);
        toast.success("Deck imported");
      } catch (err) {
        toast.error("Invalid JSON: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Save, export, import, or print the deck. Auto-saves locally.</p>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={exportJSON} variant="default" className="gap-2"><FileJson className="w-4 h-4" />Export JSON</Button>
        <Button onClick={exportHTML} variant="outline" className="gap-2"><Download className="w-4 h-4" />Export HTML</Button>
        <Button onClick={() => fileRef.current?.click()} variant="outline" className="gap-2"><Upload className="w-4 h-4" />Import JSON</Button>
        <Button onClick={() => window.print()} variant="outline" className="gap-2"><Printer className="w-4 h-4" />Print / PDF</Button>
      </div>
      <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importJSON} />
      <div className="border-t border-border pt-3">
        <Button onClick={() => { if (confirm("Reset to the Starbucks sample deck?")) reset(); }} variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
          <RotateCcw className="w-4 h-4" />Reset to sample
        </Button>
      </div>
    </div>
  );
}
