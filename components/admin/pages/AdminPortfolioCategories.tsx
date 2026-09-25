"use client";

import { useId, useState } from "react";
import { Save, Plus, Edit2, Trash2, X, FolderOpen } from "lucide-react";
import { portfolioColors, type PortfolioCategory } from "@/lib/data";
import { deletePortfolioCategory, reorderPortfolioCategories, savePortfolioCategory } from "@/lib/actions/content";
import { useAction } from "@/components/admin/use-action";
import { ReorderButtons, moveItem } from "@/components/admin/reorder-buttons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Category = PortfolioCategory;
type Draft = Omit<Category, "id" | "projectCount"> & { id?: number };

const COLORS = portfolioColors;

const colorMap: Record<string, string> = {
  blue:   "bg-blue-900/40 text-blue-400 border-blue-800",
  teal:   "bg-teal-900/40 text-teal-400 border-teal-800",
  violet: "bg-violet-900/40 text-violet-400 border-violet-800",
  amber:  "bg-amber-900/40 text-amber-400 border-amber-800",
  green:  "bg-green-900/40 text-green-400 border-green-800",
  rose:   "bg-rose-900/40 text-rose-400 border-rose-800",
  orange: "bg-orange-900/40 text-orange-400 border-orange-800",
  sky:    "bg-sky-900/40 text-sky-400 border-sky-800",
};

const emptyCategory: Draft = {
  name: "", slug: "", description: "", color: "blue",
};

export default function AdminPortfolioCategories({ initial }: { initial: Category[] }) {
  const uid = useId();
  const [categories, setCategories] = useState<Category[]>(initial);
  const [editing, setEditing] = useState<Draft | null>(null);
  const { pending, run } = useAction();
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const toSlug = (name: string) => name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");

  const startNew = () => { setEditing({ ...emptyCategory }); setIsNew(true); };
  const startEdit = (c: Category) => { setEditing({ ...c }); setIsNew(false); };
  const cancelEdit = () => { setEditing(null); setIsNew(false); };

  const saveEdit = () => {
    if (!editing || !editing.name) return;
    run(() => savePortfolioCategory(editing), {
      onSuccess: (saved) => {
        if (isNew) setCategories(prev => [...prev, saved]);
        else setCategories(prev => prev.map(c => c.id === saved.id ? saved : c));
        setEditing(null); setIsNew(false);
        setSaved(true); setTimeout(() => setSaved(false), 2500);
      },
    });
  };

  const deleteCategory = (id: number) => {
    run(() => deletePortfolioCategory(id), {
      success: "Category deleted. Its projects are now uncategorized.",
      onSuccess: () => { setCategories(prev => prev.filter(c => c.id !== id)); setDeleteConfirm(null); },
    });
  };

  const move = (index: number, delta: -1 | 1) => {
    const next = moveItem(categories, index, delta);
    const previous = categories;
    setCategories(next);
    // Optimistic: restore the previous order if the save fails.
    run(() => reorderPortfolioCategories(next.map(c => c.id)), { onError: () => setCategories(previous) });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1 flex items-center gap-2">
            <FolderOpen size={22} className="text-blue-400" /> Portfolio Categories
          </h1>
          <p className="text-slate-400 text-sm">Manage project categories and their display settings</p>
        </div>
        <Button variant="admin-primary" onClick={startNew}
          className="flex items-center gap-2 px-5 py-2.5">
          <Plus size={15} /> Add Category
        </Button>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Categories saved.
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="bg-slate-900 rounded-2xl border border-blue-800/60 p-6 space-y-4">
          <h2 className="font-serif text-lg text-white">{isNew ? "Add Category" : "Edit Category"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${uid}-name`} variant="admin-label" className="mb-1.5">Name</Label>
              <Input id={`${uid}-name`} variant="admin-field" value={editing.name}
                onChange={e => setEditing({ ...editing, name: e.target.value, slug: toSlug(e.target.value) })}
                placeholder="Sample Category"
                className="w-full" />
            </div>
            <div>
              <Label htmlFor={`${uid}-slug`} variant="admin-label" className="mb-1.5">Slug</Label>
              <Input id={`${uid}-slug`} variant="admin-field" value={editing.slug}
                onChange={e => setEditing({ ...editing, slug: e.target.value })}
                className="w-full font-mono" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor={`${uid}-description`} variant="admin-label" className="mb-1.5">Description</Label>
              <Input id={`${uid}-description`} variant="admin-field" value={editing.description}
                onChange={e => setEditing({ ...editing, description: e.target.value })}
                placeholder="Brief description of this category"
                className="w-full" />
            </div>
            <div>
              <Label variant="admin-label" className="mb-2">Colour</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <Button variant="unstyled" key={c} onClick={() => setEditing({ ...editing, color: c })}
                    aria-label={`Colour ${c}`} aria-pressed={editing.color === c}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${editing.color === c ? "border-white scale-110" : "border-transparent"} ${colorMap[c]}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="admin-primary" onClick={saveEdit} disabled={pending}
              className="flex items-center gap-2 px-5 py-2.5 disabled:opacity-50">
              <Save size={14} /> {pending ? "Saving…" : "Save"}
            </Button>
            <Button variant="admin-outline" onClick={cancelEdit}
              className="flex items-center gap-2 px-5 py-2.5">
              <X size={14} /> Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Categories list */}
      <Card variant="admin-panel" className="divide-y divide-slate-800">
        {categories.length === 0 && (
          <div className="text-center py-16">
            <FolderOpen size={36} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No categories yet.</p>
          </div>
        )}
        {categories.map((cat, index) => (
          <div key={cat.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/40 transition-colors">
            <ReorderButtons index={index} count={categories.length} label={cat.name} disabled={pending} onMove={(d) => move(index, d)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${colorMap[cat.color] ?? colorMap.blue}`}>
                  {cat.name}
                </span>
                <code className="text-slate-600 text-xs">{cat.slug}</code>
              </div>
              <p className="text-slate-500 text-xs">{cat.description}</p>
            </div>
            <div className="text-center flex-shrink-0 min-w-[48px]">
              <p className="text-white font-mono text-lg font-semibold">{cat.projectCount}</p>
              <p className="text-slate-600 text-xs">projects</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="admin-ghost" aria-label={`Edit ${cat.name}`} onClick={() => startEdit(cat)}>
                <Edit2 size={13} />
              </Button>
              {deleteConfirm === cat.id ? (
                <div className="flex gap-1.5">
                  <Button variant="admin-danger-sm" disabled={pending} onClick={() => deleteCategory(cat.id)}>Confirm</Button>
                  <Button variant="unstyled" onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-lg border border-slate-700">Cancel</Button>
                </div>
              ) : (
                <Button variant="admin-ghost-danger" aria-label={`Delete ${cat.name}`} onClick={() => setDeleteConfirm(cat.id)}>
                  <Trash2 size={13} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
