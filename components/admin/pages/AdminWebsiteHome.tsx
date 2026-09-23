"use client";

import { useState } from "react";
import { Save, Home, Type, ArrowRight, Image as ImageIcon } from "lucide-react";
import { profile } from "@/lib/data";

export default function AdminWebsiteHome() {
  const [hero, setHero] = useState({
    badge: profile.badge,
    headline: profile.name,
    subheadline: profile.headline,
    summary: profile.summary.slice(0, 200),
    cta1Label: "Explore My Work",
    cta1Link: "/portfolio",
    cta2Label: "View Resume",
    cta2Link: "/resume",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    floatingCard1: "Your Field",
    floatingCard2: "Analytics Growth",
  });

  const [sections, setSections] = useState({
    showStats: true,
    showProfileCards: true,
    showFeatured: true,
    showExperience: true,
    showResearchInterests: true,
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
          <Home size={22} className="text-blue-400" /> Home Page
        </h1>
        <p className="text-slate-400 text-sm">Edit hero content, CTAs, and section visibility</p>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Home page settings saved.
        </div>
      )}

      {/* Hero content */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <Type size={16} className="text-violet-400" /> Hero Section
        </h2>

        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Badge Text</label>
          <input value={hero.badge} onChange={e => setHero({ ...hero, badge: e.target.value })}
            placeholder="FIELD ONE • FIELD TWO • FIELD THREE" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Main Headline (Name)</label>
          <input value={hero.headline} onChange={e => setHero({ ...hero, headline: e.target.value })}
            className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Sub-headline</label>
          <input value={hero.subheadline} onChange={e => setHero({ ...hero, subheadline: e.target.value })}
            className={inputClass} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-slate-400">Summary Excerpt</label>
            <span className="text-xs font-mono text-slate-600">{hero.summary.length} / 220 chars</span>
          </div>
          <textarea rows={3} value={hero.summary} onChange={e => setHero({ ...hero, summary: e.target.value })}
            className={`${inputClass} resize-none`} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: "cta1Label", label: "Primary CTA Label" },
            { key: "cta1Link", label: "Primary CTA Link" },
            { key: "cta2Label", label: "Secondary CTA Label" },
            { key: "cta2Link", label: "Secondary CTA Link" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
              <input value={hero[key as keyof typeof hero] as string}
                onChange={e => setHero({ ...hero, [key]: e.target.value })}
                className={key.includes("Link") ? `${inputClass} font-mono` : inputClass} />
            </div>
          ))}
        </div>
      </div>

      {/* Profile image */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <ImageIcon size={16} className="text-teal-400" /> Profile Photo
        </h2>
        <div className="flex items-center gap-5">
          <img src={hero.profileImage} alt="Preview" className="w-20 h-20 rounded-2xl object-cover border border-slate-700 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1.5">Image URL</label>
            <input value={hero.profileImage} onChange={e => setHero({ ...hero, profileImage: e.target.value })}
              className={`${inputClass} font-mono`} />
          </div>
        </div>
      </div>

      {/* Section visibility */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <ArrowRight size={16} className="text-amber-400" /> Section Visibility
        </h2>
        <div className="space-y-3">
          {[
            { key: "showStats",           label: "Stats Strip",             desc: "6 metric counters below hero" },
            { key: "showProfileCards",    label: "Profile Cards",           desc: "Experience, Education, Skills, Achievements" },
            { key: "showFeatured",        label: "Featured Sections",       desc: "Research, Portfolio, Certificates cards" },
            { key: "showExperience",      label: "Recent Experience",       desc: "2 latest experience cards" },
            { key: "showResearchInterests", label: "Research Interests",    desc: "Interest tag cloud" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
              <div>
                <p className="text-slate-300 text-sm font-medium">{label}</p>
                <p className="text-slate-500 text-xs">{desc}</p>
              </div>
              <button
                onClick={() => setSections(prev => ({ ...prev, [key]: !prev[key as keyof typeof sections] }))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${sections[key as keyof typeof sections] ? "bg-blue-600" : "bg-slate-700"}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${sections[key as keyof typeof sections] ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
        <Save size={15} /> {saved ? "Saved!" : "Save Home Page"}
      </button>
    </div>
  );
}
