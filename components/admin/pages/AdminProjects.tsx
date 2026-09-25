"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Search, ExternalLink, ChevronDown, ChevronUp, Tag } from "lucide-react";
import { projectStatuses, type PortfolioCategory, type Project } from "@/lib/data";
import { deleteProject, saveProject } from "@/lib/actions/content";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { ImageSourceField } from "@/components/admin/image-source-field";

type ProjectInput = Omit<Project, "id" | "category"> & { id?: number };

const statuses = projectStatuses;

const statusColors: Record<string, string> = {
  Completed: "bg-green-900/40 text-green-400 border-green-800",
  Research: "bg-blue-900/40 text-blue-400 border-blue-800",
  "In Progress": "bg-amber-900/40 text-amber-400 border-amber-800",
  Planned: "bg-violet-900/40 text-violet-400 border-violet-800",
  "On Hold": "bg-slate-800 text-slate-400 border-slate-700",
};

// Category chip colours follow the colour chosen in Portfolio → Categories.
const categoryColors: Record<string, string> = {
  blue: "bg-blue-900/30 text-blue-400",
  teal: "bg-teal-900/30 text-teal-400",
  violet: "bg-violet-900/30 text-violet-400",
  amber: "bg-amber-900/30 text-amber-400",
  green: "bg-green-900/30 text-green-400",
  rose: "bg-rose-900/30 text-rose-400",
  orange: "bg-orange-900/30 text-orange-400",
  sky: "bg-sky-900/30 text-sky-400",
};

const emptyProject: ProjectInput = {
  title: "",
  categoryId: null,
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
  link: "",
};

