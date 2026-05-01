import { forwardRef, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * StableInput keeps the value in local state so external store updates do NOT
 * remount or reset the cursor while the user is typing. The store is updated
 * via onCommit on every change (debounced).
 *
 * - `value` is treated as the source-of-truth ONLY when the input is NOT focused
 *   (so external resets/imports still apply when the user isn't typing).
 * - Cursor position is preserved because we never replace the local state during typing.
 */
interface StableInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onCommit: (value: string) => void;
  debounceMs?: number;
}

export const StableInput = forwardRef<HTMLInputElement, StableInputProps>(function StableInput(
  { value, onCommit, debounceMs = 120, className, ...rest },
  ref
) {
  const [local, setLocal] = useState(value);
  const focused = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!focused.current && local !== value) setLocal(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Input
      ref={ref}
      value={local}
      onFocus={() => { focused.current = true; }}
      onBlur={() => {
        focused.current = false;
        if (timer.current) { window.clearTimeout(timer.current); timer.current = null; }
        if (local !== value) onCommit(local);
      }}
      onChange={(e) => {
        const v = e.target.value;
        setLocal(v);
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          onCommit(v);
          timer.current = null;
        }, debounceMs);
      }}
      className={cn(className)}
      {...rest}
    />
  );
});

interface StableTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
  value: string;
  onCommit: (value: string) => void;
  debounceMs?: number;
}

export const StableTextarea = forwardRef<HTMLTextAreaElement, StableTextareaProps>(function StableTextarea(
  { value, onCommit, debounceMs = 150, className, ...rest },
  ref
) {
  const [local, setLocal] = useState(value);
  const focused = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!focused.current && local !== value) setLocal(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Textarea
      ref={ref}
      value={local}
      onFocus={() => { focused.current = true; }}
      onBlur={() => {
        focused.current = false;
        if (timer.current) { window.clearTimeout(timer.current); timer.current = null; }
        if (local !== value) onCommit(local);
      }}
      onChange={(e) => {
        const v = e.target.value;
        setLocal(v);
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          onCommit(v);
          timer.current = null;
        }, debounceMs);
      }}
      className={cn(className)}
      {...rest}
    />
  );
});
