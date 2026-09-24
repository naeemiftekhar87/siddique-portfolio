"use client";

import { useState } from "react";
import { Save, Plus, X, LayoutTemplate } from "lucide-react";
import type { FooterSettings } from "@/lib/data";
import { saveSettings } from "@/lib/actions/settings";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SharedFieldsNote } from "@/components/admin/shared-fields-note";

type FooterLink = FooterSettings["quickLinks"][number];

export default function AdminWebsiteFooter({ initial, name }: { initial: FooterSettings; name: string }) {
  const [tagline, setTagline] = useState(initial.tagline);
  const [copyright, setCopyright] = useState(initial.copyright);
  const [quickLinks, setQuickLinks] = useState<FooterLink[]>(initial.quickLinks);
  const { pending, run } = useAction();
  const [newLabel, setNewLabel] = useState("");
  const [newTo, setNewTo]       = useState("");
  const [saved, setSaved]       = useState(false);

  const addLink = () => {
    if (!newLabel.trim() || !newTo.trim()) return;
    setQuickLinks(prev => [...prev, { id: Math.max(0, ...prev.map(l => l.id)) + 1, label: newLabel.trim(), to: newTo.trim() }]);
    setNewLabel(""); setNewTo("");
  };

  const removeLink = (id: number) => setQuickLinks(prev => prev.filter(l => l.id !== id));

  const handleSave = () => {
    run(() => saveSettings("footer", { tagline, copyright, quickLinks }), {
      onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 3000); },
    });
  };

  const inputClass = "w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white mb-1 flex items-center gap-2">
          <LayoutTemplate size={22} className="text-blue-400" /> Footer
        </h1>
        <p className="text-slate-400 text-sm">Manage footer text and quick links</p>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Footer settings saved.
        </div>
      )}

      {/* Text content */}
      <Card variant="admin-panel" className="p-6 space-y-4">
        <h2 className="font-serif text-lg text-white">Text Content</h2>
        <div>
          <Label variant="admin-label" htmlFor="footer-tagline" className="mb-1.5">Tagline / About Blurb</Label>
          <Textarea variant="unstyled" id="footer-tagline" rows={3} value={tagline} onChange={e => setTagline(e.target.value)}
            className={`${inputClass} resize-none`} />
        </div>
        <div>
          <Label variant="admin-label" htmlFor="footer-copyright" className="mb-1.5">Copyright Notice</Label>
          <Input variant="unstyled" id="footer-copyright" placeholder="Leave empty for “© year Your Name. All rights reserved.”" value={copyright} onChange={e => setCopyright(e.target.value)} className={inputClass} />
        </div>
      </Card>

      <SharedFieldsNote fields="Social links" href="/admin/settings" screen="Settings" />

      {/* Quick links */}
      <Card variant="admin-panel" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg text-white">Quick Links</h2>
          <span className="text-slate-500 text-xs font-mono">{quickLinks.length} links</span>
        </div>
        <div className="space-y-2">
          {quickLinks.map(link => (
            <div key={link.id} className="flex items-center gap-3 p-2.5 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-slate-300 text-sm flex-1">{link.label}</span>
              <code className="text-slate-500 text-xs flex-1">{link.to}</code>
              <Button variant="unstyled" onClick={() => removeLink(link.id)} aria-label={`Remove ${link.label}`} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors">
                <X size={13} />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-1">
          <Input variant="admin-field" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label" aria-label="Link label"
            className="flex-1" />
          <Input variant="admin-field" value={newTo} onChange={e => setNewTo(e.target.value)} placeholder="/path" aria-label="Link path"
            className="flex-1 font-mono" />
          <Button variant="unstyled" onClick={addLink} className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-700 text-white text-sm font-medium rounded-xl hover:bg-slate-600 transition-colors border border-slate-600">
            <Plus size={14} /> Add
          </Button>
        </div>
      </Card>

      {/* Preview */}
      <div className="bg-[#0f1f3d] rounded-2xl p-6 text-white space-y-4">
        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Footer Preview</p>
        <p className="font-serif text-xl">{name}</p>
        <p className="text-slate-400 text-sm leading-relaxed max-w-md">{tagline}</p>
        <div className="flex flex-wrap gap-3 text-sm text-slate-400">
          {quickLinks.map(l => <span key={l.id} className="hover:text-white cursor-default">{l.label}</span>)}
        </div>
        <p className="text-slate-600 text-xs border-t border-white/10 pt-4">{copyright || `© ${new Date().getFullYear()} ${name}. All rights reserved.`}</p>
      </div>

      <Button variant="unstyled" onClick={handleSave} disabled={pending}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all disabled:opacity-50 ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
        <Save size={15} /> {pending ? "Saving…" : saved ? "Saved!" : "Save Footer"}
      </Button>
    </div>
  );
}
