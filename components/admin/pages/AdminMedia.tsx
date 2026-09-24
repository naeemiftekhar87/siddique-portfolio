"use client";

import { useState } from "react";
import { Upload, FileText, Search, Grid, List, Copy, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { MediaAsset } from "@/lib/storage/media";
import { deleteMedia } from "@/lib/actions/media";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { formatSize, uploadMedia } from "@/components/admin/upload";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type FilterType = "all" | "image" | "document";

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function AdminMedia({ initial }: { initial: MediaAsset[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [items, setItems] = useState<MediaAsset[]>(initial);
  const [selected, setSelected] = useState<number[]>([]);
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);
  const { pending, run } = useAction();

  const uploadFiles = async (files: FileList | null) => {
    const list = Array.from(files ?? []);
    if (list.length === 0) return;
    setUploading(list.length);
    for (const file of list) {
      const result = await uploadMedia(file);
      if (result.ok) setItems((prev) => [result.data, ...prev]);
      else toast.error(`${file.name}: ${result.error}`);
      setUploading((n) => n - 1);
    }
  };

  const copyUrl = async (item: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(item.url);
      toast.success("URL copied.");
    } catch {
      toast.error("Could not copy to the clipboard.");
    }
  };

  const remove = (id: number) =>
    run(() => deleteMedia(id), {
      success: "File deleted.",
      onSuccess: () => {
        setItems((prev) => prev.filter((x) => x.id !== id));
        setSelected((prev) => prev.filter((x) => x !== id));
      },
    });

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filter === "all" || item.type === filter;
    return matchSearch && matchType;
  });

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Media Library</h1>
          <p className="text-slate-400 text-sm">{items.length} files</p>
        </div>
        <Label variant="unstyled" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-blue-400">
          <Upload size={16} /> Upload Files
          <Input variant="unstyled" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif,application/pdf"
            className="sr-only" onChange={(e) => { uploadFiles(e.target.files); e.target.value = ""; }} />
        </Label>
      </div>

      {/* Upload zone */}
      <Label variant="unstyled"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); uploadFiles(e.dataTransfer.files); }}
        className={`block border-2 border-dashed rounded-2xl p-8 text-center mb-8 hover:border-blue-600 hover:bg-blue-950/10 transition-all cursor-pointer group ${dragging ? "border-blue-600 bg-blue-950/10" : "border-slate-700"}`}>
        {uploading > 0
          ? <Loader2 size={28} className="mx-auto text-blue-500 mb-3 animate-spin" />
          : <Upload size={28} className="mx-auto text-slate-600 group-hover:text-blue-500 mb-3 transition-colors" />}
        <p className="text-slate-400 text-sm mb-1">{uploading > 0 ? `Uploading ${uploading} file${uploading === 1 ? "" : "s"}…` : "Drag & drop files here"}</p>
        <p className="text-slate-600 text-xs">Supports: JPG, PNG, WebP, GIF, AVIF (5 MB) and PDF (50 MB)</p>
        <Input variant="unstyled" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif,application/pdf"
          className="sr-only" onChange={(e) => { uploadFiles(e.target.files); e.target.value = ""; }} />
      </Label>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input variant="admin-field-dark" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." aria-label="Search files"
            className="w-full pl-9 pr-4 py-2.5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "image", "document"] as FilterType[]).map((t) => (
            <Button variant="unstyled" key={t} onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${filter === t ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"}`}>
              {t}
            </Button>
          ))}
          <div className="flex border border-slate-800 rounded-xl overflow-hidden">
            <Button variant="unstyled" onClick={() => setViewMode("grid")} aria-label="Grid view" aria-pressed={viewMode === "grid"} className={`p-2 ${viewMode === "grid" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"} transition-colors`}>
              <Grid size={15} />
            </Button>
            <Button variant="unstyled" onClick={() => setViewMode("list")} aria-label="List view" aria-pressed={viewMode === "list"} className={`p-2 ${viewMode === "list" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"} transition-colors`}>
              <List size={15} />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.length === 0 && (
            <p className="col-span-full text-center py-16 text-slate-500 text-sm">{items.length === 0 ? "No media yet." : "No media match your filters."}</p>
          )}
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`bg-slate-900 rounded-2xl border overflow-hidden cursor-pointer transition-all ${selected.includes(item.id) ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-800 hover:border-slate-700"}`}
            >
              {item.type === "image" ? (
                <div className="h-32 bg-slate-800 overflow-hidden">
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-32 bg-slate-800 flex items-center justify-center">
                  <FileText size={32} className="text-slate-600" />
                </div>
              )}
              <div className="p-3 flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs font-medium truncate">{item.name}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{formatSize(item.size)}</p>
                </div>
                <Button variant="unstyled" onClick={(e) => { e.stopPropagation(); copyUrl(item); }} aria-label={`Copy URL of ${item.name}`}
                  className="text-slate-600 hover:text-teal-400 transition-colors"><Copy size={13} /></Button>
                <ConfirmDelete label={item.name} pending={pending} onConfirm={() => remove(item.id)} variant="admin-ghost-danger" size={13} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card variant="admin-panel" className="overflow-hidden">
          <Table variant="unstyled" className="w-full">
            <TableHeader variant="unstyled">
              <TableRow variant="unstyled" className="border-b border-slate-800">
                <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Name</TableHead>
                <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Type</TableHead>
                <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider hidden md:table-cell">Size</TableHead>
                <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Date</TableHead>
                <TableHead variant="unstyled" className="text-right px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody variant="unstyled" className="divide-y divide-slate-800">
{filtered.length === 0 && (
                <TableRow variant="unstyled">
                  <TableCell variant="unstyled" colSpan={6} className="text-center py-16 text-slate-500 text-sm">
                    {items.length === 0 ? "No media yet." : "No media match your filters."}
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((item) => (
                <TableRow variant="unstyled" key={item.id} className="hover:bg-slate-800/50 transition-colors">
                  <TableCell variant="unstyled" className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {item.type === "image" && item.url ? (
                        <img src={item.url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                          <FileText size={14} className="text-slate-500" />
                        </div>
                      )}
                      <span className="text-slate-200 text-sm">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell variant="unstyled" className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="capitalize text-slate-500 text-xs">{item.type}</span>
                  </TableCell>
                  <TableCell variant="unstyled" className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-slate-500 text-xs font-mono">{formatSize(item.size)}</span>
                  </TableCell>
                  <TableCell variant="unstyled" className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-slate-500 text-xs">{formatDate(item.createdAt)}</span>
                  </TableCell>
                  <TableCell variant="unstyled" className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="admin-icon-info">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.name}`}>
                          <Eye size={14} />
                        </a>
                      </Button>
                      <Button variant="admin-icon-teal" onClick={() => copyUrl(item)} aria-label={`Copy URL of ${item.name}`}>
                        <Copy size={14} />
                      </Button>
                      <ConfirmDelete label={item.name} pending={pending} onConfirm={() => remove(item.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
