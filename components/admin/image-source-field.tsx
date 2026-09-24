"use client";

import { useRef, useState } from "react";
import { Upload, Link2, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatSize, uploadMedia } from "./upload";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

type Mode = "upload" | "url";

type ImageSourceFieldProps = {
  /** Current image URL (a pasted URL or a media-library upload). */
  value: string;
  /** Called with the new image URL. */
  onChange: (value: string) => void;
  /** Show a small thumbnail of the current image (for forms without their own preview). */
  showPreview?: boolean;
  urlPlaceholder?: string;
};

/**
 * Pick an image either by uploading from the device or by pasting a URL.
 * Uploads go straight to the media library (Supabase Storage via /api/media)
 * and the field receives the stored file's public URL.
 */
export function ImageSourceField({ value, onChange, showPreview = false, urlPlaceholder = "https://..." }: ImageSourceFieldProps) {
  const [mode, setMode] = useState<Mode>(value ? "url" : "upload");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = async (f: File | undefined) => {
    if (!f || uploading) return;
    if (!ACCEPTED.includes(f.type)) { setError("Please choose a JPG, PNG, WebP, GIF, or AVIF image."); return; }
    if (f.size > MAX_BYTES) { setError(`Image is ${formatSize(f.size)}; the limit is 5 MB.`); return; }
    setError("");
    setUploading(true);
    const result = await uploadMedia(f);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if (!result.ok) { setError(result.error); return; }
    setFile(f);
    onChange(result.data.url);
  };

  const clear = () => {
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onChange("");
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    setError("");
    // The two options are alternatives: switching discards the other one's image.
    if (value) clear();
  };

  return (
    <div className="space-y-3">
      <div className="flex w-fit border border-slate-800 rounded-xl overflow-hidden" role="group" aria-label="Image source">
        {([["upload", "Upload from device", Upload], ["url", "Paste URL", Link2]] as const).map(([m, label, Icon]) => (
          <Button key={m} variant="unstyled" type="button" aria-pressed={mode === m} onClick={() => switchMode(m)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs ${mode === m ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"} transition-colors`}>
            <Icon size={12} /> {label}
          </Button>
        ))}
      </div>

      {mode === "upload" ? (
        file && value ? (
          <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl">
            <img src={value} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-sm truncate">{file.name}</p>
              <p className="text-slate-500 text-xs">{formatSize(file.size)}</p>
            </div>
            <Button variant="admin-ghost-danger" type="button" onClick={clear} aria-label="Remove image">
              <X size={14} />
            </Button>
          </div>
        ) : (
          <Button variant="unstyled" type="button" disabled={uploading}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files[0]); }}
            className={`w-full border-2 border-dashed rounded-xl p-6 text-center text-sm transition-colors cursor-pointer ${dragging ? "border-blue-600 text-blue-400" : "border-slate-700 text-slate-500 hover:border-blue-600 hover:text-blue-400"}`}>
            {uploading ? <Loader2 size={18} className="mx-auto mb-2 animate-spin" /> : <Upload size={18} className="mx-auto mb-2" />}
            {uploading ? "Uploading…" : "Drag & drop or click to upload"}
            <span className="block text-xs text-slate-600 mt-1">JPG, PNG, WebP, GIF, or AVIF · up to 5 MB</span>
          </Button>
        )
      ) : (
        <div className="flex items-center gap-3">
          {showPreview && (
            value ? (
              <img src={value} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-700 flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center flex-shrink-0">
                <ImageIcon size={14} className="text-slate-600" />
              </div>
            )
          )}
          <Input variant="admin-field" type="url" value={value}
            onChange={(e) => { setError(""); onChange(e.target.value.trim()); }}
            placeholder={urlPlaceholder} aria-label="Image URL" className="w-full font-mono" />
        </div>
      )}

      <Input variant="unstyled" ref={inputRef} type="file" accept={ACCEPTED.join(",")} className="hidden"
        onChange={(e) => acceptFile(e.target.files?.[0])} tabIndex={-1} aria-hidden />

      {error && <p className="text-red-400 text-xs" role="alert">{error}</p>}
    </div>
  );
}
