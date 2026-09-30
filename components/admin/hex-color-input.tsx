"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { normalizeHex } from "@/lib/site-colors";

const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");

/**
 * Finds a colour in pasted text: "#1e40af", "1E40AF", "#fff", "0x1e40af",
 * "rgb(30, 64, 175)", or a code inside a CSS line such as "color: #1e40af;".
 */
export function parseColor(text: string): string | null {
  const t = text.trim();
  const rgb = t.match(/rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/i);
  if (rgb) return `#${toHex(+rgb[1])}${toHex(+rgb[2])}${toHex(+rgb[3])}`;
  const whole = normalizeHex(t.replace(/^0x/i, ""));
  if (whole) return whole;
  const inner = t.match(/#([0-9a-f]{6}|[0-9a-f]{3})(?![0-9a-f])/i);
  return inner ? normalizeHex(inner[1]) : null;
}

/**
 * Colour picker plus a hex text box. The text box accepts typing, pasting
 * (a pasted colour replaces the whole code, whatever is selected) and short
 * codes; the colour only changes once the code is valid.
 */
export function HexColorInput({
  id,
  value,
  onChange,
  label,
  describedBy,
  onValidChange,
}: {
  id: string;
  value: string;
  onChange: (hex: string) => void;
  /** Used for the picker's accessible name ("<label> colour picker"). */
  label: string;
  describedBy?: string;
  /** Called when the text box switches between a valid and an unfinished code. */
  onValidChange?: (valid: boolean) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [synced, setSynced] = useState(value);
  if (synced !== value) {
    setSynced(value);
    setDraft(value);
  }

  const update = (text: string) => {
    setDraft(text);
    onValidChange?.(normalizeHex(text) !== null);
    // Apply full 6-digit codes while typing; short codes (#fff) on blur.
    if (/^#?[0-9a-f]{6}$/i.test(text.trim())) onChange(normalizeHex(text)!);
  };

  return (
    <div className="flex items-center gap-3">
      <Input variant="unstyled" type="color" value={value} onChange={e => onChange(e.target.value)}
        aria-label={`${label} colour picker`}
        className="h-10 w-14 flex-shrink-0 cursor-pointer rounded-lg border border-slate-600 bg-slate-800 p-1" />
      <Input variant="admin-field" id={id} value={draft} spellCheck={false} autoComplete="off"
        placeholder="#1E40AF"
        aria-invalid={normalizeHex(draft) === null} aria-describedby={describedBy}
        onPaste={e => {
          const hex = parseColor(e.clipboardData.getData("text"));
          if (!hex) return; // Let the text paste normally; the hint explains the format.
          e.preventDefault();
          setDraft(hex);
          onValidChange?.(true);
          onChange(hex);
        }}
        onChange={e => update(e.target.value)}
        onBlur={() => {
          const hex = parseColor(draft);
          if (hex) onChange(hex);
          setDraft(hex ?? value);
          onValidChange?.(true);
        }}
        className="w-full min-w-0 font-mono uppercase" />
    </div>
  );
}
