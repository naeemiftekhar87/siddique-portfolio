"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, FileText, ExternalLink } from "lucide-react";

type WorkingPaper = {
  id: number;
  title: string;
  authors: string;
  abstract: string;
  keywords: string;
  status: string;
  targetJournal: string;
  submissionDate: string;
  version: string;
  ssrnUrl: string;
};

const STATUSES = ["Draft", "Under Internal Review", "Submitted", "Under Review", "Revision Requested", "Accepted"];

const statusColors: Record<string, string> = {
  Draft:                  "bg-slate-800 text-slate-400 border-slate-700",
  "Under Internal Review":"bg-violet-900/40 text-violet-400 border-violet-800",
  Submitted:              "bg-blue-900/40 text-blue-400 border-blue-800",
  "Under Review":         "bg-yellow-900/40 text-yellow-400 border-yellow-800",
  "Revision Requested":   "bg-orange-900/40 text-orange-400 border-orange-800",
  Accepted:               "bg-green-900/40 text-green-400 border-green-800",
};

const initialPapers: WorkingPaper[] = [];

const emptyPaper: Omit<WorkingPaper, "id"> = {
  title: "", authors: "", abstract: "", keywords: "", status: "Draft",
  targetJournal: "", submissionDate: "", version: "v0.1", ssrnUrl: "",
};

export default function AdminResearchWorking() {
  const [papers, setPapers] = useState<WorkingPaper[]>(initialPapers);
  const [editing, setEditing] = useState<WorkingPaper | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const startNew = () => { setEditing({ id: Date.now(), ...emptyPaper }); setIsNew(true); };
  const startEdit = (p: WorkingPaper) => { setEditing({ ...p }); setIsNew(false); };
  const cancelEdit = () => { setEditing(null); setIsNew(false); };

  const saveEdit = () => {
    if (!editing) return;
    if (isNew) setPapers(prev => [editing, ...prev]);
    else setPapers(prev => prev.map(p => p.id === editing.id ? editing : p));
    setEditing(null); setIsNew(false);
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const deletePaper = (id: number) => { setPapers(prev => prev.filter(p => p.id !== id)); setDeleteConfirm(null); };

  const field = (key: keyof WorkingPaper, label: string, opts?: { placeholder?: string; mono?: boolean; wide?: boolean }) => (
    <div key={key} className={opts?.wide ? "sm:col-span-2" : ""}>
      <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
      <input
        value={editing![key] as string}
        onChange={e => setEditing({ ...editing!, [key]: e.target.value })}
        placeholder={opts?.placeholder}
        className={`w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 ${opts?.mono ? "font-mono" : ""}`}
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Working Papers</h1>
          <p className="text-slate-400 text-sm">Manage papers in progress, under review, or awaiting submission</p>
        </div>
        <button onClick={startNew} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
          <Plus size={15} /> Add Paper
        </button>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Working paper saved successfully.
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="bg-slate-900 rounded-2xl border border-blue-800/60 p-6 space-y-4">
          <h2 className="font-serif text-lg text-white">{isNew ? "Add Working Paper" : "Edit Working Paper"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field("title", "Title", { placeholder: "Paper title", wide: true })}
            {field("authors", "Authors", { placeholder: "Author names, comma-separated", wide: true })}
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1.5">Abstract</label>
              <textarea rows={4} value={editing.abstract} onChange={e => setEditing({ ...editing, abstract: e.target.value })}
                placeholder="Brief abstract…"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none" />
            </div>
            {field("keywords", "Keywords (comma-separated)", { placeholder: "Keyword 1, Keyword 2, Keyword 3", wide: true })}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Status</label>
              <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {field("version", "Version", { placeholder: "v0.1", mono: true })}
            {field("targetJournal", "Target Journal", { placeholder: "Journal name", wide: true })}
            {field("submissionDate", "Submission Date", { placeholder: "2026-10-01" })}
            {field("ssrnUrl", "SSRN / Preprint URL", { placeholder: "https://ssrn.com/...", mono: true })}
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={saveEdit} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
              <Save size={14} /> Save
            </button>
            <button onClick={cancelEdit} className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Papers list */}
      <div className="space-y-4">
        {papers.map(p => (
          <div key={p.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText size={15} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${statusColors[p.status] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}>
                      {p.status}
                    </span>
                    <span className="text-slate-500 text-xs font-mono">{p.version}</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm leading-snug mb-1">{p.title}</h3>
                  <p className="text-slate-400 text-xs mb-2">{p.authors}</p>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-3">{p.abstract}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    {p.targetJournal && <span>→ {p.targetJournal}</span>}
                    {p.submissionDate && <span className="font-mono">{p.submissionDate}</span>}
                    {p.ssrnUrl && (
                      <a href={p.ssrnUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:underline">
                        <ExternalLink size={10} /> Preprint
                      </a>
                    )}
                  </div>
                  {p.keywords && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.keywords.split(",").map(k => k.trim()).filter(Boolean).map(k => (
                        <span key={k} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-md border border-slate-700">{k}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(p)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                  <Edit2 size={14} />
                </button>
                {deleteConfirm === p.id ? (
                  <div className="flex gap-1.5">
                    <button onClick={() => deletePaper(p.id)} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-lg border border-slate-700">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(p.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {papers.length === 0 && (
        <div className="text-center py-16">
          <FileText size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No working papers yet.</p>
        </div>
      )}
    </div>
  );
}
