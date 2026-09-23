"use client";

import { useState } from "react";
import { Save, GraduationCap, BarChart2, Link2, RefreshCw } from "lucide-react";
import { profile } from "@/lib/data";

export default function AdminResearchProfile() {
  const [metrics, setMetrics] = useState({ ...profile.scholarMetrics });
  const [bio, setBio] = useState(
    "Placeholder research bio. Replace it with a short description of your research focus and the questions you work on."
  );
  const [scholarUrl, setScholarUrl] = useState(profile.scholar);
  const [orcid, setOrcid] = useState("");
  const [researchGate, setResearchGate] = useState(profile.researchgate);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white mb-1">Research Profile</h1>
        <p className="text-slate-400 text-sm">Manage your scholar metrics, academic bio, and profile links</p>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Research profile saved successfully.
        </div>
      )}

      {/* Scholar Metrics */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <BarChart2 size={17} className="text-blue-400" /> Google Scholar Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: "citations",    label: "Citations" },
            { key: "hIndex",       label: "h-Index" },
            { key: "i10Index",     label: "i10-Index" },
            { key: "publications", label: "Publications" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
              <input
                type="number"
                value={metrics[key as keyof typeof metrics]}
                onChange={e => setMetrics({ ...metrics, [key]: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 font-mono text-center"
              />
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-xs flex items-center gap-1.5">
          <RefreshCw size={11} /> These values appear in the Research page hero and ResearchDetail pages.
        </p>
      </div>

      {/* Academic Bio */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <GraduationCap size={17} className="text-violet-400" /> Research Bio
        </h2>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Short Bio (shown on Research page)</label>
          <textarea
            rows={4}
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
          />
          <p className="text-slate-600 text-xs mt-1 text-right font-mono">{bio.length} chars</p>
        </div>
      </div>

      {/* Profile Links */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <Link2 size={17} className="text-teal-400" /> Academic Profile Links
        </h2>
        {[
          { label: "Google Scholar URL", value: scholarUrl, set: setScholarUrl, placeholder: "https://scholar.google.com/..." },
          { label: "ORCID URL", value: orcid, set: setOrcid, placeholder: "https://orcid.org/0000-..." },
          { label: "ResearchGate URL", value: researchGate, set: setResearchGate, placeholder: "https://www.researchgate.net/..." },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
            <input
              value={value}
              onChange={e => set(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${
          saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        <Save size={15} /> {saved ? "Saved!" : "Save Research Profile"}
      </button>
    </div>
  );
}
