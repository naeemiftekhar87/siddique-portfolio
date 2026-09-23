"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { experiences as initialExps } from "@/lib/data";

type Exp = typeof initialExps[0];

function ExpForm({
  initial,
  onSave,
  onCancel }: {
  initial?: Partial<Exp>;
  onSave: (d: Partial<Exp>) => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState<Partial<Exp>>(
    initial ?? {
      company: "",
      position: "",
      type: "Full-time",
      startDate: "",
      endDate: "",
      location: "",
      description: "",
      responsibilities: [],
      achievements: [],
      skills: [] }
  );
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6 space-y-4">
      <h3 className="font-serif text-lg text-white">{initial?.company ? "Edit Experience" : "Add Experience"}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {([["position", "Job Title *"], ["company", "Company *"], ["type", "Employment Type"], ["location", "Location"], ["startDate", "Start Date"], ["endDate", "End Date"]] as [keyof Exp, string][]).map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs text-slate-400 mb-1">{label}</label>
            <input
              value={(f[key] as string) ?? ""}
              onChange={(e) => set(key, e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Description</label>
        <textarea
          rows={3}
          value={f.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Skills (comma-separated)</label>
        <input
          value={Array.isArray(f.skills) ? f.skills.join(", ") : ""}
          onChange={(e) => set("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          placeholder="Skill 1, Skill 2, Skill 3"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onSave(f)}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminExperience() {
  const [exps, setExps] = useState(initialExps);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = exps.filter(
    (e) =>
      e.company.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: Partial<typeof initialExps[0]>) => {
    setExps((prev) => [{ id: Date.now(), logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&h=80&fit=crop", responsibilities: [], achievements: [], ...data } as (typeof prev)[number], ...prev]);
    setShowAdd(false);
  };

  const handleEdit = (id: number, data: Partial<typeof initialExps[0]>) => {
    setExps((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
    setEditing(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Experience Manager</h1>
          <p className="text-slate-400 text-sm">{exps.length} experience entries</p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {showAdd && <ExpForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />}

      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search experience..."
          className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((exp) => (
          <div key={exp.id} className="bg-slate-900 rounded-2xl border border-slate-800">
            {editing === exp.id ? (
              <div className="p-6">
                <ExpForm
                  initial={exp}
                  onSave={(data) => handleEdit(exp.id, data)}
                  onCancel={() => setEditing(null)}
                />
              </div>
            ) : (
              <>
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer"
                  onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                >
                  <img src={exp.logo} alt={exp.company} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 font-medium text-sm">{exp.position}</p>
                    <div className="flex gap-3 text-slate-500 text-xs mt-0.5">
                      <span>{exp.company}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {exp.startDate} – {exp.endDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditing(exp.id); }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-950/30 transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setExps((prev) => prev.filter((x) => x.id !== exp.id)); }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                    {expanded === exp.id ? <ChevronUp size={15} className="text-slate-500" /> : <ChevronDown size={15} className="text-slate-500" />}
                  </div>
                </div>
                {expanded === exp.id && (
                  <div className="px-5 pb-5 border-t border-slate-800 pt-4 space-y-3">
                    <p className="text-slate-400 text-sm">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((s) => (
                        <span key={s} className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
