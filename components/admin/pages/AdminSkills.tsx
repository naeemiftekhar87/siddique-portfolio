"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { skillCategories, type skills as initialSkills } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Skill = typeof initialSkills[0];

export default function AdminSkills() {
  const [skillsList, setSkillsList] = useState<(typeof initialSkills)[number][]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [editing, setEditing] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", category: "INDUSTRY KNOWLEDGE", level: 80 });
  const [editForm, setEditForm] = useState<Partial<Skill>>({});

  const filtered = skillsList.filter((s) => {
    const matchCat = filter === "ALL" || s.category === filter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = () => {
    if (!addForm.name.trim()) return;
    setSkillsList((prev) => [...prev, { id: Date.now(), ...addForm }]);
    setAddForm({ name: "", category: "INDUSTRY KNOWLEDGE", level: 80 });
    setShowAdd(false);
  };

  const handleEdit = (id: number) => {
    setSkillsList((prev) => prev.map((s) => (s.id === id ? { ...s, ...editForm } : s)));
    setEditing(null);
  };

  const startEdit = (skill: Skill) => {
    setEditing(skill.id);
    setEditForm({ name: skill.name, category: skill.category, level: skill.level });
  };

  const cats = skillCategories.filter((c) => c !== "ALL");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Skills Manager</h1>
          <p className="text-slate-400 text-sm">{skillsList.length} skills</p>
        </div>
        <Button variant="admin-primary" onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5">
          <Plus size={16} /> Add Skill
        </Button>
      </div>

      {showAdd && (
        <Card variant="admin-panel" className="p-5 mb-6 space-y-4">
          <h3 className="font-serif text-lg text-white">Add Skill</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label variant="admin-label" className="mb-1">Skill Name *</Label>
              <Input variant="admin-field" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                className="w-full" />
            </div>
            <div>
              <Label variant="admin-label" className="mb-1">Category</Label>
              <NativeSelect variant="admin-field" value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                className="w-full">
                {cats.map((c) => <option key={c}>{c}</option>)}
              </NativeSelect>
            </div>
            <div>
              <Label variant="admin-label" className="mb-1">Proficiency ({addForm.level}%)</Label>
              <Input variant="unstyled" type="range" min={10} max={100} value={addForm.level}
                onChange={(e) => setAddForm({ ...addForm, level: Number(e.target.value) })}
                className="w-full mt-2 accent-blue-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="admin-primary" type="button" onClick={handleAdd} className="px-5 py-2.5">Add</Button>
            <Button variant="admin-secondary" type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5">Cancel</Button>
          </div>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input variant="admin-field-dark" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search skills..."
            className="w-full pl-9 pr-4 py-2.5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {skillCategories.map((cat) => (
            <Button variant="unstyled" key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${filter === cat ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"}`}>
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <Card variant="admin-panel" className="overflow-hidden">
        <Table variant="unstyled" className="w-full">
          <TableHeader variant="unstyled">
            <TableRow variant="unstyled" className="border-b border-slate-800">
              <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Skill</TableHead>
              <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Category</TableHead>
              <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Level</TableHead>
              <TableHead variant="unstyled" className="text-right px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody variant="unstyled" className="divide-y divide-slate-800">
            {filtered.length === 0 && (
              <TableRow variant="unstyled">
                <TableCell variant="unstyled" colSpan={5} className="text-center py-16 text-slate-500 text-sm">
                  {skillsList.length === 0 ? "No skills yet." : "No skills match your filters."}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((skill) => (
              <TableRow variant="unstyled" key={skill.id} className="hover:bg-slate-800/50 transition-colors">
                <TableCell variant="unstyled" className="px-5 py-3.5">
                  {editing === skill.id ? (
                    <Input variant="unstyled" value={(editForm.name ?? skill.name)} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-blue-500 w-36" />
                  ) : (
                    <span className="text-slate-200 text-sm font-medium">{skill.name}</span>
                  )}
                </TableCell>
                <TableCell variant="unstyled" className="px-5 py-3.5 hidden sm:table-cell">
                  {editing === skill.id ? (
                    <NativeSelect variant="unstyled" value={editForm.category ?? skill.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="px-2 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-blue-500">
                      {cats.map((c) => <option key={c}>{c}</option>)}
                    </NativeSelect>
                  ) : (
                    <span className="text-slate-500 text-xs">{skill.category}</span>
                  )}
                </TableCell>
                <TableCell variant="unstyled" className="px-5 py-3.5">
                  {editing === skill.id ? (
                    <div className="flex items-center gap-2">
                      <Input variant="unstyled" type="range" min={10} max={100} value={editForm.level ?? skill.level}
                        onChange={(e) => setEditForm({ ...editForm, level: Number(e.target.value) })}
                        className="w-24 accent-blue-500" />
                      <span className="text-slate-400 text-xs font-mono w-8">{editForm.level ?? skill.level}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full" style={{ width: `${skill.level}%` }} />
                      </div>
                      <span className="text-slate-400 text-xs font-mono">{skill.level}%</span>
                    </div>
                  )}
                </TableCell>
                <TableCell variant="unstyled" className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    {editing === skill.id ? (
                      <>
                        <Button variant="unstyled" onClick={() => handleEdit(skill.id)} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">Save</Button>
                        <Button variant="unstyled" onClick={() => setEditing(null)} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700 transition-colors">Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="admin-icon-edit" onClick={() => startEdit(skill)}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="admin-icon-danger" onClick={() => setSkillsList((prev) => prev.filter((s) => s.id !== skill.id))}
>
                          <Trash2 size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
