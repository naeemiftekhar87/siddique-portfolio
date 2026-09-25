"use client";

import { useId, useState } from "react";
import { Plus, Trash2, X, Image as ImageIcon, Save, ExternalLink } from "lucide-react";
import { galleryCategories, type GalleryItem } from "@/lib/data";
import { deleteGalleryItem, saveGalleryItem } from "@/lib/actions/content";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { ImageSourceField } from "@/components/admin/image-source-field";

const CATEGORIES = galleryCategories;

const emptyItem: Omit<GalleryItem, "id"> = {
  title: "", imageUrl: "", caption: "", category: "Data Visualization", projectLink: "",
};

export default function AdminPortfolioGallery({ initial }: { initial: GalleryItem[] }) {
  const uid = useId();
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const { pending, run } = useAction();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<GalleryItem, "id">>(emptyItem);
  const [filterCat, setFilterCat] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const filtered = filterCat === "All" ? items : items.filter(i => i.category === filterCat);

  const addItem = () => {
    if (!form.title || !form.imageUrl) return;
    run(() => saveGalleryItem(form), {
      onSuccess: (saved) => {
        setItems(prev => [saved, ...prev]);
        setForm(emptyItem);
        setShowForm(false);
        setSaved(true); setTimeout(() => setSaved(false), 2500);
      },
    });
  };

  const deleteItem = (id: number) => {
    run(() => deleteGalleryItem(id), {
      success: "Image removed from the gallery.",
      onSuccess: () => { setItems(prev => prev.filter(i => i.id !== id)); setDeleteConfirm(null); },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1 flex items-center gap-2">
            <ImageIcon size={22} className="text-blue-400" /> Portfolio Gallery
          </h1>
          <p className="text-slate-400 text-sm">Manage showcase images for projects and visualisations</p>
        </div>
        <Button variant="admin-primary" onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-5 py-2.5">
          <Plus size={15} /> Add Image
        </Button>
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
            <Button variant="unstyled" onClick={() => setShowForm(false)} aria-label="Close" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
              <X size={15} />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: "title",       label: "Title",                    placeholder: "Dashboard screenshot" },
              { key: "category",    label: "Category",                 isSelect: true },
              { key: "projectLink", label: "Project Link (optional)",  placeholder: "/portfolio/1", mono: true },
            ].map(({ key, label, placeholder, mono, isSelect }) => (
              <div key={key}>
                <Label htmlFor={`${uid}-${key}`} variant="admin-label" className="mb-1.5">{label}</Label>
                {isSelect ? (
                  <NativeSelect id={`${uid}-${key}`} variant="admin-field" value={form[key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </NativeSelect>
                ) : (
                  <Input id={`${uid}-${key}`} variant="unstyled" value={form[key as keyof typeof form] as string}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 ${mono ? "font-mono" : ""}`} />
                )}
              </div>
            ))}
            <div className="sm:col-span-2">
              <Label variant="admin-label" className="mb-1.5">Image</Label>
              <ImageSourceField value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor={`${uid}-caption`} variant="admin-label" className="mb-1.5">Caption</Label>
              <Textarea id={`${uid}-caption`} variant="admin-field" rows={2} value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })}
                placeholder="Brief description of the image…"
                className="w-full resize-none" />
            </div>
          </div>
          {form.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-700 h-36">
              <img loading="lazy" decoding="async" src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="admin-primary" onClick={addItem} disabled={pending || !form.title || !form.imageUrl}
              className="flex items-center gap-2 px-5 py-2.5 disabled:opacity-50">
              <Save size={14} /> {pending ? "Saving…" : "Add to Gallery"}
            </Button>
            <Button variant="admin-outline" onClick={() => setShowForm(false)}
              className="px-5 py-2.5">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map(c => (
          <Button variant="unstyled" key={c} onClick={() => setFilterCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCat === c ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"}`}>
            {c}
          </Button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(item => (
          <Card variant="admin-panel" key={item.id} className="overflow-hidden group hover:border-slate-700 transition-all">
            <div className="relative h-44 overflow-hidden bg-slate-800">
              <img loading="lazy" decoding="async" src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                {item.projectLink && (
                  <a href={item.projectLink} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 bg-white/90 text-slate-700 rounded-lg hover:bg-white transition-colors">
                    <ExternalLink size={12} />
                  </a>
                )}
                {deleteConfirm === item.id ? (
                  <div className="flex gap-1">
                    <Button variant="unstyled" disabled={pending} onClick={() => deleteItem(item.id)} className="px-2 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Del</Button>
                    <Button variant="unstyled" onClick={() => setDeleteConfirm(null)} aria-label="Cancel delete" className="px-2 py-1.5 bg-white/90 text-slate-700 text-xs rounded-lg">✕</Button>
                  </div>
                ) : (
                  <Button variant="unstyled" onClick={() => setDeleteConfirm(item.id)} aria-label={`Delete ${item.title}`} className="p-1.5 bg-white/90 text-slate-700 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 size={12} />
                  </Button>
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
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">{items.length === 0 ? "No gallery images yet." : "No gallery items in this category."}</p>
        </div>
      )}
    </div>
  );
}