function ProjectForm({
  initial,
  categories,
  onSave,
  onCancel,
  pending,
}: {
  initial?: Project;
  categories: PortfolioCategory[];
  onSave: (d: ProjectInput) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const uid = useId();
  const [f, setF] = useState<ProjectInput>(initial ?? { ...emptyProject, categoryId: categories[0]?.id ?? null });
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-slate-900 rounded-2xl border border-blue-800/40 p-6 mb-6 space-y-4">
      <h3 className="font-serif text-xl text-white">{initial?.title ? "Edit Project" : "Add Project"}</h3>

      {/* Basic info */}
      <div>
        <Label htmlFor={`${uid}-project-title`} variant="admin-label" className="mb-1">Project Title *</Label>
        <Input id={`${uid}-project-title`} variant="admin-field"
          value={f.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Sample Project Title"
          className="w-full"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${uid}-category`} variant="admin-label" className="mb-1">Category</Label>
          <NativeSelect id={`${uid}-category`} variant="admin-field"
            value={f.categoryId ?? ""}
            onChange={(e) => set("categoryId", e.target.value ? Number(e.target.value) : null)}
            className="w-full"
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </NativeSelect>
          {categories.length === 0 && (
            <p className="text-slate-500 text-xs mt-1">
              Add categories in <Link href="/admin/portfolio/categories" className="text-blue-400 hover:underline">Portfolio → Categories</Link>.
            </p>
          )}
        </div>
        <div>
          <Label htmlFor={`${uid}-status`} variant="admin-label" className="mb-1">Status</Label>
          <NativeSelect id={`${uid}-status`} variant="admin-field"
            value={f.status}
            onChange={(e) => set("status", e.target.value)}
            className="w-full"
          >
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </NativeSelect>
        </div>
      </div>

      <div>
        <Label htmlFor={`${uid}-short-description`} variant="admin-label" className="mb-1">Short Description</Label>
        <Textarea id={`${uid}-short-description`} variant="admin-field"
          rows={2}
          value={f.shortDescription ?? ""}
          onChange={(e) => set("shortDescription", e.target.value)}
          className="w-full resize-none"
        />
      </div>

      <div>
        <Label htmlFor={`${uid}-full-description`} variant="admin-label" className="mb-1">Full Description</Label>
        <Textarea id={`${uid}-full-description`} variant="admin-field"
          rows={4}
          value={f.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          className="w-full resize-none"
        />
      </div>

      <div>
        <Label htmlFor={`${uid}-project-link-optional`} variant="admin-label" className="mb-1">Project Link (optional)</Label>
        <Input id={`${uid}-project-link-optional`} variant="admin-field"
          value={f.link}
          onChange={(e) => set("link", e.target.value)}
          placeholder="https://... or /path"
          className="w-full font-mono"
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
          <Label htmlFor={`${uid}-objective`} variant="admin-label" className="mb-1">Objective</Label>
          <Textarea id={`${uid}-objective`} variant="admin-field"
            rows={2}
            value={f.objective ?? ""}
            onChange={(e) => set("objective", e.target.value)}
            className="w-full resize-none"
          />
        </div>
        <div>
          <Label htmlFor={`${uid}-methodology`} variant="admin-label" className="mb-1">Methodology</Label>
          <Textarea id={`${uid}-methodology`} variant="admin-field"
            rows={2}
            value={f.methodology ?? ""}
            onChange={(e) => set("methodology", e.target.value)}
            className="w-full resize-none"
          />
        </div>
        <div>
          <Label htmlFor={`${uid}-results-outcomes`} variant="admin-label" className="mb-1">Results / Outcomes</Label>
          <Textarea id={`${uid}-results-outcomes`} variant="admin-field"
            rows={2}
            value={f.results ?? ""}
            onChange={(e) => set("results", e.target.value)}
            className="w-full resize-none"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${uid}-technologies-comma-separated`} variant="admin-label" className="mb-1">Technologies (comma-separated)</Label>
          <Input id={`${uid}-technologies-comma-separated`} variant="admin-field"
            value={Array.isArray(f.technologies) ? f.technologies.join(", ") : ""}
            onChange={(e) => set("technologies", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            placeholder="Tool 1, Tool 2, Tool 3"
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor={`${uid}-tools-comma-separated`} variant="admin-label" className="mb-1">Tools (comma-separated)</Label>
          <Input id={`${uid}-tools-comma-separated`} variant="admin-field"
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
          disabled={pending}
          className="px-5 py-2.5 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save Project"}
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

export default function AdminProjects({ initial, categories }: { initial: Project[]; categories: PortfolioCategory[] }) {
  const [projects, setProjects] = useState<Project[]>(initial);
  const { pending, run } = useAction();
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

  const handleAdd = (data: ProjectInput) => {
    run(() => saveProject(data), {
      success: "Project added.",
      onSuccess: (saved) => {
        setProjects((prev) => [saved, ...prev]);
        setShowAdd(false);
      },
    });
  };

  const handleEdit = (id: number, data: ProjectInput) => {
    run(() => saveProject({ ...data, id }), {
      success: "Project updated.",
      onSuccess: (saved) => {
        setProjects((prev) => prev.map((p) => (p.id === id ? saved : p)));
        setEditing(null);
      },
    });
  };

  const handleDelete = (id: number) => {
    run(() => deleteProject(id), {
      success: "Project deleted.",
      onSuccess: () => setProjects((prev) => prev.filter((x) => x.id !== id)),
    });
  };

  const allCats = Array.from(new Set(projects.map((p) => p.category)));
  const colorOf = (name: string) => categories.find((c) => c.name === name)?.color;

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

      {showAdd && <ProjectForm categories={categories} onSave={handleAdd} onCancel={() => setShowAdd(false)} pending={pending} />}

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
          const catStyle = categoryColors[colorOf(project.category) ?? ""] ?? "bg-slate-800 text-slate-400";

          return (
            <Card variant="admin-panel" key={project.id} className="overflow-hidden">
              {editing === project.id ? (
                <div className="p-6">
                  <ProjectForm
                    initial={project}
                    categories={categories}
                    onSave={(d) => handleEdit(project.id, d)}
                    onCancel={() => setEditing(null)}
                    pending={pending}
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
                        <img loading="lazy" decoding="async" src={project.image} alt={project.title} className="w-full h-full object-cover" />
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
                      <Button asChild variant="admin-icon-info">
                        <Link href={`/portfolio/${project.id}`} target="_blank" title="View live"
                          aria-label={`View ${project.title} on the site`} onClick={(e) => e.stopPropagation()}>
                          <ExternalLink size={14} />
                        </Link>
                      </Button>
                      <Button variant="admin-icon-edit" aria-label={`Edit ${project.title}`}
                        onClick={(e) => { e.stopPropagation(); setEditing(project.id); setExpanded(null); }}
>
                        <Pencil size={14} />
                      </Button>
                      <ConfirmDelete label={project.title} pending={pending} onConfirm={() => handleDelete(project.id)} />
                      <Button variant="unstyled" type="button" aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${project.title}`}
                        onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : project.id); }}
                        className="text-slate-600 ml-1 p-1 rounded-lg hover:text-slate-300">
                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </Button>
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
          <p>{projects.length === 0 ? "No projects yet." : "No projects match your filters."}</p>
        </div>
      )}
    </div>
  );
}
