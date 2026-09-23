"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, ChevronDown, ChevronUp, Calendar, Briefcase } from "lucide-react";
import type { experiences as initialExps } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
    <Card variant="admin-panel" className="p-6 mb-6 space-y-4">
      <h3 className="font-serif text-lg text-white">{initial?.company ? "Edit Experience" : "Add Experience"}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {([["position", "Job Title *"], ["company", "Company *"], ["type", "Employment Type"], ["location", "Location"], ["startDate", "Start Date"], ["endDate", "End Date"]] as [keyof Exp, string][]).map(([key, label]) => (
          <div key={key}>
            <Label variant="admin-label" className="mb-1">{label}</Label>
            <Input variant="admin-field"
              value={(f[key] as string) ?? ""}
              onChange={(e) => set(key, e.target.value)}
              className="w-full"
            />
          </div>
        ))}
      </div>
      <div>
        <Label variant="admin-label" className="mb-1">Description</Label>
        <Textarea variant="admin-field"
          rows={3}
          value={f.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          className="w-full resize-none"
        />
      </div>
      <div>
        <Label variant="admin-label" className="mb-1">Skills (comma-separated)</Label>
        <Input variant="admin-field"
          value={Array.isArray(f.skills) ? f.skills.join(", ") : ""}
          onChange={(e) => set("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          className="w-full"
          placeholder="Skill 1, Skill 2, Skill 3"
        />
      </div>
      <div className="flex gap-3">
        <Button variant="admin-primary"
          type="button"
          onClick={() => onSave(f)}
          className="px-5 py-2.5"
        >
          Save
        </Button>
        <Button variant="admin-secondary"
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5"
        >
          Cancel
        </Button>
      </div>
    </Card>
  );
}

export default function AdminExperience() {
  const [exps, setExps] = useState<(typeof initialExps)[number][]>([]);
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
        <Button variant="admin-primary"
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5"
        >
          <Plus size={16} /> Add Experience
        </Button>
      </div>

      {showAdd && <ExpForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />}

      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <Input variant="admin-field-dark"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search experience..."
          className="w-full pl-9 pr-4 py-2.5"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Briefcase size={36} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">{exps.length === 0 ? "No experience entries yet." : "No experience entries match your filters."}</p>
          </div>
        )}
        {filtered.map((exp) => (
          <Card variant="admin-panel" key={exp.id}>
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
                    <Button variant="admin-icon-edit"
                      onClick={(e) => { e.stopPropagation(); setEditing(exp.id); }}
                      
>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="admin-icon-danger"
                      onClick={(e) => { e.stopPropagation(); setExps((prev) => prev.filter((x) => x.id !== exp.id)); }}
                      
>
                      <Trash2 size={14} />
                    </Button>
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
          </Card>
        ))}
      </div>
    </div>
  );
}
