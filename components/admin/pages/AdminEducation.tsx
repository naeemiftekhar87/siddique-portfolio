"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, ChevronDown, ChevronUp, GraduationCap } from "lucide-react";
import { education as initialEdu } from "@/lib/data";

type Edu = typeof initialEdu[0];

function EduForm({ initial, onSave, onCancel }: { initial?: Partial<Edu>; onSave: (d: Partial<Edu>) => void; onCancel: () => void }) {
  const [f, setF] = useState<Partial<Edu>>(
    initial ?? {
      university: "", degree: "", major: "", startDate: "", endDate: "",
      status: "In Progress", gpa: "", description: "", coursework: [], skills: [],
    }
  );
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-4 space-y-4">
      <h3 className="font-serif text-lg text-white">{initial?.university ? "Edit Education" : "Add Education"}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {([
          ["university", "University / Institution *"],
          ["degree", "Degree *"],
          ["major", "Major / Field of Study"],
          ["gpa", "GPA / CGPA"],
          ["startDate", "Start Date"],
          ["endDate", "End Date"],
        ] as [keyof Edu, string][]).map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs text-slate-400 mb-1">{label}</label>
            <input
              value={(f[key] as string) ?? ""}
              onChange={(e) => set(key, e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Status</label>
          <select
            value={f.status ?? "In Progress"}
            onChange={(e) => set("status", e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          >
            <option>In Progress</option>
            <option>Completed</option>
            <option>On Hold</option>
          </select>
        </div>
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
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Coursework (comma-separated)</label>
          <input
            value={Array.isArray(f.coursework) ? f.coursework.join(", ") : ""}
            onChange={(e) => set("coursework", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
            placeholder="Course 1, Course 2, Course 3"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Skills Gained (comma-separated)</label>
          <input
            value={Array.isArray(f.skills) ? f.skills.join(", ") : ""}
            onChange={(e) => set("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
            placeholder="Skill 1, Skill 2"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => onSave(f)} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">Save</button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

export default function AdminEducation() {
  const [list, setList] = useState(initialEdu);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = list.filter(
    (e) =>
      e.university.toLowerCase().includes(search.toLowerCase()) ||
      e.degree.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: Partial<Edu>) => {
    setList((prev) => [{ id: Date.now(), logo: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=80&h=80&fit=crop", coursework: [], skills: [], ...data } as (typeof prev)[number], ...prev]);
    setShowAdd(false);
  };

  const handleEdit = (id: number, data: Partial<Edu>) => {
    setList((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
    setEditing(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Education Manager</h1>
          <p className="text-slate-400 text-sm">{list.length} education entries</p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add Education
        </button>
      </div>

      {showAdd && <EduForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />}

      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search education..."
          className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((edu) => (
          <div key={edu.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            {editing === edu.id ? (
              <div className="p-6">
                <EduForm initial={edu} onSave={(d) => handleEdit(edu.id, d)} onCancel={() => setEditing(null)} />
              </div>
            ) : (
              <>
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-800/30 transition-colors"
                  onClick={() => setExpanded(expanded === edu.id ? null : edu.id)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${edu.status === "In Progress" ? "bg-blue-600" : "bg-teal-700"}`}>
                    <GraduationCap size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 font-medium text-sm">{edu.degree}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{edu.university}</p>
                    <p className="text-slate-500 text-xs mt-0.5 font-mono">{edu.startDate} – {edu.endDate} · {edu.major}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs border font-medium ${edu.status === "In Progress" ? "bg-blue-900/40 text-blue-400 border-blue-800" : "bg-green-900/40 text-green-400 border-green-800"}`}>
                      {edu.status}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditing(edu.id); }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-950/30 transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setList((prev) => prev.filter((x) => x.id !== edu.id)); }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                    {expanded === edu.id ? <ChevronUp size={15} className="text-slate-500" /> : <ChevronDown size={15} className="text-slate-500" />}
                  </div>
                </div>
                {expanded === edu.id && (
                  <div className="px-5 pb-5 border-t border-slate-800 pt-4 space-y-3">
                    <p className="text-slate-400 text-sm leading-relaxed">{edu.description}</p>
                    {edu.coursework.length > 0 && (
                      <div>
                        <p className="text-slate-500 text-xs mb-2">Coursework</p>
                        <div className="flex flex-wrap gap-2">
                          {edu.coursework.map((c) => (
                            <span key={c} className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {edu.skills.length > 0 && (
                      <div>
                        <p className="text-slate-500 text-xs mb-2">Skills Gained</p>
                        <div className="flex flex-wrap gap-2">
                          {edu.skills.map((s) => (
                            <span key={s} className="px-2.5 py-1 bg-teal-950/40 text-teal-400 text-xs rounded-lg border border-teal-900/50">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
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
