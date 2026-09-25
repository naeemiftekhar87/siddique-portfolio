"use client";

import { useId, useState } from "react";
import { Plus, Pencil, Search, ChevronDown, ChevronUp, GraduationCap } from "lucide-react";
import { educationStatuses, type Education } from "@/lib/data";
import { deleteEducation, reorderEducation, saveEducation } from "@/lib/actions/content";
import { ReorderButtons, moveItem } from "@/components/admin/reorder-buttons";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { ImageSourceField } from "@/components/admin/image-source-field";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { dateRange } from "@/lib/data/format";

type Edu = Education;
type EduInput = Omit<Edu, "id"> & { id?: number };

const emptyEdu: EduInput = {
  university: "", degree: "", major: "", startDate: "", endDate: "",
  status: "In Progress", gpa: "", description: "", coursework: [], skills: [], logo: "",
};

function EduForm({ initial, onSave, onCancel, pending }: { initial?: Edu; onSave: (d: EduInput) => void; onCancel: () => void; pending: boolean }) {
  const uid = useId();
  const [f, setF] = useState<EduInput>(initial ?? emptyEdu);
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  return (
    <Card variant="admin-panel" className="p-6 mb-4 space-y-4">
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
            <Label htmlFor={`${uid}-${key}`} variant="admin-label" className="mb-1">{label}</Label>
            <Input id={`${uid}-${key}`} variant="admin-field"
              value={(f[key] as string) ?? ""}
              onChange={(e) => set(key, e.target.value)}
              className="w-full"
            />
          </div>
        ))}
        <div>
          <Label htmlFor={`${uid}-status`} variant="admin-label" className="mb-1">Status</Label>
          <NativeSelect id={`${uid}-status`} variant="admin-field"
            value={f.status ?? "In Progress"}
            onChange={(e) => set("status", e.target.value)}
            className="w-full"
          >
            {educationStatuses.map((st) => <option key={st}>{st}</option>)}
          </NativeSelect>
        </div>
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
          <Label htmlFor={`${uid}-coursework-comma-separated`} variant="admin-label" className="mb-1">Coursework (comma-separated)</Label>
          <Input id={`${uid}-coursework-comma-separated`} variant="admin-field"
            value={Array.isArray(f.coursework) ? f.coursework.join(", ") : ""}
            onChange={(e) => set("coursework", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className="w-full"
            placeholder="Course 1, Course 2, Course 3"
          />
        </div>
        <div>
          <Label htmlFor={`${uid}-skills-gained-comma-separated`} variant="admin-label" className="mb-1">Skills Gained (comma-separated)</Label>
          <Input id={`${uid}-skills-gained-comma-separated`} variant="admin-field"
            value={Array.isArray(f.skills) ? f.skills.join(", ") : ""}
            onChange={(e) => set("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className="w-full"
            placeholder="Skill 1, Skill 2"
          />
        </div>
      </div>
      <div>
        <Label variant="admin-label" className="mb-1">Institution Logo</Label>
        <ImageSourceField value={f.logo} onChange={(v) => set("logo", v)} showPreview />
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="admin-primary" type="button" onClick={() => onSave(f)} disabled={pending} className="px-5 py-2.5 disabled:opacity-50">{pending ? "Saving…" : "Save"}</Button>
        <Button variant="admin-secondary" type="button" onClick={onCancel} className="px-5 py-2.5">Cancel</Button>
      </div>
    </Card>
  );
}

export default function AdminEducation({ initial }: { initial: Edu[] }) {
  const [list, setList] = useState<Edu[]>(initial);
  const { pending, run } = useAction();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = list.filter(
    (e) =>
      e.university.toLowerCase().includes(search.toLowerCase()) ||
      e.degree.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: EduInput) => {
    run(() => saveEducation(data), {
      success: "Education added.",
      onSuccess: (saved) => {
        setList((prev) => [saved, ...prev]);
        setShowAdd(false);
      },
    });
  };

  const handleEdit = (id: number, data: EduInput) => {
    run(() => saveEducation({ ...data, id }), {
      success: "Education updated.",
      onSuccess: (saved) => {
        setList((prev) => prev.map((e) => (e.id === id ? saved : e)));
        setEditing(null);
      },
    });
  };

  // Order shown on the public site; arrows are hidden while searching.
  const move = (index: number, delta: -1 | 1) => {
    const previous = list;
    const next = moveItem(list, index, delta);
    setList(next);
    run(() => reorderEducation(next.map((e) => e.id)), { onError: () => setList(previous) });
  };

  const handleDelete = (id: number) => {
    run(() => deleteEducation(id), {
      success: "Education deleted.",
      onSuccess: () => setList((prev) => prev.filter((x) => x.id !== id)),
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Education Manager</h1>
          <p className="text-slate-400 text-sm">{list.length} education entries</p>
        </div>
        <Button variant="admin-primary"
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5"
        >
          <Plus size={16} /> Add Education
        </Button>
      </div>

      {showAdd && <EduForm onSave={handleAdd} onCancel={() => setShowAdd(false)} pending={pending} />}

      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <Input variant="admin-field-dark"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search education..."
          className="w-full pl-9 pr-4 py-2.5"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <GraduationCap size={36} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">{list.length === 0 ? "No education entries yet." : "No education entries match your filters."}</p>
          </div>
        )}
        {filtered.map((edu, index) => (
          <Card variant="admin-panel" key={edu.id} className="overflow-hidden">
            {editing === edu.id ? (
              <div className="p-6">
                <EduForm initial={edu} onSave={(d) => handleEdit(edu.id, d)} onCancel={() => setEditing(null)} pending={pending} />
              </div>
            ) : (
              <>
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-800/30 transition-colors"
                  onClick={() => setExpanded(expanded === edu.id ? null : edu.id)}
                >
                  {!search && <ReorderButtons index={index} count={list.length} label={edu.degree} disabled={pending} onMove={(d) => move(index, d)} />}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${edu.status === "In Progress" ? "bg-blue-600" : "bg-teal-700"}`}>
                    <GraduationCap size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 font-medium text-sm">{edu.degree}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{edu.university}</p>
                    <p className="text-slate-500 text-xs mt-0.5 font-mono">{dateRange(edu.startDate, edu.endDate)} · {edu.major}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs border font-medium ${edu.status === "In Progress" ? "bg-blue-900/40 text-blue-400 border-blue-800" : "bg-green-900/40 text-green-400 border-green-800"}`}>
                      {edu.status}
                    </span>
                    <Button variant="admin-icon-edit" aria-label={`Edit ${edu.degree}`}
                      onClick={(e) => { e.stopPropagation(); setEditing(edu.id); }}
                      
>
                      <Pencil size={14} />
                    </Button>
                    <ConfirmDelete label={edu.degree} pending={pending} onConfirm={() => handleDelete(edu.id)} />
                    <Button variant="admin-ghost" type="button" aria-expanded={expanded === edu.id}
                      aria-label={`${expanded === edu.id ? "Collapse" : "Expand"} ${edu.degree}`}
                      onClick={(e) => { e.stopPropagation(); setExpanded(expanded === edu.id ? null : edu.id); }}>
                      {expanded === edu.id ? <ChevronUp size={15} className="text-slate-500" /> : <ChevronDown size={15} className="text-slate-500" />}
                    </Button>
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
          </Card>
        ))}
      </div>
    </div>
  );
}
