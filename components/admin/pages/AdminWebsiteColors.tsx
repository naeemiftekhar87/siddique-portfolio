"use client";

import { useState } from "react";
import { Save, Palette, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  contrastRatio,
  defaultSiteColors,
  normalizeHex,
  siteColorVars,
  type SiteColors,
} from "@/lib/site-colors";
import { saveSettings } from "@/lib/actions/settings";
import { useAction } from "@/components/admin/use-action";

type ColorField = {
  key: keyof SiteColors;
  label: string;
  hint: string;
  /** Text colour drawn on top of this background, for the contrast check. */
  textOn: string;
  textName: string;
};

const fields: ColorField[] = [
  { key: "navbar",   label: "Navbar",         hint: "Top navigation bar on every public page.",          textOn: "#ffffff", textName: "white" },
  { key: "pageTop",  label: "Page top",       hint: "Dark header section at the top of every page.",     textOn: "#ffffff", textName: "white" },
  { key: "pageBody", label: "Page body",      hint: "Light page area below the header.",                 textOn: "#040d1f", textName: "dark" },
  { key: "footer",   label: "Footer",         hint: "Footer at the bottom of every public page.",        textOn: "#cbd5e1", textName: "light grey" },
];

// Below WCAG AA for normal text.
const MIN_CONTRAST = 4.5;

function ColorRow({ field, value, onChange }: { field: ColorField; value: string; onChange: (hex: string) => void }) {
  // The text box may hold an unfinished code while typing; the colour only
  // changes once it is a valid hex code.
  const [draft, setDraft] = useState(value);
  const [synced, setSynced] = useState(value);
  if (synced !== value) {
    setSynced(value);
    setDraft(value);
  }

  const valid = normalizeHex(draft) !== null;
  const lowContrast = contrastRatio(value, field.textOn) < MIN_CONTRAST;
  const isDefault = value === defaultSiteColors[field.key];
  const id = `color-${field.key}`;

  return (
    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label variant="admin-label" htmlFor={id} className="mb-0.5">{field.label}</Label>
          <p className="text-slate-500 text-xs">{field.hint}</p>
        </div>
        <Button variant="unstyled" type="button" onClick={() => onChange(defaultSiteColors[field.key])} disabled={isDefault}
          className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none flex-shrink-0">
          <RotateCcw size={12} /> Default
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Input variant="unstyled" type="color" value={value} onChange={e => onChange(e.target.value)}
          aria-label={`${field.label} colour picker`}
          className="h-10 w-14 flex-shrink-0 cursor-pointer rounded-lg border border-slate-600 bg-slate-800 p-1" />
        <Input variant="admin-field" id={id} value={draft} maxLength={7} spellCheck={false} placeholder="#040d1f"
          aria-invalid={!valid} aria-describedby={`${id}-msg`}
          onChange={e => {
            setDraft(e.target.value);
            // Apply full 6-digit codes while typing; short codes (#fff) on blur.
            if (/^#?[0-9a-f]{6}$/i.test(e.target.value.trim())) onChange(normalizeHex(e.target.value)!);
          }}
          onBlur={() => {
            const hex = normalizeHex(draft);
            if (hex) onChange(hex);
            setDraft(hex ?? value);
          }}
          className="w-full min-w-0 font-mono uppercase" />
      </div>
      <div id={`${id}-msg`} className="text-xs" aria-live="polite">
        {!valid ? (
          <p className="text-red-400">Enter a hex colour code, e.g. #040D1F or #FFF.</p>
        ) : lowContrast ? (
          <p className="text-amber-400 flex items-center gap-1.5">
            <AlertTriangle size={12} className="flex-shrink-0" />
            Low contrast: {field.textName} text on this colour may be hard to read.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminWebsiteColors({ initial, name }: { initial: SiteColors; name: string }) {
  const [colors, setColors] = useState<SiteColors>(initial);
  const [saved, setSaved] = useState(false);
  const { pending, run } = useAction();

  const set = (key: keyof SiteColors) => (hex: string) => setColors(prev => ({ ...prev, [key]: hex }));
  const handleSave = () => {
    run(() => saveSettings("colors", colors), {
      onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 3000); },
    });
  };

  // The preview uses the same CSS variables as the public site.
  const previewVars = siteColorVars(colors) as React.CSSProperties;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white mb-1 flex items-center gap-2">
          <Palette size={22} className="text-blue-400" /> Colours
        </h1>
        <p className="text-slate-400 text-sm">Choose the navbar, footer, and page colours. Each change applies to every public page.</p>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Colour settings saved.
        </div>
      )}

      <Card variant="admin-panel" className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg text-white">Site Colours</h2>
          <Button variant="unstyled" type="button" onClick={() => setColors(defaultSiteColors)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700">
            <RotateCcw size={12} /> Reset all
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map(f => <ColorRow key={f.key} field={f} value={colors[f.key]} onChange={set(f.key)} />)}
        </div>
      </Card>

      {/* Preview */}
      <Card variant="admin-panel" className="p-6 space-y-3">
        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Preview</p>
        <div style={previewVars} className="rounded-xl overflow-hidden border border-slate-700 text-left" aria-hidden="true">
          <div className="bg-(color:--site-navbar) px-4 h-10 flex items-center justify-between">
            <span className="font-serif text-white text-sm">{name || "Your Name"}</span>
            <span className="hidden sm:flex gap-3 text-white/70 text-xs"><span className="text-white">Home</span><span>About</span><span>Research</span><span>Contact</span></span>
          </div>
          <div className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) px-4 py-8">
            <p className="text-cyan-400 text-[10px] uppercase tracking-widest font-semibold mb-1">Page top</p>
            <p className="font-serif text-white text-xl">Page Title</p>
            <p className="text-slate-300 text-xs mt-1">Page introduction text</p>
          </div>
          <div className="px-4 py-6 [background:var(--site-body-bg,var(--gradient-body))]">
            <p className="font-serif text-[#040d1f] text-base mb-2">Page body</p>
            <div className="glass-card rounded-lg p-3 text-slate-600 text-xs">Cards and content sit on this background.</div>
          </div>
          <div className="bg-(color:--site-footer) px-4 py-4 text-slate-300 text-xs flex justify-between">
            <span className="font-serif text-white">{name || "Your Name"}</span>
            <span className="text-slate-400">Footer</span>
          </div>
        </div>
      </Card>

      <Button variant="unstyled" onClick={handleSave} disabled={pending}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all disabled:opacity-50 ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
        <Save size={15} /> {pending ? "Saving…" : saved ? "Saved!" : "Save Colours"}
      </Button>
    </div>
  );
}
