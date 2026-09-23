"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, ExternalLink, Download, Copy, BookOpen } from "lucide-react";
import type { publications as initialPubs } from "@/lib/data";

type Pub = typeof initialPubs[0];

const statuses = ["Published", "Accepted", "Under Review", "Submitted", "Working Paper", "Upcoming"];
const areas = ["Research Area A", "Research Area B", "Research Area C", "Research Area D", "Research Area E", "Research Area F"];

const statusColors: Record<string, string> = {
  Published: "bg-green-900/40 text-green-400 border-green-800",
  "Under Review": "bg-yellow-900/40 text-yellow-400 border-yellow-800",
  "Working Paper": "bg-blue-900/40 text-blue-400 border-blue-800",
  Submitted: "bg-purple-900/40 text-purple-400 border-purple-800",
  Upcoming: "bg-slate-800 text-slate-400 border-slate-700",
};

function PubForm({ initial, onSave, onCancel }: { initial?: Partial<Pub>; onSave: (d: Partial<Pub>) => void; onCancel: () => void }) {
  const [f, setF] = useState<Partial<Pub>>(
    initial ?? { title: "", authors: ["Your Name"], year: 2026, area: "Research Area A", status: "Published", journal: "", abstract: "", keywords: [], doi: "" }
  );
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-slate-900 rounded-2xl border border-blue-800/40 p-6 mb-6 space-y-4">
      <h3 className="font-serif text-lg text-white">{initial?.title ? "Edit Publication" : "Add Publication"}</h3>
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
          <select value={f.status ?? "Published"} onChange={(e) => set("status", e.target.value)}
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

      {/* PDF upload */}
      <div>
        <label className="block text-xs text-slate-400 mb-1">PDF Upload</label>
        <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center text-slate-500 text-sm hover:border-blue-600 hover:text-blue-400 transition-colors cursor-pointer">
          Drag & drop PDF or click to upload
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => onSave(f)} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">Save Publication</button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

export default function AdminPublications() {
  const [pubs, setPubs] = useState<(typeof initialPubs)[number][]>([]);
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
          <h1 className="font-serif text-3xl text-white mb-1">Publications</h1>
          <p className="text-slate-400 text-sm">{pubs.length} publications</p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add Publication
        </button>
      </div>

      {showAdd && <PubForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search publications..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...statuses].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${statusFilter === s ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={36} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">{pubs.length === 0 ? "No publications yet." : "No publications match your filters."}</p>
          </div>
        )}
        {filtered.map((pub, idx) => (
          <div key={pub.id} className="bg-slate-900 rounded-2xl border border-slate-800">
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
                  {pub.doi && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-slate-600 text-xs font-mono">DOI:</span>
                      <span className="text-teal-500 text-xs font-mono">{pub.doi}</span>
                      <button className="text-slate-600 hover:text-slate-400 transition-colors"><Copy size={11} /></button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-950/30 transition-all" title="View">
                    <ExternalLink size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg text-slate-500 hover:text-teal-400 hover:bg-teal-950/30 transition-all" title="Download PDF">
                    <Download size={14} />
                  </button>
                  <button onClick={() => setEditing(pub.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-950/30 transition-all">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setPubs((prev) => prev.filter((x) => x.id !== pub.id))}
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
