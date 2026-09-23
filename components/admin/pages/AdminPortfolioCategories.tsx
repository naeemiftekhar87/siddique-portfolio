"use client";

import { useState } from "react";
import { Save, Plus, Edit2, Trash2, X, FolderOpen, GripVertical } from "lucide-react";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  projectCount: number;
};

const COLORS = ["blue", "teal", "violet", "amber", "green", "rose", "orange", "sky"];

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

const initialCategories: Category[] = [];

const emptyCategory: Omit<Category, "id" | "projectCount"> = {
  name: "", slug: "", description: "", color: "blue",
};

export default function AdminPortfolioCategories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editing, setEditing] = useState<(Category | (Omit<Category, "id" | "projectCount"> & { id?: number })) | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const startNew = () => { setEditing({ ...emptyCategory }); setIsNew(true); };
  const startEdit = (c: Category) => { setEditing({ ...c }); setIsNew(false); };
  const cancelEdit = () => { setEditing(null); setIsNew(false); };

  const saveEdit = () => {
    if (!editing || !editing.name) return;
    if (isNew) {
      setCategories(prev => [...prev, { ...editing, id: Date.now(), projectCount: 0 } as Category]);
    } else {
      setCategories(prev => prev.map(c => c.id === (editing as Category).id ? { ...editing, projectCount: c.projectCount } as Category : c));
    }
    setEditing(null); setIsNew(false);
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const deleteCategory = (id: number) => { setCategories(prev => prev.filter(c => c.id !== id)); setDeleteConfirm(null); };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1 flex items-center gap-2">
            <FolderOpen size={22} className="text-blue-400" /> Portfolio Categories
          </h1>
          <p className="text-slate-400 text-sm">Manage project categories and their display settings</p>
        </div>
        <button onClick={startNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
          <Plus size={15} /> Add Category
        </button>
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
              <label className="block text-xs text-slate-400 mb-1.5">Name</label>
              <input value={editing.name}
                onChange={e => setEditing({ ...editing, name: e.target.value, slug: toSlug(e.target.value) })}
                placeholder="Sample Category"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Slug</label>
              <input value={editing.slug}
                onChange={e => setEditing({ ...editing, slug: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 font-mono" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1.5">Description</label>
              <input value={editing.description}
                onChange={e => setEditing({ ...editing, description: e.target.value })}
                placeholder="Brief description of this category"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-2">Colour</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setEditing({ ...editing, color: c })}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${editing.color === c ? "border-white scale-110" : "border-transparent"} ${colorMap[c]}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={saveEdit}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
              <Save size={14} /> Save
            </button>
            <button onClick={cancelEdit}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories list */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 divide-y divide-slate-800">
        {categories.length === 0 && (
          <div className="text-center py-16">
            <FolderOpen size={36} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No categories yet.</p>
          </div>
        )}
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/40 transition-colors">
            <GripVertical size={14} className="text-slate-700 flex-shrink-0 cursor-grab" />
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
              <button onClick={() => startEdit(cat)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                <Edit2 size={13} />
              </button>
              {deleteConfirm === cat.id ? (
                <div className="flex gap-1.5">
                  <button onClick={() => deleteCategory(cat.id)} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm</button>
                  <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-lg border border-slate-700">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(cat.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
