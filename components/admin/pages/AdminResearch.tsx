"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, ExternalLink, Download, Copy, BookOpen } from "lucide-react";
import { paperStatuses as statuses, type publications as initialPubs } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

// Working-paper fields (merged in from the former Working Papers screen) apply
// only while a paper is not yet accepted or published.
type Pub = typeof initialPubs[0] & { version?: string; submissionDate?: string; preprintUrl?: string };

const isInProgress = (status?: string) => status !== "Accepted" && status !== "Published";

const areas = ["Research Area A", "Research Area B", "Research Area C", "Research Area D", "Research Area E", "Research Area F"];

const statusColors: Record<string, string> = {
  Published: "bg-green-900/40 text-green-400 border-green-800",
  "Under Review": "bg-yellow-900/40 text-yellow-400 border-yellow-800",
  "Working Paper": "bg-blue-900/40 text-blue-400 border-blue-800",
  Submitted: "bg-purple-900/40 text-purple-400 border-purple-800",
  "Revision Requested": "bg-orange-900/40 text-orange-400 border-orange-800",
  Accepted: "bg-teal-900/40 text-teal-400 border-teal-800",
};

function PubForm({ initial, onSave, onCancel }: { initial?: Partial<Pub>; onSave: (d: Partial<Pub>) => void; onCancel: () => void }) {
  const [f, setF] = useState<Partial<Pub>>(
    initial ?? { title: "", authors: ["Your Name"], year: 2026, area: "Research Area A", status: "Working Paper", journal: "", abstract: "", keywords: [], doi: "", version: "", submissionDate: "", preprintUrl: "" }
  );
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-slate-900 rounded-2xl border border-blue-800/40 p-6 mb-6 space-y-4">
      <h3 className="font-serif text-lg text-white">{initial?.title ? "Edit Paper" : "Add Research Paper"}</h3>
      <div>
        <Label variant="admin-label" className="mb-1">Title *</Label>
        <Input variant="admin-field" value={f.title ?? ""} onChange={(e) => set("title", e.target.value)}
          className="w-full" />
      </div>
      <div>
        <Label variant="admin-label" className="mb-1">Authors (comma-separated)</Label>
        <Input variant="admin-field"
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
          <Label variant="admin-label" className="mb-1">Year</Label>
          <Input variant="admin-field" type="number" value={f.year ?? 2026} onChange={(e) => set("year", Number(e.target.value))}
            className="w-full" />
        </div>
        <div>
          <Label variant="admin-label" className="mb-1">Status</Label>
          <NativeSelect variant="admin-field" value={f.status ?? "Working Paper"} onChange={(e) => set("status", e.target.value)}
            className="w-full">
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </NativeSelect>
        </div>
        <div>
          <Label variant="admin-label" className="mb-1">Research Area</Label>
          <NativeSelect variant="admin-field" value={f.area ?? ""} onChange={(e) => set("area", e.target.value)}
            className="w-full">
            {areas.map((a) => <option key={a}>{a}</option>)}
          </NativeSelect>
        </div>
        <div>
          <Label variant="admin-label" className="mb-1">DOI</Label>
          <Input variant="admin-field" value={f.doi ?? ""} onChange={(e) => set("doi", e.target.value)}
            className="w-full" placeholder="10.xxxx/..." />
        </div>
        <div>
          <Label variant="admin-label" className="mb-1">Keywords (comma-separated)</Label>
          <Input variant="admin-field"
            value={Array.isArray(f.keywords) ? f.keywords.join(", ") : ""}
            onChange={(e) => set("keywords", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className="w-full"
          />
        </div>
      </div>
      <div>
        <Label variant="admin-label" className="mb-1">Abstract</Label>
        <Textarea variant="admin-field" rows={4} value={f.abstract ?? ""} onChange={(e) => set("abstract", e.target.value)}
          className="w-full resize-none" />
      </div>

      {isInProgress(f.status) && (
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label variant="admin-label" className="mb-1">Version</Label>
            <Input variant="admin-field" value={f.version ?? ""} onChange={(e) => set("version", e.target.value)}
              className="w-full font-mono" placeholder="v0.1" />
          </div>
          <div>
            <Label variant="admin-label" className="mb-1">Submission Date</Label>
            <Input variant="admin-field" type="date" value={f.submissionDate ?? ""} onChange={(e) => set("submissionDate", e.target.value)}
              className="w-full" />
          </div>
          <div>
            <Label variant="admin-label" className="mb-1">SSRN / Preprint URL</Label>
            <Input variant="admin-field" value={f.preprintUrl ?? ""} onChange={(e) => set("preprintUrl", e.target.value)}
              className="w-full font-mono" placeholder="https://..." />
          </div>
        </div>
      )}

      {/* PDF upload */}
      <div>
        <Label variant="admin-label" className="mb-1">PDF Upload</Label>
        <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center text-slate-500 text-sm hover:border-blue-600 hover:text-blue-400 transition-colors cursor-pointer">
          Drag & drop PDF or click to upload
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="admin-primary" type="button" onClick={() => onSave(f)} className="px-5 py-2.5">Save Paper</Button>
        <Button variant="admin-secondary" type="button" onClick={onCancel} className="px-5 py-2.5">Cancel</Button>
      </div>
    </div>
  );
}

export default function AdminResearch() {
  const [pubs, setPubs] = useState<Pub[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  const filtered = pubs.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.area.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = (data: Partial<Pub>) => {
    setPubs((prev) => [{ id: Date.now(), authors: ["Your Name"], keywords: [], doi: "", ...data } as (typeof prev)[number], ...prev]);
    setShowAdd(false);
  };

  const handleEdit = (id: number, data: Partial<Pub>) => {
    setPubs((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    setEditing(null);
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

      {showAdd && <PubForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />}

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
                <PubForm initial={pub} onSave={(d) => handleEdit(pub.id, d)} onCancel={() => setEditing(null)} />
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
                      <Button variant="unstyled" className="text-slate-600 hover:text-slate-400 transition-colors"><Copy size={11} /></Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Button variant="admin-icon-info"  title="View">
                    <ExternalLink size={14} />
                  </Button>
                  <Button variant="admin-icon-teal"  title="Download PDF">
                    <Download size={14} />
                  </Button>
                  <Button variant="admin-icon-edit" onClick={() => setEditing(pub.id)}
>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="admin-icon-danger" onClick={() => setPubs((prev) => prev.filter((x) => x.id !== pub.id))}
>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
