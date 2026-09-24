"use client";

import { useState } from "react";
import { Languages, Plus } from "lucide-react";
import type { Language } from "@/lib/data";
import { deleteLanguage, saveLanguage } from "@/lib/actions/content";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emptyLanguage = { name: "", flag: "", level: "", proficiency: 50 };

/** Languages shown on the resume (flag, name, level, proficiency bar). */
export function LanguagesCard({ initial }: { initial: Language[] }) {
  const [items, setItems] = useState<Language[]>(initial);
  const [form, setForm] = useState(emptyLanguage);
  const { pending, run } = useAction();

  const add = () => {
    if (!form.name.trim()) return;
    run(() => saveLanguage(form), {
      success: "Language added.",
      onSuccess: (saved) => { setItems((prev) => [...prev, saved]); setForm(emptyLanguage); },
    });
  };

  const remove = (id: number) =>
    run(() => deleteLanguage(id), {
      success: "Language removed.",
      onSuccess: () => setItems((prev) => prev.filter((l) => l.id !== id)),
    });

  return (
    <Card variant="admin-panel" className="p-6">
      <h2 className="font-serif text-lg text-white mb-1 flex items-center gap-2">
        <Languages size={18} className="text-violet-400" /> Languages
      </h2>
      <p className="text-slate-500 text-xs mb-5">Shown in the Languages section of the resume.</p>

      <div className="space-y-2 mb-5">
        {items.length === 0 && <p className="text-slate-600 text-sm text-center py-4">No languages yet.</p>}
        {items.map((l) => (
          <div key={l.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700">
            <span className="text-lg w-7 text-center" aria-hidden>{l.flag}</span>
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-sm font-medium">{l.name}</p>
              <p className="text-slate-500 text-xs">{l.level}</p>
            </div>
            <span className="text-slate-400 text-xs font-mono">{l.proficiency}%</span>
            <ConfirmDelete label={l.name} pending={pending} onConfirm={() => remove(l.id)} variant="admin-ghost-danger" size={13} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
        <div>
          <Label variant="admin-label" htmlFor="lang-name" className="mb-1">Language *</Label>
          <Input variant="admin-field" id="lang-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full" />
        </div>
        <div>
          <Label variant="admin-label" htmlFor="lang-flag" className="mb-1">Flag (emoji)</Label>
          <Input variant="admin-field" id="lang-flag" value={form.flag} maxLength={20} onChange={(e) => setForm({ ...form, flag: e.target.value })} className="w-full" />
        </div>
        <div>
          <Label variant="admin-label" htmlFor="lang-level" className="mb-1">Level</Label>
          <Input variant="admin-field" id="lang-level" value={form.level} placeholder="e.g. Native" onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full" />
        </div>
        <div>
          <Label variant="admin-label" htmlFor="lang-prof" className="mb-1">Proficiency ({form.proficiency}%)</Label>
          <Input variant="unstyled" id="lang-prof" type="range" min={0} max={100} value={form.proficiency}
            onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })} className="w-full mt-2 accent-blue-500" />
        </div>
      </div>
      <Button variant="admin-primary" type="button" onClick={add} disabled={pending || !form.name.trim()}
        className="flex items-center gap-2 px-4 py-2.5 mt-4 disabled:opacity-50">
        <Plus size={14} /> Add Language
      </Button>
    </Card>
  );
}
