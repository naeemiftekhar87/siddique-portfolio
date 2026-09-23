"use client";

import { useState } from "react";
import { Plus, Trash2, X, Image as ImageIcon, Save, ExternalLink } from "lucide-react";

type GalleryItem = {
  id: number;
  title: string;
  imageUrl: string;
  caption: string;
  category: string;
  projectLink: string;
};

const CATEGORIES = ["Data Visualization", "Dashboard", "Model Output", "Report", "Presentation", "Other"];

const initialItems: GalleryItem[] = [];

const emptyItem: Omit<GalleryItem, "id"> = {
  title: "", imageUrl: "", caption: "", category: "Data Visualization", projectLink: "",
};

export default function AdminPortfolioGallery() {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<GalleryItem, "id">>(emptyItem);
  const [filterCat, setFilterCat] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const filtered = filterCat === "All" ? items : items.filter(i => i.category === filterCat);

  const addItem = () => {
    if (!form.title || !form.imageUrl) return;
    setItems(prev => [{ id: Date.now(), ...form }, ...prev]);
    setForm(emptyItem);
    setShowForm(false);
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const deleteItem = (id: number) => { setItems(prev => prev.filter(i => i.id !== id)); setDeleteConfirm(null); };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1 flex items-center gap-2">
            <ImageIcon size={22} className="text-blue-400" /> Portfolio Gallery
          </h1>
          <p className="text-slate-400 text-sm">Manage showcase images for projects and visualisations</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
          <Plus size={15} /> Add Image
        </button>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Gallery updated.
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-slate-900 rounded-2xl border border-blue-800/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-white">Add Gallery Image</h2>
            <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
              <X size={15} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: "title",       label: "Title",                    placeholder: "Dashboard screenshot" },
              { key: "category",    label: "Category",                 isSelect: true },
              { key: "imageUrl",    label: "Image URL",                placeholder: "https://...", mono: true, wide: true },
              { key: "projectLink", label: "Project Link (optional)",  placeholder: "/portfolio/1", mono: true },
            ].map(({ key, label, placeholder, mono, wide, isSelect }) => (
              <div key={key} className={wide ? "sm:col-span-2" : ""}>
                <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
                {isSelect ? (
                  <select value={form[key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                ) : (
                  <input value={form[key as keyof typeof form] as string}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 ${mono ? "font-mono" : ""}`} />
                )}
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1.5">Caption</label>
              <textarea rows={2} value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })}
                placeholder="Brief description of the image…"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none" />
            </div>
          </div>
          {form.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-700 h-36">
              <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={addItem}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
              <Save size={14} /> Add to Gallery
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-5 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCat === c ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(item => (
          <div key={item.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden group hover:border-slate-700 transition-all">
            <div className="relative h-44 overflow-hidden bg-slate-800">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.projectLink && (
                  <a href={item.projectLink} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 bg-white/90 text-slate-700 rounded-lg hover:bg-white transition-colors">
                    <ExternalLink size={12} />
                  </a>
                )}
                {deleteConfirm === item.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => deleteItem(item.id)} className="px-2 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Del</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1.5 bg-white/90 text-slate-700 text-xs rounded-lg">✕</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 bg-white/90 text-slate-700 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <div className="absolute bottom-2 left-2">
                <span className="px-2 py-0.5 bg-black/60 text-white text-xs rounded-md backdrop-blur-sm">{item.category}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No gallery items in this category.</p>
        </div>
      )}
    </div>
  );
}
