import { useDeckStore } from "@/deck/store";
import { Label } from "@/components/ui/label";
import { StableInput } from "./StableInput";

const FIELDS: Array<{ key: keyof ReturnType<typeof useDeckStore.getState>["deck"]["meta"]; label: string; placeholder: string }> = [
  { key: "brand", label: "Brand", placeholder: "Grand Community" },
  { key: "client", label: "Client", placeholder: "Starbucks" },
  { key: "date", label: "Date", placeholder: "April 20, 2026" },
  { key: "market", label: "Market", placeholder: "KSA" },
  { key: "footer", label: "Footer line", placeholder: "Speak · Connect · Impact" },
];

function MetaField({ fieldKey, label, placeholder }: { fieldKey: typeof FIELDS[number]["key"]; label: string; placeholder: string }) {
  const value = useDeckStore((s) => s.deck.meta[fieldKey]);
  const setMeta = useDeckStore((s) => s.setMeta);
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</Label>
      <StableInput value={value} onCommit={(v) => setMeta(fieldKey, v)} placeholder={placeholder} />
    </div>
  );
}

export function BrandTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Branding shown on every slide header & footer.</p>
      {FIELDS.map((f) => (
        <MetaField key={f.key} fieldKey={f.key} label={f.label} placeholder={f.placeholder} />
      ))}
    </div>
  );
}
