"use client";

import { useState } from "react";
import { Save, Palette, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HexColorInput } from "@/components/admin/hex-color-input";
import { Label } from "@/components/ui/label";
import {
  contrastRatio,
  defaultSiteColors,
  siteColorVars,
  type SiteColors,
} from "@/lib/site-colors";
import { saveSettings } from "@/lib/actions/settings";
import { useAction } from "@/components/admin/use-action";

type ColorField = {
  key: keyof SiteColors;
  label: string;
  hint: string;
  /**
   * Contrast check: the text colour drawn on this background, or (for the
   * accent) the background it is drawn on. Omitted for decorative colours.
   */
  check?: { against: string | keyof SiteColors; message: string };
};

const layoutFields: ColorField[] = [
  { key: "navbar",         label: "Navbar",          hint: "Top navigation bar on every public page.",
    check: { against: "#ffffff", message: "white text on this colour may be hard to read." } },
  { key: "pageTop",        label: "Page header",     hint: "Header banner at the top of each inner page.",
    check: { against: "#ffffff", message: "white text on this colour may be hard to read." } },
  { key: "pageBackground", label: "Page background", hint: "Dark background behind all page content. Keep it dark.",
    check: { against: "#cbd5e1", message: "the light text on this colour may be hard to read. Choose a darker colour." } },
  { key: "footer",         label: "Footer",          hint: "Footer at the bottom of every public page.",
    check: { against: "#cbd5e1", message: "light grey text on this colour may be hard to read." } },
];

const themeFields: ColorField[] = [
  { key: "accent", label: "Accent",     hint: "Section labels, links, icons and highlights.",
    check: { against: "pageBackground", message: "this accent is hard to read on the page background. Choose a lighter colour." } },
  { key: "glow",   label: "Glow light", hint: "Soft ambient light behind the glass panels and headers." },
];

// Below WCAG AA for normal text.
const MIN_CONTRAST = 4.5;

function ColorRow({ field, colors, onChange }: { field: ColorField; colors: SiteColors; onChange: (hex: string) => void }) {
  const value = colors[field.key];
  // The text box may hold an unfinished code while typing. The error is tied
  // to the colour it was reported for, so Default/Reset (which change the
  // colour and reset the text box) also clear it.
  const [invalidFor, setInvalidFor] = useState<string | null>(null);
  const valid = invalidFor !== value;
  const against = field.check && (field.check.against.startsWith("#") ? field.check.against : colors[field.check.against as keyof SiteColors]);
  const lowContrast = !!against && contrastRatio(value, against) < MIN_CONTRAST;
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
      <HexColorInput id={id} value={value} onChange={onChange} label={field.label}
        describedBy={`${id}-msg`} onValidChange={ok => setInvalidFor(ok ? null : value)} />
      <div id={`${id}-msg`} className="text-xs" aria-live="polite">
        {!valid ? (
          <p className="text-red-400">Enter or paste a colour code, e.g. #040D1F, #FFF or rgb(4, 13, 31).</p>
        ) : lowContrast ? (
          <p className="text-amber-400 flex items-center gap-1.5">
            <AlertTriangle size={12} className="flex-shrink-0" />
            Low contrast: {field.check?.message}
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
        <p className="text-slate-400 text-sm">Choose the colours of the public site&apos;s dark theme. Each change applies to every public page.</p>
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
        <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Layout</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {layoutFields.map(f => <ColorRow key={f.key} field={f} colors={colors} onChange={set(f.key)} />)}
        </div>
        <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold pt-2">Theme</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {themeFields.map(f => <ColorRow key={f.key} field={f} colors={colors} onChange={set(f.key)} />)}
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
          <div className="site-backdrop">
            <div className="site-hero overflow-hidden bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) px-4 py-8">
              <p className="text-site-accent text-[10px] uppercase tracking-widest font-semibold mb-1">Page header</p>
              <p className="font-serif text-slate-100 text-xl">Page Title</p>
              <p className="text-slate-300 text-xs mt-1">Page introduction text</p>
            </div>
            <div className="px-4 py-6 space-y-3">
              <p className="font-serif text-slate-100 text-base">Page background</p>
              <div className="glass-card rounded-lg p-3 text-xs">
                <p className="text-slate-300">Glass panels sit on the page background.</p>
                <p className="text-site-accent mt-1.5 font-medium">Accent: links and labels →</p>
              </div>
            </div>
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
