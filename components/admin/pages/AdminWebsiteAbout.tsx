"use client";

import { useState } from "react";
import { Save, User } from "lucide-react";
import { profile } from "@/lib/data";

export default function AdminWebsiteAbout() {
  const [form, setForm] = useState({
    name: profile.name,
    headline: profile.headline,
    location: profile.location,
    email: profile.email,
    summary: profile.summary,
    careerFocus: "Placeholder career focus. Replace it with a few sentences about your current role, the problems you focus on, and how your professional experience and research connect.",
    academicBio: "Placeholder academic journey. Replace it with a short narrative about your degrees, the institutions you studied at, and how your studies connect to your current work and research.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=280&h=280&fit=crop",
    domainExpertise: "Expertise Area 1, Expertise Area 2, Expertise Area 3, Expertise Area 4, Expertise Area 5, Expertise Area 6, Expertise Area 7",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass = "w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white mb-1 flex items-center gap-2">
          <User size={22} className="text-blue-400" /> About Page
        </h1>
        <p className="text-slate-400 text-sm">Edit the content displayed on the About page</p>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          About page content saved.
        </div>
      )}

      {/* Identity */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white">Identity & Contact</h2>
        <div className="flex items-center gap-5 mb-2">
          <img src={form.profileImage} alt="Profile" className="w-16 h-16 rounded-2xl object-cover border border-slate-700 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1.5">Profile Photo URL</label>
            <input value={form.profileImage} onChange={e => setForm({ ...form, profileImage: e.target.value })}
              className={`${inputClass} font-mono`} />
          </div>
        </div>
        {[
          { key: "name",     label: "Full Name" },
          { key: "headline", label: "Professional Headline" },
          { key: "location", label: "Location" },
          { key: "email",    label: "Email" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
            <input value={form[key as keyof typeof form]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className={inputClass} />
          </div>
        ))}
      </div>

      {/* Bio sections */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white">Bio Sections</h2>
        {[
          { key: "summary",      label: "Professional Summary", rows: 4 },
          { key: "careerFocus",  label: "Career Focus",         rows: 4 },
          { key: "academicBio",  label: "Academic Journey Bio",  rows: 4 },
        ].map(({ key, label, rows }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-slate-400">{label}</label>
              <span className="text-xs font-mono text-slate-600">{(form[key as keyof typeof form] as string).length}</span>
            </div>
            <textarea rows={rows} value={form[key as keyof typeof form] as string}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className={`${inputClass} resize-none leading-relaxed`} />
          </div>
        ))}
      </div>

      {/* Domain expertise */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3">
        <h2 className="font-serif text-lg text-white">Domain Expertise</h2>
        <p className="text-slate-500 text-xs">Comma-separated list shown in the sidebar dark card</p>
        <textarea rows={3} value={form.domainExpertise}
          onChange={e => setForm({ ...form, domainExpertise: e.target.value })}
          className={`${inputClass} resize-none`} />
        <div className="flex flex-wrap gap-2 pt-1">
          {form.domainExpertise.split(",").map(d => d.trim()).filter(Boolean).map(d => (
            <span key={d} className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg border border-slate-700">{d}</span>
          ))}
        </div>
      </div>

      <button onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
        <Save size={15} /> {saved ? "Saved!" : "Save About Page"}
      </button>
    </div>
  );
}
