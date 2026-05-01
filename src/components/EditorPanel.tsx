import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandTab } from "./editor/BrandTab";
import { ChartsTab } from "./editor/ChartsTab";
import { CopyTab } from "./editor/CopyTab";
import { EmsTab } from "./editor/EmsTab";
import { ExportTab } from "./editor/ExportTab";
import { KpiTab } from "./editor/KpiTab";
import { QualityTab } from "./editor/QualityTab";
import { SlidesTab } from "./editor/SlidesTab";
import { ThemeTab, TypographyTab } from "./editor/ThemeTab";

const TABS: { id: string; label: string; node: React.ReactNode }[] = [
  { id: "brand", label: "Brand", node: <BrandTab /> },
  { id: "theme", label: "Theme", node: <ThemeTab /> },
  { id: "type", label: "Type", node: <TypographyTab /> },
  { id: "slides", label: "Slides", node: <SlidesTab /> },
  { id: "copy", label: "Copy", node: <CopyTab /> },
  { id: "kpi", label: "KPIs", node: <KpiTab /> },
  { id: "charts", label: "Charts", node: <ChartsTab /> },
  { id: "ems", label: "EMS", node: <EmsTab /> },
  { id: "export", label: "Export", node: <ExportTab /> },
  { id: "quality", label: "Audit", node: <QualityTab /> },
];

export function EditorPanel() {
  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <Tabs defaultValue="copy" className="flex-1 flex flex-col">
        <div className="border-b border-border px-2 pt-2">
          <TabsList className="h-auto flex-wrap bg-transparent gap-1 p-0 justify-start">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {TABS.map((t) => (
            <TabsContent key={t.id} value={t.id} className="mt-0">
              {t.node}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
