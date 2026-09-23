"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { researchPapers as initialPapers } from "@/lib/data";

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
        <label className="block text-xs text-slate-400 mb-1">Title *</label>
        <input value={f.title ?? ""} onChange={(e) => set("title", e.target.value)}
          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Journal / Conference</label>
          <input value={f.journal ?? ""} onChange={(e) => set("journal", e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Year</label>
          <input type="number" value={f.year ?? 2026} onChange={(e) => set("year", Number(e.target.value))}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Status</label>
          <select value={f.status ?? "Working Paper"} onChange={(e) => set("status", e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500">
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Research Area</label>
          <select value={f.area ?? ""} onChange={(e) => set("area", e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500">
            {areas.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">DOI</label>
          <input value={f.doi ?? ""} onChange={(e) => set("doi", e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" placeholder="10.xxxx/..." />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Keywords (comma-separated)</label>
          <input
            value={Array.isArray(f.keywords) ? f.keywords.join(", ") : ""}
            onChange={(e) => set("keywords", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Abstract</label>
        <textarea rows={4} value={f.abstract ?? ""} onChange={(e) => set("abstract", e.target.value)}
          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none" />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={() => onSave(f)} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">Save Paper</button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

export default function AdminResearch() {
  const [papers, setPapers] = useState(initialPapers);
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
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add Paper
        </button>
      </div>

      {showAdd && <PaperForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />}

      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search papers..."
          className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" />
      </div>

      <div className="space-y-3">
        {filtered.map((paper) => (
          <div key={paper.id} className="bg-slate-900 rounded-2xl border border-slate-800">
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
                  <button onClick={() => setEditing(paper.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-950/30 transition-all">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setPapers((prev) => prev.filter((x) => x.id !== paper.id))}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
