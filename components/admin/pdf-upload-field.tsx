"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadMedia } from "./upload";
import { MediaPicker } from "./media-picker";

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

/**
 * PDF upload (eBooks, papers). The file goes to the media library and the
 * field keeps its public URL; the current file can be opened or removed.
 */
export function PdfUploadField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = async (f: File | undefined) => {
    if (!f || uploading) return;
    if (f.type !== "application/pdf") { setError("Please choose a PDF file."); return; }
    if (f.size > MAX_BYTES) { setError("PDF is too large; the limit is 50 MB."); return; }
    setError("");
    setUploading(true);
    const result = await uploadMedia(f);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if (!result.ok) { setError(result.error); return; }
    onChange(result.data.url);
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl">
          <FileText size={18} className="text-red-400 flex-shrink-0" />
          <a href={value} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 text-slate-200 text-sm truncate hover:text-blue-400">
            {decodeURIComponent(value.split("/").pop() ?? "PDF")}
          </a>
          <Button variant="admin-ghost-danger" type="button" onClick={() => onChange("")} aria-label="Remove PDF">
            <X size={14} />
          </Button>
        </div>
      ) : (
        <Button variant="unstyled" type="button" disabled={uploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files[0]); }}
          className={`w-full border-2 border-dashed rounded-xl p-4 text-center text-sm transition-colors cursor-pointer ${dragging ? "border-blue-600 text-blue-400" : "border-slate-700 text-slate-500 hover:border-blue-600 hover:text-blue-400"}`}>
          {uploading ? <Loader2 size={16} className="mx-auto mb-1 animate-spin" /> : <Upload size={16} className="mx-auto mb-1" />}
          {uploading ? "Uploading…" : "Drag & drop PDF or click to upload"}
          <span className="block text-xs text-slate-600 mt-1">PDF · up to 50 MB</span>
        </Button>
      )}
      <Input variant="unstyled" ref={inputRef} type="file" accept="application/pdf" className="hidden"
        onChange={(e) => acceptFile(e.target.files?.[0])} tabIndex={-1} aria-hidden />
      {!value && <MediaPicker type="document" onSelect={(url) => { setError(""); onChange(url); }} />}
      {error && <p className="text-red-400 text-xs" role="alert">{error}</p>}
    </div>
  );
}
