"use client";

import { useState } from "react";
import { Save, Home, Type, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SharedFieldsNote } from "@/components/admin/shared-fields-note";
import type { HomeSettings } from "@/lib/data";
import { saveSettings } from "@/lib/actions/settings";
import { useAction } from "@/components/admin/use-action";

export default function AdminWebsiteHome({ initial }: { initial: HomeSettings }) {
  const { sections: initialSections, ...initialHero } = initial;
  const [hero, setHero] = useState(initialHero);
  const [sections, setSections] = useState(initialSections);
  const [saved, setSaved] = useState(false);
  const { pending, run } = useAction();

  const handleSave = () => {
    run(() => saveSettings("home", { ...hero, sections }), {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  const inputClass = "w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white mb-1 flex items-center gap-2">
          <Home size={22} className="text-blue-400" /> Home Page
        </h1>
        <p className="text-slate-400 text-sm">Edit hero buttons and section visibility</p>
      </div>

      <SharedFieldsNote fields="The hero badge, name, headline, summary, and photo" href="/admin/profile" screen="Profile → Personal Info" />

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Home page settings saved.
        </div>
      )}

      {/* Hero content */}
      <Card variant="admin-panel" className="p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <Type size={16} className="text-violet-400" /> Hero Buttons
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: "cta1Label", label: "Primary CTA Label" },
            { key: "cta1Link", label: "Primary CTA Link" },
            { key: "cta2Label", label: "Secondary CTA Label" },
            { key: "cta2Link", label: "Secondary CTA Link" },
          ].map(({ key, label }) => (
            <div key={key}>
              <Label variant="admin-label" htmlFor={`home-${key}`} className="mb-1.5">{label}</Label>
              <Input variant="unstyled" id={`home-${key}`} value={hero[key as keyof typeof hero] as string}
                onChange={e => setHero({ ...hero, [key]: e.target.value })}
                className={key.includes("Link") ? `${inputClass} font-mono` : inputClass} />
            </div>
          ))}
        </div>
      </Card>

      {/* Section visibility */}
      <Card variant="admin-panel" className="p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <ArrowRight size={16} className="text-amber-400" /> Section Visibility
        </h2>
        <div className="space-y-3">
          {[
            { key: "showStats",           label: "Stats Strip",             desc: "6 metric counters below hero" },
            { key: "showProfileCards",    label: "Profile Cards",           desc: "Experience, Education, Skills, Achievements" },
            { key: "showFeatured",        label: "Featured Sections",       desc: "Research, Portfolio, Certificates cards" },
            { key: "showExperience",      label: "Recent Experience",       desc: "2 latest experience cards" },
            { key: "showResearchInterests", label: "Recent Research",       desc: "3 latest research papers" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
              <div>
                <p className="text-slate-300 text-sm font-medium">{label}</p>
                <p className="text-slate-500 text-xs">{desc}</p>
              </div>
              <Button variant="unstyled"
                role="switch"
                aria-checked={sections[key as keyof typeof sections]}
                aria-label={label}
                onClick={() => setSections(prev => ({ ...prev, [key]: !prev[key as keyof typeof sections] }))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${sections[key as keyof typeof sections] ? "bg-blue-600" : "bg-slate-700"}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${sections[key as keyof typeof sections] ? "translate-x-4" : "translate-x-0.5"}`} />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Button variant="unstyled" onClick={handleSave} disabled={pending}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all disabled:opacity-50 ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
        <Save size={15} /> {pending ? "Saving…" : saved ? "Saved!" : "Save Home Page"}
      </Button>
    </div>
  );
}
