"use client";

import { useId, useState } from "react";
import { Trophy, Plus, Edit2, Trash2, Save, X, Award } from "lucide-react";
import { achievementCategories, type Achievement } from "@/lib/data";
import { deleteAchievement, saveAchievement } from "@/lib/actions/content";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

type Draft = Omit<Achievement, "id"> & { id?: number };

const CATEGORIES = achievementCategories;

const categoryColors: Record<string, string> = {
  Academic:     "bg-blue-900/40 text-blue-400 border-blue-800",
  Professional: "bg-teal-900/40 text-teal-400 border-teal-800",
  Research:     "bg-violet-900/40 text-violet-400 border-violet-800",
  Community:    "bg-green-900/40 text-green-400 border-green-800",
  Competition:  "bg-amber-900/40 text-amber-400 border-amber-800",
};

const empty: Draft = {
  title: "", organization: "", date: "", description: "", category: "Academic", pinned: false,
};

export default function AdminAchievements({ initial }: { initial: Achievement[] }) {
  const uid = useId();
  const [items, setItems] = useState<Achievement[]>(initial);
  const [editing, setEditing] = useState<Draft | null>(null);
  const { pending, run } = useAction();
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filterCat, setFilterCat] = useState("All");

  const filtered = filterCat === "All" ? items : items.filter(a => a.category === filterCat);

  const startNew = () => {
    setEditing({ ...empty });
    setIsNew(true);
  };

  const startEdit = (a: Achievement) => { setEditing({ ...a }); setIsNew(false); };

  const cancelEdit = () => { setEditing(null); setIsNew(false); };

  const saveEdit = () => {
    if (!editing) return;
    run(() => saveAchievement(editing), {
      onSuccess: (saved) => {
        if (isNew) setItems(prev => [saved, ...prev]);
        else setItems(prev => prev.map(a => a.id === saved.id ? saved : a));
        setEditing(null);
        setIsNew(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      },
    });
  };

  const deleteItem = (id: number) => {
    run(() => deleteAchievement(id), {
      success: "Achievement deleted.",
      onSuccess: () => {
        setItems(prev => prev.filter(a => a.id !== id));
        setDeleteConfirm(null);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Achievements</h1>
          <p className="text-slate-400 text-sm">Manage awards, recognitions, and competition results</p>
        </div>
        <Button variant="admin-primary"
          onClick={startNew}
          className="flex items-center gap-2 px-5 py-2.5"
        >
          <Plus size={15} /> Add Achievement
        </Button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          <Award size={15} /> Achievement saved successfully.
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map(c => (
          <Button variant="unstyled"
            key={c}
            onClick={() => setFilterCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterCat === c ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
            }`}
          >
            {c}
          </Button>
        ))}
      </div>

      {/* Edit / New form */}
      {editing && (
        <div className="bg-slate-900 rounded-2xl border border-blue-800/60 p-6 space-y-4">
          <h2 className="font-serif text-lg text-white">{isNew ? "Add Achievement" : "Edit Achievement"}</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor={`${uid}-title`} variant="admin-label" className="mb-1.5">Title</Label>
              <Input id={`${uid}-title`} variant="admin-field"
                value={editing.title}
                onChange={e => setEditing({ ...editing, title: e.target.value })}
                placeholder="Award or recognition title"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor={`${uid}-organisation`} variant="admin-label" className="mb-1.5">Organisation</Label>
              <Input id={`${uid}-organisation`} variant="admin-field"
                value={editing.organization}
                onChange={e => setEditing({ ...editing, organization: e.target.value })}
                placeholder="Issuing body"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor={`${uid}-year-date`} variant="admin-label" className="mb-1.5">Year / Date</Label>
              <Input id={`${uid}-year-date`} variant="admin-field"
                value={editing.date}
                onChange={e => setEditing({ ...editing, date: e.target.value })}
                placeholder="2026"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor={`${uid}-category`} variant="admin-label" className="mb-1.5">Category</Label>
              <NativeSelect id={`${uid}-category`} variant="admin-field"
                value={editing.category}
                onChange={e => setEditing({ ...editing, category: e.target.value as Draft["category"] })}
                className="w-full"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </NativeSelect>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor={`${uid}-description`} variant="admin-label" className="mb-1.5">Description</Label>
              <Textarea id={`${uid}-description`} variant="admin-field"
                rows={3}
                value={editing.description}
                onChange={e => setEditing({ ...editing, description: e.target.value })}
                placeholder="Brief description of the achievement…"
                className="w-full resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="admin-primary"
              onClick={saveEdit}
              disabled={pending}
              className="flex items-center gap-2 px-5 py-2.5 disabled:opacity-50"
            >
              <Save size={14} /> {pending ? "Saving…" : "Save"}
            </Button>
            <Button variant="admin-outline"
              onClick={cancelEdit}
              className="flex items-center gap-2 px-5 py-2.5"
            >
              <X size={14} /> Cancel
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {filtered.map(a => (
          <Card variant="admin-panel" key={a.id} className="p-5 hover:border-slate-700 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Trophy size={16} className="text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${categoryColors[a.category] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}>
                      {a.category}
                    </span>
                    <span className="text-slate-500 text-xs font-mono">{a.date}</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm">{a.title}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{a.organization}</p>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">{a.description}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="admin-ghost"
                  onClick={() => startEdit(a)}
                  aria-label={`Edit ${a.title}`}
>
                  <Edit2 size={14} />
                </Button>
                {deleteConfirm === a.id ? (
                  <div className="flex gap-1.5">
                    <Button variant="admin-danger-sm"
                      onClick={() => deleteItem(a.id)}
                      disabled={pending}
                      className="transition-colors"
                    >
                      Confirm
                    </Button>
                    <Button variant="unstyled"
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button variant="admin-ghost-danger"
                    onClick={() => setDeleteConfirm(a.id)}
                    aria-label={`Delete ${a.title}`}
>
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Trophy size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">{items.length === 0 ? "No achievements yet." : "No achievements in this category."}</p>
        </div>
      )}
    </div>
  );
}
