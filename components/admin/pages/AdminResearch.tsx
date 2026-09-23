"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, FileText } from "lucide-react";
import type { researchPapers as initialPapers } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

type Paper = typeof initialPapers[0];

const statuses = ["Published", "Accepted", "Under Review", "Submitted", "Working Paper", "Upcoming"];
const areas = ["Research Area A", "Research Area B", "Research Area C", "Research Area D", "Research Area E", "Research Area F"];

const statusColors: Record<string, string> = {
  Published: "bg-green-900/40 text-green-400 border-green-800",
  "Under Review": "bg-yellow-900/40 text-yellow-400 border-yellow-800",
  "Working Paper": "bg-blue-900/40 text-blue-400 border-blue-800",
  Submitted: "bg-purple-900/40 text-purple-400 border-purple-800",
  Upcoming: "bg-slate-800 text-slate-400 border-slate-700",
};

function PaperForm({ initial, onSave, onCancel }: { initial?: Partial<Paper>; onSave: (d: Partial<Paper>) => void; onCancel: () => void }) {
  const [f, setF] = useState<Partial<Paper>>(
    initial ?? { title: "", authors: ["Your Name"], year: 2026, area: "Research Area A", status: "Working Paper", journal: "", abstract: "", keywords: [], doi: "" }
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
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label variant="admin-label" className="mb-1">Journal / Conference</Label>
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
      <div className="flex gap-3">
        <Button variant="admin-primary" type="button" onClick={() => onSave(f)} className="px-5 py-2.5">Save Paper</Button>
        <Button variant="admin-secondary" type="button" onClick={onCancel} className="px-5 py-2.5">Cancel</Button>
      </div>
    </div>
  );
}

export default function AdminResearch() {
  const [papers, setPapers] = useState<(typeof initialPapers)[number][]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  const filtered = papers.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.area.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: Partial<Paper>) => {
    setPapers((prev) => [{ id: Date.now(), authors: ["Your Name"], keywords: [], doi: "", ...data } as (typeof prev)[number], ...prev]);
    setShowAdd(false);
  };

  const handleEdit = (id: number, data: Partial<Paper>) => {
    setPapers((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    setEditing(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Research Papers</h1>
          <p className="text-slate-400 text-sm">{papers.length} papers</p>
        </div>
        <Button variant="admin-primary"
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5"
        >
          <Plus size={16} /> Add Paper
        </Button>
      </div>

      {showAdd && <PaperForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />}

      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <Input variant="admin-field-dark" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search papers..."
          className="w-full pl-9 pr-4 py-2.5" />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FileText size={36} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">{papers.length === 0 ? "No research papers yet." : "No research papers match your filters."}</p>
          </div>
        )}
        {filtered.map((paper) => (
          <Card variant="admin-panel" key={paper.id}>
            {editing === paper.id ? (
              <div className="p-6">
                <PaperForm initial={paper} onSave={(d) => handleEdit(paper.id, d)} onCancel={() => setEditing(null)} />
              </div>
            ) : (
              <div className="p-5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs border font-medium ${statusColors[paper.status] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}>
                      {paper.status}
                    </span>
                    <span className="text-slate-500 text-xs font-mono">{paper.year}</span>
                    <span className="text-slate-500 text-xs">{paper.area}</span>
                  </div>
                  <h4 className="text-slate-200 font-medium text-sm mb-1 leading-snug">{paper.title}</h4>
                  <p className="text-slate-500 text-xs">{paper.journal}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="admin-icon-edit" onClick={() => setEditing(paper.id)}
>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="admin-icon-danger" onClick={() => setPapers((prev) => prev.filter((x) => x.id !== paper.id))}
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
