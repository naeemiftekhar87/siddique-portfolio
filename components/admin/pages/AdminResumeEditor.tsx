"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Save, FileText, Download, Eye } from "lucide-react";
import {
  emptyProfile as profile,
  type experiences as sampleExperiences,
  type education as sampleEducation,
  type skills as sampleSkills,
  type researchPapers as sampleResearchPapers,
} from "@/lib/data";

// The admin starts empty; the preview fills in as content is added (Phase 5).
const experiences: (typeof sampleExperiences)[number][] = [];
const education: (typeof sampleEducation)[number][] = [];
const skills: (typeof sampleSkills)[number][] = [];
const researchPapers: (typeof sampleResearchPapers)[number][] = [];

const TABS = ["professional", "infographic"] as const;
type Tab = typeof TABS[number];

const tabMeta: Record<Tab, { label: string; desc: string }> = {
  professional: { label: "Professional Resume",  desc: "Standard resume for industry and corporate roles" },
  infographic:  { label: "Infographic Resume",    desc: "Visual one-page resume for creative contexts" } };

export default function AdminResumeEditor() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop() as Tab;
  const currentTab: Tab = TABS.includes(slug) ? slug : "professional";

  const [settings, setSettings] = useState({
    showSummary:      true,
    showExperience:   true,
    showEducation:    true,
    showSkills:       true,
    showCertificates: true,
    showResearch:     currentTab !== "professional",
    experienceLimit:  4,
    skillsLimit:      20,
    accentColor:      "#2563eb",
    fontStyle:        "serif" });

  const [customNote, setCustomNote] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

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
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
            <Eye size={14} /> Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
            <Download size={14} /> Export PDF
          </button>
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
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h2 className="font-serif text-base text-white">Sections</h2>
            {[
              { key: "showSummary",      label: "Summary" },
              { key: "showExperience",   label: "Experience" },
              { key: "showEducation",    label: "Education" },
              { key: "showSkills",       label: "Skills" },
              { key: "showCertificates", label: "Certificates" },
              { key: "showResearch",     label: "Research & Publications" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">{label}</span>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof settings] }))}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings[key as keyof typeof settings] ? "bg-blue-600" : "bg-slate-700"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${settings[key as keyof typeof settings] ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Limits */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h2 className="font-serif text-base text-white">Display Limits</h2>
            {[
              { key: "experienceLimit", label: "Max Experience Entries", max: 10 },
              { key: "skillsLimit",     label: "Max Skills Shown",       max: 50 },
            ].map(({ key, label, max }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-slate-400">{label}</label>
                  <span className="text-xs font-mono text-slate-500">{settings[key as keyof typeof settings]} / {max}</span>
                </div>
                <input type="range" min={1} max={max}
                  value={settings[key as keyof typeof settings] as number}
                  onChange={e => setSettings(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  className="w-full accent-blue-600" />
              </div>
            ))}
          </div>

          {/* Style */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h2 className="font-serif text-base text-white">Style</h2>
            <div>
              <label className="block text-xs text-slate-400 mb-2">Accent Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings.accentColor}
                  onChange={e => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent" />
                <span className="text-slate-400 text-xs font-mono">{settings.accentColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-2">Heading Font</label>
              <select value={settings.fontStyle}
                onChange={e => setSettings(prev => ({ ...prev, fontStyle: e.target.value }))}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500">
                <option value="serif">DM Serif Display</option>
                <option value="sans">Inter</option>
              </select>
            </div>
          </div>

          {/* Custom note */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h2 className="font-serif text-base text-white">Custom Note</h2>
            <textarea rows={3} value={customNote} onChange={e => setCustomNote(e.target.value)}
              placeholder="Optional note added to the bottom of this resume variant…"
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none" />
          </div>

          <button onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
            <Save size={15} /> {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>

        {/* Live preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Resume header */}
            <div className="px-8 py-8" style={{ background: `linear-gradient(135deg, #0f1f3d, ${settings.accentColor}30)` }}>
              <h2 className={`text-3xl text-white mb-1 ${settings.fontStyle === "serif" ? "font-serif" : "font-sans font-semibold"}`}>
                {profile.name}
              </h2>
              <p className="text-blue-300 text-sm">{profile.headline}</p>
              <p className="text-slate-400 text-xs mt-1">{profile.location} · {profile.email}</p>
            </div>

            <div className="px-8 py-6 space-y-6 text-sm">
              {settings.showSummary && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">Summary</h3>
                  <p className="text-slate-600 leading-relaxed text-xs">{profile.summary.slice(0, 220)}…</p>
                </div>
              )}

              {settings.showExperience && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Experience</h3>
                  <div className="space-y-3">
                    {experiences.slice(0, settings.experienceLimit).map(exp => (
                      <div key={exp.id} className="pl-3 border-l-2 border-slate-100">
                        <p className="font-semibold text-slate-800 text-xs">{exp.position}</p>
                        <p className="text-xs" style={{ color: settings.accentColor }}>{exp.company} · {exp.startDate}–{exp.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {settings.showEducation && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Education</h3>
                  <div className="space-y-2">
                    {education.map(edu => (
                      <div key={edu.id} className="pl-3 border-l-2 border-slate-100">
                        <p className="font-semibold text-slate-800 text-xs">{edu.degree}</p>
                        <p className="text-slate-500 text-xs">{edu.university} · {edu.startDate}–{edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {settings.showSkills && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.slice(0, settings.skillsLimit).map(s => (
                      <span key={s.id} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs rounded border border-slate-100">{s.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {settings.showResearch && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Research & Publications</h3>
                  <div className="space-y-2">
                    {researchPapers.map(p => (
                      <div key={p.id} className="pl-3 border-l-2 border-slate-100">
                        <p className="font-medium text-slate-800 text-xs">{p.title}</p>
                        <p className="text-slate-500 text-xs">{p.journal} · {p.year}</p>
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
