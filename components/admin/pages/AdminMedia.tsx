"use client";

import { useState } from "react";
import { Upload, FileText, Search, Grid, List, Trash2, Copy, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type MediaItem = { id: number; name: string; type: string; size: string; url: string; date: string };

const mediaItems: MediaItem[] = [];

type FilterType = "all" | "image" | "document";

export default function AdminMedia() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [items, setItems] = useState(mediaItems);
  const [selected, setSelected] = useState<number[]>([]);

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
        <Label variant="unstyled" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
          <Upload size={16} /> Upload Files
          <Input variant="unstyled" type="file" multiple className="hidden" />
        </Label>
      </div>

      {/* Upload zone */}
      <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center mb-8 hover:border-blue-600 hover:bg-blue-950/10 transition-all cursor-pointer group">
        <Upload size={28} className="mx-auto text-slate-600 group-hover:text-blue-500 mb-3 transition-colors" />
        <p className="text-slate-400 text-sm mb-1">Drag & drop files here</p>
        <p className="text-slate-600 text-xs">Supports: JPG, PNG, PDF, DOC, EPUB, MP4</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input variant="admin-field-dark" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..."
            className="w-full pl-9 pr-4 py-2.5" />
        </div>
        <div className="flex gap-2">
          {(["all", "image", "document"] as FilterType[]).map((t) => (
            <Button variant="unstyled" key={t} onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${filter === t ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"}`}>
              {t}
            </Button>
          ))}
          <div className="flex border border-slate-800 rounded-xl overflow-hidden">
            <Button variant="unstyled" onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"} transition-colors`}>
              <Grid size={15} />
            </Button>
            <Button variant="unstyled" onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"} transition-colors`}>
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
              <div className="p-3">
                <p className="text-slate-300 text-xs font-medium truncate">{item.name}</p>
                <p className="text-slate-600 text-xs mt-0.5">{item.size}</p>
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
                    <span className="text-slate-500 text-xs font-mono">{item.size}</span>
                  </TableCell>
                  <TableCell variant="unstyled" className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-slate-500 text-xs">{item.date}</span>
                  </TableCell>
                  <TableCell variant="unstyled" className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {item.type === "image" && (
                        <Button variant="admin-icon-info">
                          <Eye size={14} />
                        </Button>
                      )}
                      <Button variant="admin-icon-teal">
                        <Copy size={14} />
                      </Button>
                      <Button variant="admin-icon-danger" onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
>
                        <Trash2 size={14} />
                      </Button>
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
