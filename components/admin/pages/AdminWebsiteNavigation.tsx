"use client";

import { useState } from "react";
import { Save, GripVertical, Plus, X, Eye, EyeOff, Menu } from "lucide-react";

type NavLink = {
  id: number;
  label: string;
  to: string;
  visible: boolean;
};

const defaultLinks: NavLink[] = [
  { id: 1,  label: "Home",         to: "/",             visible: true },
  { id: 2,  label: "About",        to: "/about",         visible: true },
  { id: 3,  label: "Certificates", to: "/certificates",  visible: true },
  { id: 4,  label: "Portfolio",    to: "/portfolio",     visible: true },
  { id: 5,  label: "Research",     to: "/research",      visible: true },
  { id: 6,  label: "eBooks",       to: "/ebooks",        visible: true },
  { id: 7,  label: "Contact",      to: "/contact",       visible: true },
  { id: 8,  label: "Experience",   to: "/experience",    visible: false },
  { id: 9,  label: "Education",    to: "/education",     visible: false },
  { id: 10, label: "Skills",       to: "/skills",        visible: false },
  { id: 11, label: "Achievements", to: "/achievements",  visible: false },
  { id: 12, label: "Resume",       to: "/resume",        visible: false },
  { id: 13, label: "Publications", to: "/publications",  visible: false },
];

export default function AdminWebsiteNavigation() {
  const [links, setLinks] = useState<NavLink[]>(defaultLinks);
  const [newLabel, setNewLabel] = useState("");
  const [newTo, setNewTo] = useState("");
  const [saved, setSaved] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);

  const toggle = (id: number) =>
    setLinks(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));

  const remove = (id: number) => setLinks(prev => prev.filter(l => l.id !== id));

  const addLink = () => {
    if (!newLabel.trim() || !newTo.trim()) return;
    setLinks(prev => [...prev, { id: Date.now(), label: newLabel.trim(), to: newTo.trim(), visible: true }]);
    setNewLabel(""); setNewTo("");
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const handleDragStart = (id: number) => setDragId(id);
  const handleDragOver = (e: React.DragEvent, overId: number) => {
    e.preventDefault();
    if (dragId === null || dragId === overId) return;
    setLinks(prev => {
      const arr = [...prev];
      const fromIdx = arr.findIndex(l => l.id === dragId);
      const toIdx = arr.findIndex(l => l.id === overId);
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return arr;
    });
  };

  const visible = links.filter(l => l.visible);
  const hidden  = links.filter(l => !l.visible);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white mb-1 flex items-center gap-2">
          <Menu size={22} className="text-blue-400" /> Navigation
        </h1>
        <p className="text-slate-400 text-sm">Control which links appear in the navbar and their order. Drag to reorder.</p>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Navigation saved.
        </div>
      )}

      {/* Visible links */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif text-lg text-white">Visible in Navbar</h2>
          <span className="text-slate-500 text-xs font-mono">{visible.length} links</span>
        </div>
        {visible.map(link => (
          <div
            key={link.id}
            draggable
            onDragStart={() => handleDragStart(link.id)}
            onDragOver={e => handleDragOver(e, link.id)}
            onDragEnd={() => setDragId(null)}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${dragId === link.id ? "border-blue-500 bg-blue-950/20" : "border-slate-700 bg-slate-800 hover:border-slate-600"}`}
          >
            <GripVertical size={14} className="text-slate-600 flex-shrink-0" />
            <span className="text-slate-200 text-sm font-medium flex-1">{link.label}</span>
            <code className="text-slate-500 text-xs flex-1">{link.to}</code>
            <button onClick={() => toggle(link.id)} className="p-1.5 text-green-400 hover:bg-slate-700 rounded-lg transition-colors" title="Hide from navbar">
              <Eye size={14} />
            </button>
            <button onClick={() => remove(link.id)} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
        {visible.length === 0 && <p className="text-slate-600 text-sm text-center py-4">No visible links.</p>}
      </div>

      {/* Hidden links */}
      {hidden.length > 0 && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3">
          <h2 className="font-serif text-lg text-white text-opacity-60 flex items-center gap-2">
            <EyeOff size={15} className="text-slate-500" /> Hidden Pages
            <span className="text-slate-600 text-xs font-mono font-normal">(accessible via direct URL)</span>
          </h2>
          {hidden.map(link => (
            <div key={link.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-800/40">
              <span className="text-slate-500 text-sm flex-1">{link.label}</span>
              <code className="text-slate-600 text-xs flex-1">{link.to}</code>
              <button onClick={() => toggle(link.id)} className="p-1.5 text-slate-500 hover:text-green-400 hover:bg-slate-700 rounded-lg transition-colors" title="Show in navbar">
                <EyeOff size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add link */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3">
        <h2 className="font-serif text-lg text-white">Add Custom Link</h2>
        <div className="flex gap-3">
          <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label"
            className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" />
          <input value={newTo} onChange={e => setNewTo(e.target.value)} placeholder="/path-or-url"
            className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 font-mono" />
          <button onClick={addLink} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-3">Navbar Preview</p>
        <div className="flex flex-wrap gap-1">
          {visible.map(link => (
            <span key={link.id} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm rounded-md border border-slate-700">{link.label}</span>
          ))}
        </div>
      </div>

      <button onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
        <Save size={15} /> {saved ? "Saved!" : "Save Navigation"}
      </button>
    </div>
  );
}
