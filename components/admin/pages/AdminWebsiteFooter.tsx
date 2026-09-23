"use client";

import { useState } from "react";
import { Save, Plus, X, LayoutTemplate } from "lucide-react";
import { emptyProfile as profile } from "@/lib/data";

type FooterLink = { id: number; label: string; to: string };

const defaultQuickLinks: FooterLink[] = [
  { id: 1, label: "About",        to: "/about" },
  { id: 2, label: "Portfolio",    to: "/portfolio" },
  { id: 3, label: "Research",     to: "/research" },
  { id: 4, label: "Certificates", to: "/certificates" },
  { id: 5, label: "eBooks",       to: "/ebooks" },
  { id: 6, label: "Contact",      to: "/contact" },
];

export default function AdminWebsiteFooter() {
  const [tagline, setTagline] = useState("");
  const [copyright, setCopyright] = useState("");
  const [linkedin, setLinkedin] = useState(profile.linkedin);
  const [github, setGithub]     = useState(profile.github);
  const [scholar, setScholar]   = useState(profile.scholar);
  const [quickLinks, setQuickLinks] = useState<FooterLink[]>(defaultQuickLinks);
  const [newLabel, setNewLabel] = useState("");
  const [newTo, setNewTo]       = useState("");
  const [saved, setSaved]       = useState(false);

  const addLink = () => {
    if (!newLabel.trim() || !newTo.trim()) return;
    setQuickLinks(prev => [...prev, { id: Date.now(), label: newLabel.trim(), to: newTo.trim() }]);
    setNewLabel(""); setNewTo("");
  };

  const removeLink = (id: number) => setQuickLinks(prev => prev.filter(l => l.id !== id));

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const inputClass = "w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white mb-1 flex items-center gap-2">
          <LayoutTemplate size={22} className="text-blue-400" /> Footer
        </h1>
        <p className="text-slate-400 text-sm">Manage footer content, quick links, and social links</p>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Footer settings saved.
        </div>
      )}

      {/* Text content */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white">Text Content</h2>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Tagline / About Blurb</label>
          <textarea rows={3} value={tagline} onChange={e => setTagline(e.target.value)}
            className={`${inputClass} resize-none`} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Copyright Notice</label>
          <input value={copyright} onChange={e => setCopyright(e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* Social links */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white">Social Links</h2>
        {[
          { label: "LinkedIn URL", value: linkedin, set: setLinkedin },
          { label: "GitHub URL",   value: github,   set: setGithub   },
          { label: "Google Scholar URL", value: scholar, set: setScholar },
        ].map(({ label, value, set }) => (
          <div key={label}>
            <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
            <input value={value} onChange={e => set(e.target.value)} className={`${inputClass} font-mono`} />
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg text-white">Quick Links</h2>
          <span className="text-slate-500 text-xs font-mono">{quickLinks.length} links</span>
        </div>
        <div className="space-y-2">
          {quickLinks.map(link => (
            <div key={link.id} className="flex items-center gap-3 p-2.5 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-slate-300 text-sm flex-1">{link.label}</span>
              <code className="text-slate-500 text-xs flex-1">{link.to}</code>
              <button onClick={() => removeLink(link.id)} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-1">
          <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label"
            className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" />
          <input value={newTo} onChange={e => setNewTo(e.target.value)} placeholder="/path"
            className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 font-mono" />
          <button onClick={addLink} className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-700 text-white text-sm font-medium rounded-xl hover:bg-slate-600 transition-colors border border-slate-600">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-[#0f1f3d] rounded-2xl p-6 text-white space-y-4">
        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Footer Preview</p>
        <p className="font-serif text-xl">{profile.name}</p>
        <p className="text-slate-400 text-sm leading-relaxed max-w-md">{tagline}</p>
        <div className="flex flex-wrap gap-3 text-sm text-slate-400">
          {quickLinks.map(l => <span key={l.id} className="hover:text-white cursor-default">{l.label}</span>)}
        </div>
        <p className="text-slate-600 text-xs border-t border-white/10 pt-4">{copyright}</p>
      </div>

      <button onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
        <Save size={15} /> {saved ? "Saved!" : "Save Footer"}
      </button>
    </div>
  );
}
