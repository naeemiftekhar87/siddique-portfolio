"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Microscope, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

type Topic = {
  id: number;
  title: string;
  area: string;
  status: string;
  question: string;
  contribution: string;
  methodology: string;
  keywords: string;
  expectedYear: string;
};

const AREAS = ["Research Area A", "Research Area B", "Research Area C", "Research Area D", "Research Area E"];
const STATUSES = ["Idea", "Conceptualized", "Literature Review", "Data Collection", "In Progress"];

const statusColors: Record<string, string> = {
  Idea:               "bg-violet-900/40 text-violet-400 border-violet-800",
  Conceptualized:     "bg-blue-900/40 text-blue-400 border-blue-800",
  "Literature Review":"bg-teal-900/40 text-teal-400 border-teal-800",
  "Data Collection":  "bg-amber-900/40 text-amber-400 border-amber-800",
  "In Progress":      "bg-green-900/40 text-green-400 border-green-800",
};

const initialTopics: Topic[] = [];

const emptyTopic: Omit<Topic, "id"> = {
  title: "", area: "Research Area A", status: "Idea",
  question: "", contribution: "", methodology: "", keywords: "", expectedYear: "",
};

export default function AdminResearchUpcoming() {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const startNew = () => { setEditing({ id: Date.now(), ...emptyTopic }); setIsNew(true); };
  const startEdit = (t: Topic) => { setEditing({ ...t }); setIsNew(false); setExpanded(null); };
  const cancelEdit = () => { setEditing(null); setIsNew(false); };

  const saveEdit = () => {
    if (!editing) return;
    if (isNew) setTopics(prev => [editing, ...prev]);
    else setTopics(prev => prev.map(t => t.id === editing.id ? editing : t));
    setEditing(null); setIsNew(false);
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const deleteTopic = (id: number) => { setTopics(prev => prev.filter(t => t.id !== id)); setDeleteConfirm(null); };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Upcoming Research</h1>
          <p className="text-slate-400 text-sm">Manage research topics in the pipeline</p>
        </div>
        <Button variant="admin-primary" onClick={startNew} className="flex items-center gap-2 px-5 py-2.5">
          <Plus size={15} /> Add Topic
        </Button>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Topic saved successfully.
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="bg-slate-900 rounded-2xl border border-blue-800/60 p-6 space-y-4">
          <h2 className="font-serif text-lg text-white">{isNew ? "Add Research Topic" : "Edit Topic"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label variant="admin-label" className="mb-1.5">Title</Label>
              <Input variant="admin-field" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })}
                placeholder="Research topic title"
                className="w-full" />
            </div>
            <div>
              <Label variant="admin-label" className="mb-1.5">Research Area</Label>
              <NativeSelect variant="admin-field" value={editing.area} onChange={e => setEditing({ ...editing, area: e.target.value })}
                className="w-full">
                {AREAS.map(a => <option key={a}>{a}</option>)}
              </NativeSelect>
            </div>
            <div>
              <Label variant="admin-label" className="mb-1.5">Status</Label>
              <NativeSelect variant="admin-field" value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}
                className="w-full">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </NativeSelect>
            </div>
            <div>
              <Label variant="admin-label" className="mb-1.5">Expected Year</Label>
              <Input variant="admin-field" value={editing.expectedYear} onChange={e => setEditing({ ...editing, expectedYear: e.target.value })}
                placeholder="2027"
                className="w-full" />
            </div>
            <div className="sm:col-span-2">
              <Label variant="admin-label" className="mb-1.5">Research Question</Label>
              <Textarea variant="admin-field" rows={2} value={editing.question} onChange={e => setEditing({ ...editing, question: e.target.value })}
                placeholder="Core research question…"
                className="w-full resize-none" />
            </div>
            <div>
              <Label variant="admin-label" className="mb-1.5">Expected Contribution</Label>
              <Textarea variant="admin-field" rows={3} value={editing.contribution} onChange={e => setEditing({ ...editing, contribution: e.target.value })}
                placeholder="What this research will contribute…"
                className="w-full resize-none" />
            </div>
            <div>
              <Label variant="admin-label" className="mb-1.5">Methodology</Label>
              <Textarea variant="admin-field" rows={3} value={editing.methodology} onChange={e => setEditing({ ...editing, methodology: e.target.value })}
                placeholder="Research methods and approach…"
                className="w-full resize-none" />
            </div>
            <div className="sm:col-span-2">
              <Label variant="admin-label" className="mb-1.5">Keywords (comma-separated)</Label>
              <Input variant="admin-field" value={editing.keywords} onChange={e => setEditing({ ...editing, keywords: e.target.value })}
                placeholder="Keyword 1, Keyword 2, Keyword 3"
                className="w-full" />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="admin-primary" onClick={saveEdit} className="flex items-center gap-2 px-5 py-2.5">
              <Save size={14} /> Save
            </Button>
            <Button variant="admin-outline" onClick={cancelEdit} className="flex items-center gap-2 px-5 py-2.5">
              <X size={14} /> Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Topics list */}
      <div className="space-y-3">
        {topics.map(t => {
          const isOpen = expanded === t.id;
          return (
            <Card variant="admin-panel" key={t.id} className="overflow-hidden hover:border-slate-700 transition-all">
              <div className="flex items-start gap-4 p-5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Microscope size={15} className="text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${statusColors[t.status] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}>
                      {t.status}
                    </span>
                    <span className="text-slate-500 text-xs bg-slate-800 px-2.5 py-0.5 rounded-full">{t.area}</span>
                    {t.expectedYear && <span className="text-slate-600 text-xs font-mono">Est. {t.expectedYear}</span>}
                  </div>
                  <h3 className="text-white font-semibold text-sm leading-snug">{t.title}</h3>
                  {!isOpen && <p className="text-slate-500 text-xs mt-1 line-clamp-1">{t.question}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="admin-ghost" onClick={() => startEdit(t)}>
                    <Edit2 size={13} />
                  </Button>
                  {deleteConfirm === t.id ? (
                    <div className="flex gap-1.5">
                      <Button variant="admin-danger-sm" onClick={() => deleteTopic(t.id)}>Confirm</Button>
                      <Button variant="unstyled" onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-lg border border-slate-700">Cancel</Button>
                    </div>
                  ) : (
                    <Button variant="admin-ghost-danger" onClick={() => setDeleteConfirm(t.id)}>
                      <Trash2 size={13} />
                    </Button>
                  )}
                  <Button variant="admin-ghost" onClick={() => setExpanded(isOpen ? null : t.id)}>
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </Button>
                </div>
              </div>
              {isOpen && (
                <div className="border-t border-slate-800 bg-slate-950/40 px-5 py-4 space-y-3">
                  <div><p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Research Question</p><p className="text-slate-300 text-sm">{t.question}</p></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Contribution</p><p className="text-slate-300 text-sm">{t.contribution}</p></div>
                    <div><p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Methodology</p><p className="text-slate-300 text-sm">{t.methodology}</p></div>
                  </div>
                  {t.keywords && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {t.keywords.split(",").map(k => k.trim()).filter(Boolean).map(k => (
                        <span key={k} className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg border border-slate-700">{k}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {topics.length === 0 && (
        <div className="text-center py-16">
          <Microscope size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No upcoming topics yet.</p>
        </div>
      )}
    </div>
  );
}
