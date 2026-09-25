"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Search, ExternalLink, Download, Copy, BookOpen, Check } from "lucide-react";
import { toast } from "sonner";
import { paperStatuses as statuses, type Paper } from "@/lib/data";
import { deletePaper, savePaper } from "@/lib/actions/content";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PdfUploadField } from "@/components/admin/pdf-upload-field";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

// Working-paper fields (merged in from the former Working Papers screen) apply
// only while a paper is not yet accepted or published.
type Pub = Paper;
type PubInput = Omit<Pub, "id"> & { id?: number };

const isInProgress = (status?: string) => status !== "Accepted" && status !== "Published";

const emptyPub: PubInput = {
  title: "", authors: [], year: new Date().getFullYear(), area: "", status: "Working Paper", journal: "",
  abstract: "", keywords: [], doi: "", url: "", pdfUrl: "", version: "", submissionDate: null, preprintUrl: "",
};

const statusColors: Record<string, string> = {
  Published: "bg-green-900/40 text-green-400 border-green-800",
  "Under Review": "bg-yellow-900/40 text-yellow-400 border-yellow-800",
  "Working Paper": "bg-blue-900/40 text-blue-400 border-blue-800",
  Submitted: "bg-purple-900/40 text-purple-400 border-purple-800",
  "Revision Requested": "bg-orange-900/40 text-orange-400 border-orange-800",
  Accepted: "bg-teal-900/40 text-teal-400 border-teal-800",
};

