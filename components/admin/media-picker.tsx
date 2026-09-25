"use client";

import { useState } from "react";
import { FileText, FolderOpen, Loader2, Search } from "lucide-react";
import type { MediaAsset } from "@/lib/storage/media";
import { listMedia } from "@/lib/actions/media";
import { useAction } from "@/components/admin/use-action";
import { formatSize } from "@/components/admin/upload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

/**
 * "Choose from library" for admin forms: lists files already in the media
 * library (images or PDFs) and returns the chosen file's URL.
 */
export function MediaPicker({
  type,
  onSelect,
  triggerLabel = "Choose from library",
  triggerClassName,
}: {
  type: MediaAsset["type"];
  onSelect: (url: string) => void;
  triggerLabel?: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaAsset[] | null>(null);
  const [search, setSearch] = useState("");
  const { pending, run } = useAction();

  const load = (next: boolean) => {
    setOpen(next);
    if (next) run(() => listMedia(type), { onSuccess: setItems, onError: () => setOpen(false) });
  };

  const filtered = (items ?? []).filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
  const choose = (url: string) => {
    onSelect(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={load}>
      <Button variant="unstyled" type="button" onClick={() => load(true)}
        className={triggerClassName ?? "flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"}>
        <FolderOpen size={12} /> {triggerLabel}
      </Button>
      <DialogContent className="bg-slate-900 text-slate-200 ring-slate-800 sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg text-white">Media Library</DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Choose {type === "image" ? "an image" : "a PDF"} you have already uploaded.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input variant="admin-field-dark" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..." aria-label="Search files" className="w-full pl-9 pr-4 py-2" />
        </div>
        <div className="overflow-y-auto min-h-40">
          {pending || items === null ? (
            <div className="flex justify-center py-12 text-slate-500" role="status">
              <Loader2 size={20} className="animate-spin" /><span className="sr-only">Loading…</span>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-12 text-slate-500 text-sm">
              {items.length === 0 ? `No ${type === "image" ? "images" : "PDFs"} in the library yet.` : "No files match your search."}
            </p>
          ) : type === "image" ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filtered.map((m) => (
                <Button key={m.id} variant="unstyled" type="button" onClick={() => choose(m.url)}
                  className="group text-left rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500 focus-visible:border-blue-500 transition-colors">
                  <img src={m.url} alt="" loading="lazy" className="w-full h-24 object-cover bg-slate-800" />
                  <span className="block px-2 py-1.5 text-xs text-slate-300 truncate">{m.name}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((m) => (
                <Button key={m.id} variant="unstyled" type="button" onClick={() => choose(m.url)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-800 hover:border-blue-500 focus-visible:border-blue-500 text-left transition-colors">
                  <FileText size={16} className="text-red-400 flex-shrink-0" />
                  <span className="flex-1 min-w-0 text-sm text-slate-200 truncate">{m.name}</span>
                  <span className="text-xs text-slate-500 font-mono">{formatSize(m.size)}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
