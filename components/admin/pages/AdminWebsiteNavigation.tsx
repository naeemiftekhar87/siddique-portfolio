"use client";

import { useState } from "react";
import { Save, GripVertical, Plus, X, Eye, EyeOff, Menu, ChevronUp, ChevronDown } from "lucide-react";
import type { NavLink } from "@/lib/data";
import { saveSettings } from "@/lib/actions/settings";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminWebsiteNavigation({ initial }: { initial: NavLink[] }) {
  const [links, setLinks] = useState<NavLink[]>(initial);
  const { pending, run } = useAction();
  const [newLabel, setNewLabel] = useState("");
  const [newTo, setNewTo] = useState("");
  const [saved, setSaved] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);

  const toggle = (id: number) =>
    setLinks(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));

  const remove = (id: number) => setLinks(prev => prev.filter(l => l.id !== id));

  const addLink = () => {
    if (!newLabel.trim() || !newTo.trim()) return;
    setLinks(prev => [...prev, { id: Math.max(0, ...prev.map(l => l.id)) + 1, label: newLabel.trim(), to: newTo.trim(), visible: true }]);
    setNewLabel(""); setNewTo("");
  };

  const handleSave = () => {
    run(() => saveSettings("navigation", { links }), {
      onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 3000); },
    });
  };

  // Keyboard-accessible alternative to drag-to-reorder: move among the visible links.
  const moveVisible = (id: number, delta: -1 | 1) => {
    setLinks(prev => {
      const vis = prev.filter(l => l.visible);
      const i = vis.findIndex(l => l.id === id);
      const target = vis[i + delta];
      if (!target) return prev;
      const arr = [...prev];
      const a = arr.findIndex(l => l.id === id);
      const b = arr.findIndex(l => l.id === target.id);
      [arr[a], arr[b]] = [arr[b], arr[a]];
      return arr;
    });
  };

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
      <Card variant="admin-panel" className="p-6 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif text-lg text-white">Visible in Navbar</h2>
          <span className="text-slate-500 text-xs font-mono">{visible.length} links</span>
        </div>
        {visible.map((link, index) => (
          <div
            key={link.id}
            draggable
            onDragStart={() => handleDragStart(link.id)}
            onDragOver={e => handleDragOver(e, link.id)}
            onDragEnd={() => setDragId(null)}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${dragId === link.id ? "border-blue-500 bg-blue-950/20" : "border-slate-700 bg-slate-800 hover:border-slate-600"}`}
          >
            <GripVertical size={14} className="text-slate-600 flex-shrink-0" />
            <div className="flex flex-col flex-shrink-0">
              <Button variant="unstyled" onClick={() => moveVisible(link.id, -1)} disabled={index === 0} aria-label={`Move ${link.label} up`}
                className="text-slate-600 hover:text-slate-300 disabled:opacity-30 disabled:pointer-events-none"><ChevronUp size={12} /></Button>
              <Button variant="unstyled" onClick={() => moveVisible(link.id, 1)} disabled={index === visible.length - 1} aria-label={`Move ${link.label} down`}
                className="text-slate-600 hover:text-slate-300 disabled:opacity-30 disabled:pointer-events-none"><ChevronDown size={12} /></Button>
            </div>
            <span className="text-slate-200 text-sm font-medium flex-1">{link.label}</span>
            <code className="text-slate-500 text-xs flex-1">{link.to}</code>
            <Button variant="unstyled" onClick={() => toggle(link.id)} className="p-1.5 text-green-400 hover:bg-slate-700 rounded-lg transition-colors" title="Hide from navbar" aria-label={`Hide ${link.label} from navbar`}>
              <Eye size={14} />
            </Button>
            <Button variant="unstyled" onClick={() => remove(link.id)} aria-label={`Remove ${link.label}`} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors">
              <X size={14} />
            </Button>
          </div>
        ))}
        {visible.length === 0 && <p className="text-slate-600 text-sm text-center py-4">No visible links.</p>}
      </Card>

      {/* Hidden links */}
      {hidden.length > 0 && (
        <Card variant="admin-panel" className="p-6 space-y-3">
          <h2 className="font-serif text-lg text-white text-opacity-60 flex items-center gap-2">
            <EyeOff size={15} className="text-slate-500" /> Hidden Pages
            <span className="text-slate-600 text-xs font-mono font-normal">(accessible via direct URL)</span>
          </h2>
          {hidden.map(link => (
            <div key={link.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-800/40">
              <span className="text-slate-500 text-sm flex-1">{link.label}</span>
              <code className="text-slate-600 text-xs flex-1">{link.to}</code>
              <Button variant="unstyled" onClick={() => toggle(link.id)} className="p-1.5 text-slate-500 hover:text-green-400 hover:bg-slate-700 rounded-lg transition-colors" title="Show in navbar" aria-label={`Show ${link.label} in navbar`}>
                <EyeOff size={14} />
              </Button>
            </div>
          ))}
        </Card>
      )}

      {/* Add link */}
      <Card variant="admin-panel" className="p-6 space-y-3">
        <h2 className="font-serif text-lg text-white">Add Custom Link</h2>
        <div className="flex gap-3">
          <Input variant="admin-field" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label" aria-label="Link label"
            className="flex-1" />
          <Input variant="admin-field" value={newTo} onChange={e => setNewTo(e.target.value)} placeholder="/path-or-url" aria-label="Link path or URL"
            className="flex-1 font-mono" />
          <Button variant="admin-primary" onClick={addLink} className="flex items-center gap-2 px-4 py-2.5">
            <Plus size={14} /> Add
          </Button>
        </div>
      </Card>

      {/* Preview */}
      <Card variant="admin-panel" className="p-5">
        <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-3">Navbar Preview</p>
        <div className="flex flex-wrap gap-1">
          {visible.map(link => (
            <span key={link.id} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm rounded-md border border-slate-700">{link.label}</span>
          ))}
        </div>
      </Card>

      <Button variant="unstyled" onClick={handleSave} disabled={pending}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all disabled:opacity-50 ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
        <Save size={15} /> {pending ? "Saving…" : saved ? "Saved!" : "Save Navigation"}
      </Button>
    </div>
  );
}
