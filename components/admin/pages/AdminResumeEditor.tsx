"use client";

import type { Education, Experience, Paper, ProfileSettings, ResumeConfig, Skill } from "@/lib/data";
import { ExternalLink, FileText, Save } from "lucide-react";
import { useId, useState } from "react";
import { saveSettings } from "@/lib/actions/settings";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { dateRange } from "@/lib/data/format";

type Tab = "professional" | "infographic";

const tabMeta: Record<Tab, { label: string; desc: string }> = {
  professional: {
    label: "Professional Resume",
    desc: "Standard resume for industry and corporate roles",
  },
  infographic: {
    label: "Infographic Resume",
    desc: "Visual one-page resume for creative contexts",
  },
};

export default function AdminResumeEditor({
  variant: currentTab,
  initial,
  profile,
  experiences,
  education,
  skills,
  researchPapers,
}: {
  variant: Tab;
  initial: ResumeConfig;
  profile: ProfileSettings;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  researchPapers: Paper[];
}) {
  const uid = useId();
  const { customNote: initialNote, ...initialSettings } = initial;
  const [settings, setSettings] = useState(initialSettings);
  const [customNote, setCustomNote] = useState(initialNote);
  const [saved, setSaved] = useState(false);
  const { pending, run } = useAction();

  const handleSave = () => {
    run(() => saveSettings(`resume_${currentTab}`, { ...settings, customNote }), {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  const meta = tabMeta[currentTab];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1 flex items-center gap-2">
            <FileText size={22} className="text-blue-400" /> {meta.label}
          </h1>
          <p className="text-slate-400 text-sm">{meta.desc}</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="admin-outline" className="flex items-center gap-2 px-4 py-2.5">
            <a href={currentTab === "professional" ? "/resume" : "/resume/infographic"} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={14} /> View on Site
            </a>
          </Button>
        </div>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Resume settings saved.
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Settings panel */}
        <div className="space-y-5">
          {/* Section visibility */}
          <Card variant="admin-panel" className="p-5 space-y-3">
            <h2 className="font-serif text-base text-white">Sections</h2>
            {[
              { key: "showSummary", label: "Summary" },
              { key: "showExperience", label: "Experience" },
              { key: "showEducation", label: "Education" },
              { key: "showSkills", label: "Skills" },
              { key: "showCertificates", label: "Certificates" },
              { key: "showResearch", label: "Research & Publications" },
              { key: "showLanguages", label: "Languages" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">{label}</span>
                <Button variant="unstyled"
                  role="switch"
                  aria-checked={settings[key as keyof typeof settings] as boolean}
                  aria-label={label}
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      [key]: !prev[key as keyof typeof settings],
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings[key as keyof typeof settings] ? "bg-blue-600" : "bg-slate-700"}`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${settings[key as keyof typeof settings] ? "translate-x-4" : "translate-x-0.5"}`}
                  />
                </Button>
              </div>
            ))}
          </Card>

          {/* Limits */}
          <Card variant="admin-panel" className="p-5 space-y-4">
            <h2 className="font-serif text-base text-white">Display Limits</h2>
            {[
              {
                key: "experienceLimit",
                label: "Max Experience Entries",
                max: 10,
              },
              { key: "skillsLimit", label: "Max Skills Shown", max: 50 },
            ].map(({ key, label, max }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor={`${uid}-${key}`} variant="unstyled" className="text-xs text-slate-400">{label}</Label>
                  <span className="text-xs font-mono text-slate-500">
                    {settings[key as keyof typeof settings]} / {max}
                  </span>
                </div>
                <Input id={`${uid}-${key}`} variant="unstyled"
                  type="range"
                  min={1}
                  max={max}
                  value={settings[key as keyof typeof settings] as number}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      [key]: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-blue-600"
                />
              </div>
            ))}
          </Card>

          {/* Style */}
          <Card variant="admin-panel" className="p-5 space-y-4">
            <h2 className="font-serif text-base text-white">Style</h2>
            <div>
              <Label htmlFor={`${uid}-accent`} variant="admin-label" className="mb-2">
                Accent Color
              </Label>
              <div className="flex items-center gap-3">
                <Input id={`${uid}-accent`} variant="unstyled"
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      accentColor: e.target.value,
                    }))
                  }
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-slate-400 text-xs font-mono">
                  {settings.accentColor}
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor={`${uid}-font`} variant="admin-label" className="mb-2">
                Heading Font
              </Label>
              <NativeSelect id={`${uid}-font`} variant="admin-field"
                value={settings.fontStyle}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    fontStyle: e.target.value as ResumeConfig["fontStyle"],
                  }))
                }
                className="w-full"
              >
                <option value="serif">DM Serif Display</option>
                <option value="sans">Inter</option>
              </NativeSelect>
            </div>
          </Card>

          {/* Custom note */}
          <Card variant="admin-panel" className="p-5 space-y-3">
            <h2 className="font-serif text-base text-white">Custom Note</h2>
            <Textarea variant="admin-field"
              rows={3}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Optional note added to the bottom of this resume variant…"
              className="w-full resize-none"
            />
          </Card>

          <Button variant="unstyled"
            onClick={handleSave}
            disabled={pending}
            className={`w-full flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all disabled:opacity-50 ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            <Save size={15} /> {pending ? "Saving…" : saved ? "Saved!" : "Save Settings"}
          </Button>
        </div>

        {/* Live preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Resume header */}
            <div
              className="px-8 py-8"
              style={{
                background: `linear-gradient(135deg, #0f1f3d, ${settings.accentColor}30)`,
              }}
            >
              <h2
                className={`text-3xl text-white mb-1 ${settings.fontStyle === "serif" ? "font-serif" : "font-sans font-semibold"}`}
              >
                {profile.name}
              </h2>
              <p className="text-blue-300 text-sm">{profile.headline}</p>
              <p className="text-slate-400 text-xs mt-1">
                {profile.location} · {profile.email}
              </p>
            </div>

            <div className="px-8 py-6 space-y-6 text-sm">
              {settings.showSummary && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                    Summary
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {profile.summary.length > 220 ? `${profile.summary.slice(0, 220)}…` : profile.summary}
                  </p>
                </div>
              )}

              {settings.showExperience && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
                    Experience
                  </h3>
                  <div className="space-y-3">
                    {experiences
                      .slice(0, settings.experienceLimit)
                      .map((exp) => (
                        <div
                          key={exp.id}
                          className="pl-3 border-l-2 border-slate-100"
                        >
                          <p className="font-semibold text-slate-800 text-xs">
                            {exp.position}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: settings.accentColor }}
                          >
                            {exp.company} · {dateRange(exp.startDate, exp.endDate)}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {settings.showEducation && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
                    Education
                  </h3>
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div
                        key={edu.id}
                        className="pl-3 border-l-2 border-slate-100"
                      >
                        <p className="font-semibold text-slate-800 text-xs">
                          {edu.degree}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {edu.university} · {dateRange(edu.startDate, edu.endDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {settings.showSkills && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.slice(0, settings.skillsLimit).map((s) => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs rounded border border-slate-100"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {settings.showResearch && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
                    Research & Publications
                  </h3>
                  <div className="space-y-2">
                    {researchPapers.map((p) => (
                      <div
                        key={p.id}
                        className="pl-3 border-l-2 border-slate-100"
                      >
                        <p className="font-medium text-slate-800 text-xs">
                          {p.title}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {p.journal} · {p.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {customNote && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-slate-500 text-xs italic">{customNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
