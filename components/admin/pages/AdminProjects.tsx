"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, ExternalLink, ChevronDown, ChevronUp, Tag } from "lucide-react";
import type { projects as initialProjects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { ImageSourceField } from "@/components/admin/image-source-field";

type Project = typeof initialProjects[0];

const categories = ["Sample Category A", "Sample Category B", "Sample Category C", "Sample Category D", "Other"];
const statuses = ["Completed", "Research", "In Progress", "Planned", "On Hold"];

const statusColors: Record<string, string> = {
  Completed: "bg-green-900/40 text-green-400 border-green-800",
  Research: "bg-blue-900/40 text-blue-400 border-blue-800",
  "In Progress": "bg-amber-900/40 text-amber-400 border-amber-800",
  Planned: "bg-violet-900/40 text-violet-400 border-violet-800",
  "On Hold": "bg-slate-800 text-slate-400 border-slate-700",
};

const categoryColors: Record<string, string> = {
  "Sample Category A": "bg-teal-900/30 text-teal-400",
  "Sample Category B": "bg-blue-900/30 text-blue-400",
  "Sample Category C": "bg-violet-900/30 text-violet-400",
  "Sample Category D": "bg-amber-900/30 text-amber-400",
  Other: "bg-slate-800 text-slate-400",
};

function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Project>;
  onSave: (d: Partial<Project>) => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState<Partial<Project>>(
    initial ?? {
      title: "",
      category: "Sample Category A",
      shortDescription: "",
      description: "",
      technologies: [],
      tools: [],
      image: "",
      problem: "",
      objective: "",
      methodology: "",
      results: "",
      status: "Completed",
    }
  );
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-slate-900 rounded-2xl border border-blue-800/40 p-6 mb-6 space-y-4">
      <h3 className="font-serif text-xl text-white">{initial?.title ? "Edit Project" : "Add Project"}</h3>

      {/* Basic info */}
      <div>
        <Label variant="admin-label" className="mb-1">Project Title *</Label>
        <Input variant="admin-field"
          value={f.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Sample Project Title"
          className="w-full"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label variant="admin-label" className="mb-1">Category</Label>
          <NativeSelect variant="admin-field"
            value={f.category ?? "Sample Category A"}
            onChange={(e) => set("category", e.target.value)}
            className="w-full"
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </NativeSelect>
        </div>
        <div>
          <Label variant="admin-label" className="mb-1">Status</Label>
          <NativeSelect variant="admin-field"
            value={f.status ?? "Completed"}
            onChange={(e) => set("status", e.target.value)}
            className="w-full"
          >
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </NativeSelect>
        </div>
      </div>

      <div>
        <Label variant="admin-label" className="mb-1">Short Description</Label>
        <Textarea variant="admin-field"
          rows={2}
          value={f.shortDescription ?? ""}
          onChange={(e) => set("shortDescription", e.target.value)}
          className="w-full resize-none"
        />
      </div>

      <div>
        <Label variant="admin-label" className="mb-1">Full Description</Label>
        <Textarea variant="admin-field"
          rows={4}
          value={f.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          className="w-full resize-none"
        />
      </div>

      {/* Cover image */}
      <div>
        <Label variant="admin-label" className="mb-1">Cover Image</Label>
        <ImageSourceField value={f.image ?? ""} onChange={(v) => set("image", v)} showPreview />
      </div>

      {/* Research detail fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label variant="admin-label" className="mb-1">Problem Statement</Label>
          <Textarea variant="admin-field"
            rows={2}
            value={f.problem ?? ""}
            onChange={(e) => set("problem", e.target.value)}
            className="w-full resize-none"
          />
        </div>
        <div>
          <Label variant="admin-label" className="mb-1">Objective</Label>
          <Textarea variant="admin-field"
            rows={2}
            value={f.objective ?? ""}
            onChange={(e) => set("objective", e.target.value)}
            className="w-full resize-none"
          />
        </div>
        <div>
          <Label variant="admin-label" className="mb-1">Methodology</Label>
          <Textarea variant="admin-field"
            rows={2}
            value={f.methodology ?? ""}
            onChange={(e) => set("methodology", e.target.value)}
            className="w-full resize-none"
          />
        </div>
        <div>
          <Label variant="admin-label" className="mb-1">Results / Outcomes</Label>
          <Textarea variant="admin-field"
            rows={2}
            value={f.results ?? ""}
            onChange={(e) => set("results", e.target.value)}
            className="w-full resize-none"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label variant="admin-label" className="mb-1">Technologies (comma-separated)</Label>
          <Input variant="admin-field"
            value={Array.isArray(f.technologies) ? f.technologies.join(", ") : ""}
            onChange={(e) => set("technologies", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            placeholder="Tool 1, Tool 2, Tool 3"
            className="w-full"
          />
        </div>
        <div>
          <Label variant="admin-label" className="mb-1">Tools (comma-separated)</Label>
          <Input variant="admin-field"
            value={Array.isArray(f.tools) ? f.tools.join(", ") : ""}
            onChange={(e) => set("tools", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            placeholder="VS Code, Jupyter, dbt"
            className="w-full"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="admin-primary"
          type="button"
          onClick={() => onSave(f)}
          className="px-5 py-2.5"
        >
          Save Project
        </Button>
        <Button variant="admin-secondary"
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q);
    const matchCat = catFilter === "All" || p.category === catFilter;
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const handleAdd = (data: Partial<Project>) => {
    setProjects((prev) => [
      { id: Date.now(), ...data } as Project,
      ...prev,
    ]);
    setShowAdd(false);
  };

  const handleEdit = (id: number, data: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    setEditing(null);
  };

  const allCats = Array.from(new Set(projects.map((p) => p.category)));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Portfolio Projects</h1>
          <p className="text-slate-400 text-sm">{projects.length} projects</p>
        </div>
        <Button variant="admin-primary"
          onClick={() => { setShowAdd((v) => !v); setEditing(null); }}
          className="flex items-center gap-2 px-4 py-2.5"
        >
          <Plus size={16} /> Add Project
        </Button>
      </div>

      {showAdd && <ProjectForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative max-w-xs flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input variant="admin-field-dark"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2.5"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...allCats].map((c) => (
            <Button variant="unstyled"
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${catFilter === c ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"}`}
            >
              {c}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...statuses].map((s) => (
            <Button variant="unstyled"
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${statusFilter === s ? "bg-teal-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"}`}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Project cards */}
      <div className="space-y-3">
        {filtered.map((project) => {
          const isExpanded = expanded === project.id;
          const statusStyle = statusColors[project.status] ?? "bg-slate-800 text-slate-400 border-slate-700";
          const catStyle = categoryColors[project.category] ?? "bg-slate-800 text-slate-400";

          return (
            <Card variant="admin-panel" key={project.id} className="overflow-hidden">
              {editing === project.id ? (
                <div className="p-6">
                  <ProjectForm
                    initial={project}
                    onSave={(d) => handleEdit(project.id, d)}
                    onCancel={() => setEditing(null)}
                  />
                </div>
              ) : (
                <>
                  <div
                    className="flex items-start gap-4 p-5 cursor-pointer hover:bg-slate-800/30 transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : project.id)}
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                      {project.image ? (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Tag size={20} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs border font-medium ${statusStyle}`}>
                          {project.status}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${catStyle}`}>
                          {project.category}
                        </span>
                      </div>
                      <h4 className="text-slate-200 font-medium text-sm mb-1 leading-snug">{project.title}</h4>
                      <p className="text-slate-500 text-xs line-clamp-1">{project.shortDescription}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {project.technologies.slice(0, 5).map((t) => (
                            <span key={t} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-lg">{t}</span>
                          ))}
                          {project.technologies.length > 5 && (
                            <span className="text-slate-600 text-xs self-center">+{project.technologies.length - 5}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Button variant="admin-icon-info"
                        
                        title="View live"
                        onClick={(e) => e.stopPropagation()}
>
                        <ExternalLink size={14} />
                      </Button>
                      <Button variant="admin-icon-edit"
                        onClick={(e) => { e.stopPropagation(); setEditing(project.id); setExpanded(null); }}
                        
>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="admin-icon-danger"
                        onClick={(e) => { e.stopPropagation(); setProjects((prev) => prev.filter((x) => x.id !== project.id)); }}
                        
>
                        <Trash2 size={14} />
                      </Button>
                      <div className="text-slate-600 ml-1">
                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-800 bg-slate-950/30 px-5 py-5 grid sm:grid-cols-2 gap-5">
                      {[
                        { label: "Problem Statement", value: project.problem },
                        { label: "Objective", value: project.objective },
                        { label: "Methodology", value: project.methodology },
                        { label: "Results", value: project.results },
                      ].map(({ label, value }) =>
                        value ? (
                          <div key={label}>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>
                            <p className="text-slate-300 text-sm leading-relaxed">{value}</p>
                          </div>
                        ) : null
                      )}
                      {project.tools && project.tools.length > 0 && (
                        <div className="sm:col-span-2">
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Tools Used</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tools.map((t) => (
                              <span key={t} className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg border border-slate-700">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <Tag size={32} className="mx-auto mb-4 text-slate-700" />
          <p>No projects match your filters.</p>
        </div>
      )}
    </div>
  );
}
