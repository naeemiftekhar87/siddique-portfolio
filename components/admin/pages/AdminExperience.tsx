"use client";

import { useId, useState } from "react";
import { Plus, Pencil, Search, ChevronDown, ChevronUp, Calendar, Briefcase } from "lucide-react";
import type { Experience } from "@/lib/data";
import { deleteExperience, reorderExperiences, saveExperience } from "@/lib/actions/content";
import { ReorderButtons, moveItem } from "@/components/admin/reorder-buttons";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { ImageSourceField } from "@/components/admin/image-source-field";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ListInput } from "@/components/admin/list-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { dateRange } from "@/lib/data/format";

type Exp = Experience;

const emptyExp: Omit<Exp, "id"> = {
  company: "",
  position: "",
  type: "Full-time",
  startDate: "",
  endDate: "",
  location: "",
  description: "",
  responsibilities: [],
  achievements: [],
  skills: [],
  logo: "",
};

const lines = (v: string) => v.split("\n").map((s) => s.trim()).filter(Boolean);

function ExpForm({
  initial,
  onSave,
  onCancel,
  pending }: {
  initial?: Exp;
  onSave: (d: Omit<Exp, "id"> & { id?: number }) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const uid = useId();
  const [f, setF] = useState<Omit<Exp, "id"> & { id?: number }>(initial ?? emptyExp);
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  return (
    <Card variant="admin-panel" className="p-6 mb-6 space-y-4">
      <h3 className="font-serif text-lg text-white">{initial?.company ? "Edit Experience" : "Add Experience"}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {([["position", "Job Title *"], ["company", "Company *"], ["type", "Employment Type"], ["location", "Location"], ["startDate", "Start Date"], ["endDate", "End Date"]] as [keyof Exp, string][]).map(([key, label]) => (
          <div key={key}>
            <Label htmlFor={`${uid}-${key}`} variant="admin-label" className="mb-1">{label}</Label>
            <Input id={`${uid}-${key}`} variant="admin-field"
              value={(f[key] as string) ?? ""}
              onChange={(e) => set(key, e.target.value)}
              className="w-full"
            />
          </div>
        ))}
      </div>
      <div>
        <Label htmlFor={`${uid}-description`} variant="admin-label" className="mb-1">Description</Label>
        <Textarea id={`${uid}-description`} variant="admin-field"
          rows={3}
          value={f.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          className="w-full resize-none"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${uid}-responsibilities-one-per-line`} variant="admin-label" className="mb-1">Responsibilities (one per line)</Label>
          <Textarea id={`${uid}-responsibilities-one-per-line`} variant="admin-field"
            rows={4}
            defaultValue={f.responsibilities.join("\n")}
            onChange={(e) => set("responsibilities", lines(e.target.value))}
            className="w-full resize-none"
          />
        </div>
        <div>
          <Label htmlFor={`${uid}-key-achievements-one-per-line`} variant="admin-label" className="mb-1">Key Achievements (one per line)</Label>
          <Textarea id={`${uid}-key-achievements-one-per-line`} variant="admin-field"
            rows={4}
            defaultValue={f.achievements.join("\n")}
            onChange={(e) => set("achievements", lines(e.target.value))}
            className="w-full resize-none"
          />
        </div>
      </div>
      <div>
        <Label variant="admin-label" className="mb-1">Company Logo</Label>
        <ImageSourceField value={f.logo} onChange={(v) => set("logo", v)} showPreview />
      </div>
      <div>
        <Label htmlFor={`${uid}-skills`} variant="admin-label" className="mb-1">Skills (comma-separated)</Label>
        <ListInput id={`${uid}-skills`} variant="admin-field"
          value={f.skills}
          onChange={(list) => set("skills", list)}
          className="w-full"
          placeholder="Skill 1, Skill 2, Skill 3"
        />
      </div>
      <div className="flex gap-3">
        <Button variant="admin-primary"
          type="button"
          onClick={() => onSave(f)}
          disabled={pending}
          className="px-5 py-2.5 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
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

export default function AdminExperience({ initial }: { initial: Exp[] }) {
  const [exps, setExps] = useState<Exp[]>(initial);
  const { pending, run } = useAction();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = exps.filter(
    (e) =>
      e.company.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: Omit<Exp, "id">) => {
    run(() => saveExperience(data), {
      success: "Experience added.",
      onSuccess: (saved) => {
        setExps((prev) => [saved, ...prev]);
        setShowAdd(false);
      },
    });
  };

  const handleEdit = (id: number, data: Omit<Exp, "id">) => {
    run(() => saveExperience({ ...data, id }), {
      success: "Experience updated.",
      onSuccess: (saved) => {
        setExps((prev) => prev.map((e) => (e.id === id ? saved : e)));
        setEditing(null);
      },
    });
  };

  // Order shown on the public site; arrows are hidden while searching.
  const move = (index: number, delta: -1 | 1) => {
    const previous = exps;
    const next = moveItem(exps, index, delta);
    setExps(next);
    run(() => reorderExperiences(next.map((e) => e.id)), { onError: () => setExps(previous) });
  };

  const handleDelete = (id: number) => {
    run(() => deleteExperience(id), {
      success: "Experience deleted.",
      onSuccess: () => setExps((prev) => prev.filter((x) => x.id !== id)),
    });
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

      {showAdd && <ExpForm onSave={handleAdd} onCancel={() => setShowAdd(false)} pending={pending} />}

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
        {filtered.map((exp, index) => (
          <Card variant="admin-panel" key={exp.id}>
            {editing === exp.id ? (
              <div className="p-6">
                <ExpForm
                  initial={exp}
                  onSave={(data) => handleEdit(exp.id, data)}
                  onCancel={() => setEditing(null)}
                  pending={pending}
                />
              </div>
            ) : (
              <>
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer"
                  onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                >
                  {!search && <ReorderButtons index={index} count={exps.length} label={exp.position} disabled={pending} onMove={(d) => move(index, d)} />}
                  {exp.logo ? (
                    <img loading="lazy" decoding="async" src={exp.logo} alt={exp.company} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0"><Briefcase size={16} className="text-slate-600" /></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 font-medium text-sm">{exp.position}</p>
                    <div className="flex gap-3 text-slate-500 text-xs mt-0.5">
                      <span>{exp.company}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {dateRange(exp.startDate, exp.endDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="admin-icon-edit" aria-label={`Edit ${exp.position}`}
                      onClick={(e) => { e.stopPropagation(); setEditing(exp.id); }}
                      
>
                      <Pencil size={14} />
                    </Button>
                    <ConfirmDelete label={exp.position} pending={pending} onConfirm={() => handleDelete(exp.id)} />
                    <Button variant="admin-ghost" type="button" aria-expanded={expanded === exp.id}
                      aria-label={`${expanded === exp.id ? "Collapse" : "Expand"} ${exp.position}`}
                      onClick={(e) => { e.stopPropagation(); setExpanded(expanded === exp.id ? null : exp.id); }}>
                      {expanded === exp.id ? <ChevronUp size={15} className="text-slate-500" /> : <ChevronDown size={15} className="text-slate-500" />}
                    </Button>
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