function PubForm({ initial, areas, onSave, onCancel, pending }: { initial?: Pub; areas: string[]; onSave: (d: PubInput) => void; onCancel: () => void; pending: boolean }) {
  const uid = useId();
  const [f, setF] = useState<PubInput>(initial ?? { ...emptyPub, area: areas[0] ?? "" });
  // Keep an area that is no longer in the interests list selectable.
  const areaOptions = f.area && !areas.includes(f.area) ? [f.area, ...areas] : areas;
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-slate-900 rounded-2xl border border-blue-800/40 p-6 mb-6 space-y-4">
      <h3 className="font-serif text-lg text-white">{initial?.title ? "Edit Paper" : "Add Research Paper"}</h3>
      <div>
        <Label htmlFor={`${uid}-title`} variant="admin-label" className="mb-1">Title *</Label>
        <Input id={`${uid}-title`} variant="admin-field" value={f.title ?? ""} onChange={(e) => set("title", e.target.value)}
          className="w-full" />
      </div>
      <div>
        <Label htmlFor={`${uid}-authors-comma-separated`} variant="admin-label" className="mb-1">Authors (comma-separated)</Label>
        <Input id={`${uid}-authors-comma-separated`} variant="admin-field"
          value={Array.isArray(f.authors) ? f.authors.join(", ") : ""}
          onChange={(e) => set("authors", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          className="w-full"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label variant="admin-label" className="mb-1">{isInProgress(f.status) ? "Journal / Conference (target)" : "Journal / Conference"}</Label>
          <Input variant="admin-field" value={f.journal ?? ""} onChange={(e) => set("journal", e.target.value)}
            className="w-full" />
        </div>
        <div>
          <Label htmlFor={`${uid}-year`} variant="admin-label" className="mb-1">Year</Label>
          <Input id={`${uid}-year`} variant="admin-field" type="number" value={f.year ?? ""} onChange={(e) => set("year", e.target.value ? Number(e.target.value) : null)}
            className="w-full" />
        </div>
        <div>
          <Label htmlFor={`${uid}-status`} variant="admin-label" className="mb-1">Status</Label>
          <NativeSelect id={`${uid}-status`} variant="admin-field" value={f.status ?? "Working Paper"} onChange={(e) => set("status", e.target.value)}
            className="w-full">
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </NativeSelect>
        </div>
        <div>
          <Label htmlFor={`${uid}-research-area`} variant="admin-label" className="mb-1">Research Area</Label>
          <NativeSelect id={`${uid}-research-area`} variant="admin-field" value={f.area} onChange={(e) => set("area", e.target.value)}
            className="w-full">
            <option value="">None</option>
            {areaOptions.map((a) => <option key={a}>{a}</option>)}
          </NativeSelect>
          {areas.length === 0 && (
            <p className="text-slate-500 text-xs mt-1">
              Areas come from <Link href="/admin/research/interests" className="text-blue-400 hover:underline">Research Interests</Link>.
            </p>
          )}
        </div>
        <div>
          <Label htmlFor={`${uid}-doi`} variant="admin-label" className="mb-1">DOI</Label>
          <Input id={`${uid}-doi`} variant="admin-field" value={f.doi ?? ""} onChange={(e) => set("doi", e.target.value)}
            className="w-full" placeholder="10.xxxx/..." />
        </div>
        <div>
          <Label htmlFor={`${uid}-keywords-comma-separated`} variant="admin-label" className="mb-1">Keywords (comma-separated)</Label>
          <Input id={`${uid}-keywords-comma-separated`} variant="admin-field"
            value={Array.isArray(f.keywords) ? f.keywords.join(", ") : ""}
            onChange={(e) => set("keywords", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className="w-full"
          />
        </div>
      </div>
      <div>
        <Label htmlFor={`${uid}-abstract`} variant="admin-label" className="mb-1">Abstract</Label>
        <Textarea id={`${uid}-abstract`} variant="admin-field" rows={4} value={f.abstract ?? ""} onChange={(e) => set("abstract", e.target.value)}
          className="w-full resize-none" />
      </div>

      {isInProgress(f.status) && (
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`${uid}-version`} variant="admin-label" className="mb-1">Version</Label>
            <Input id={`${uid}-version`} variant="admin-field" value={f.version ?? ""} onChange={(e) => set("version", e.target.value)}
              className="w-full font-mono" placeholder="v0.1" />
          </div>
          <div>
            <Label htmlFor={`${uid}-submission-date`} variant="admin-label" className="mb-1">Submission Date</Label>
            <Input id={`${uid}-submission-date`} variant="admin-field" type="date" value={f.submissionDate ?? ""} onChange={(e) => set("submissionDate", e.target.value || null)}
              className="w-full" />
          </div>
          <div>
            <Label htmlFor={`${uid}-ssrn-preprint-url`} variant="admin-label" className="mb-1">SSRN / Preprint URL</Label>
            <Input id={`${uid}-ssrn-preprint-url`} variant="admin-field" value={f.preprintUrl ?? ""} onChange={(e) => set("preprintUrl", e.target.value)}
              className="w-full font-mono" placeholder="https://..." />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor={`${uid}-paper-url-journal-page`} variant="admin-label" className="mb-1">Paper URL (journal page)</Label>
        <Input id={`${uid}-paper-url-journal-page`} variant="admin-field" value={f.url} onChange={(e) => set("url", e.target.value)}
          className="w-full font-mono" placeholder="https://..." />
      </div>

      {/* PDF upload */}
      <div>
        <Label variant="admin-label" className="mb-1">PDF Upload</Label>
        <PdfUploadField value={f.pdfUrl} onChange={(v) => set("pdfUrl", v)} />
      </div>

      <div className="flex gap-3">
        <Button variant="admin-primary" type="button" onClick={() => onSave(f)} disabled={pending} className="px-5 py-2.5 disabled:opacity-50">{pending ? "Saving…" : "Save Paper"}</Button>
        <Button variant="admin-secondary" type="button" onClick={onCancel} className="px-5 py-2.5">Cancel</Button>
      </div>
    </div>
  );
}

export default function AdminResearch({ initial, areas }: { initial: Pub[]; areas: string[] }) {
  const [pubs, setPubs] = useState<Pub[]>(initial);
  const [copied, setCopied] = useState<number | null>(null);
  const { pending, run } = useAction();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  const filtered = pubs.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.area.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = (data: PubInput) => {
    run(() => savePaper(data), {
      success: "Paper added.",
      onSuccess: (saved) => {
        setPubs((prev) => [saved, ...prev]);
        setShowAdd(false);
      },
    });
  };

  const handleEdit = (id: number, data: PubInput) => {
    run(() => savePaper({ ...data, id }), {
      success: "Paper updated.",
      onSuccess: (saved) => {
        setPubs((prev) => prev.map((p) => (p.id === id ? saved : p)));
        setEditing(null);
      },
    });
  };

  const handleDelete = (id: number) => {
    run(() => deletePaper(id), {
      success: "Paper deleted.",
      onSuccess: () => setPubs((prev) => prev.filter((x) => x.id !== id)),
    });
  };

  const copyDoi = async (pub: Pub) => {
    try {
      await navigator.clipboard.writeText(pub.doi);
      setCopied(pub.id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Could not copy to the clipboard.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Research Papers</h1>
          <p className="text-slate-400 text-sm">{pubs.length} {pubs.length === 1 ? "paper" : "papers"}, from working paper to published</p>
        </div>
        <Button variant="admin-primary"
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5"
        >
          <Plus size={16} /> Add Paper
        </Button>
      </div>

      {showAdd && <PubForm areas={areas} onSave={handleAdd} onCancel={() => setShowAdd(false)} pending={pending} />}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input variant="admin-field-dark" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search papers..."
            className="w-full pl-9 pr-4 py-2.5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...statuses].map((s) => (
            <Button variant="unstyled" key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${statusFilter === s ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"}`}>
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={36} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">{pubs.length === 0 ? "No papers yet." : "No papers match your filters."}</p>
          </div>
        )}
        {filtered.map((pub, idx) => (
          <Card variant="admin-panel" key={pub.id}>
            {editing === pub.id ? (
              <div className="p-6">
                <PubForm initial={pub} areas={areas} onSave={(d) => handleEdit(pub.id, d)} onCancel={() => setEditing(null)} pending={pending} />
              </div>
            ) : (
              <div className="p-5 flex items-start gap-4">
                <span className="font-mono text-slate-700 text-lg font-bold select-none flex-shrink-0 w-8 text-right">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs border font-medium ${statusColors[pub.status] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}>
                      {pub.status}
                    </span>
                    <span className="text-slate-500 text-xs font-mono">{pub.year}</span>
                    <span className="text-slate-600 text-xs">{pub.area}</span>
                  </div>
                  <h4 className="text-slate-200 font-medium text-sm mb-1 leading-snug">{pub.title}</h4>
                  <p className="text-slate-500 text-xs">{pub.journal}</p>
                  {isInProgress(pub.status) && (pub.version || pub.submissionDate) && (
                    <p className="text-slate-600 text-xs font-mono mt-1">
                      {[pub.version, pub.submissionDate && `submitted ${pub.submissionDate}`].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {pub.doi && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-slate-600 text-xs font-mono">DOI:</span>
                      <span className="text-teal-500 text-xs font-mono">{pub.doi}</span>
                      <Button variant="unstyled" onClick={() => copyDoi(pub)} aria-label="Copy DOI" className="text-slate-600 hover:text-slate-400 transition-colors">{copied === pub.id ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}</Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Button asChild variant="admin-icon-info">
                    <Link href={`/research/${pub.id}`} target="_blank" title="View" aria-label={`View ${pub.title} on the site`}>
                      <ExternalLink size={14} />
                    </Link>
                  </Button>
                  {pub.pdfUrl && (
                    <Button asChild variant="admin-icon-teal">
                      <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" title="Download PDF" aria-label="Download PDF">
                        <Download size={14} />
                      </a>
                    </Button>
                  )}
                  <Button variant="admin-icon-edit" aria-label={`Edit ${pub.title}`} onClick={() => setEditing(pub.id)}>
                    <Pencil size={14} />
                  </Button>
                  <ConfirmDelete label={pub.title} pending={pending} onConfirm={() => handleDelete(pub.id)} />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
