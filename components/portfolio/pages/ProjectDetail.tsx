import Link from "next/link";
import { ArrowLeft, GitFork, ExternalLink, CheckCircle, Tag, Wrench, ArrowRight, FolderOpen } from "lucide-react";
import type { Project } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProjectDetail({ project, others }: { project: Project; others: Project[] }) {
  const tech = [...new Set([...project.technologies, ...project.tools])];
  const isGitHub = /github\.com/i.test(project.link);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="site-hero relative h-80 sm:h-96 overflow-hidden bg-(color:--site-top)">
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-(color:--site-top) via-(color:--site-top)/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-5xl mx-auto">
          <Link href="/portfolio" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-5 transition-colors w-fit">
            <ArrowLeft size={14} /> Portfolio
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge variant="unstyled" className="px-3 py-1 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              {project.category}
            </Badge>
            <Badge variant="unstyled" className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm border ${
              project.status === "Completed"
                ? "bg-green-900/60 text-green-300 border-green-700/50"
                : "bg-blue-900/60 text-site-accent border-blue-700/50"
            }`}>
              {project.status}
            </Badge>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white leading-snug">{project.title}</h1>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {(project.description || project.shortDescription) && (
              <div>
                <h2 className="font-serif text-2xl text-slate-100 mb-4">Overview</h2>
                <p className="text-slate-300 leading-relaxed text-base whitespace-pre-line">{project.description || project.shortDescription}</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { label: "Problem Statement", value: project.problem, accent: "border-l-red-400" },
                { label: "Objective", value: project.objective, accent: "border-l-blue-400" },
                { label: "Methodology", value: project.methodology, accent: "border-l-cyan-400" },
                { label: "Results & Outcomes", value: project.results, accent: "border-l-green-400" },
              ].map(({ label, value, accent }) =>
                value ? (
                  <div key={label} className={`border-l-4 pl-4 ${accent}`}>
                    <h3 className="font-semibold text-slate-100 text-sm mb-2 uppercase tracking-wide">{label}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{value}</p>
                  </div>
                ) : null
              )}
            </div>

            {/* Technologies used */}
            {tech.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl text-slate-100 mb-4 flex items-center gap-2">
                <Wrench size={18} className="text-teal-300" /> Technologies & Tools
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {tech.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.03] text-slate-200 text-sm rounded-xl border border-white/10 hover:border-site-accent/40 transition-colors">
                    <Tag size={12} className="text-slate-400" /> {t}
                  </span>
                ))}
              </div>
            </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Status card */}
            <Card variant="site-panel" className="p-5">
              <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-4">Project Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Status</span>
                  <span className={`flex items-center gap-1.5 font-medium ${
                    project.status === "Completed" ? "text-green-300" : "text-site-accent"
                  }`}>
                    {project.status === "Completed" && <CheckCircle size={13} />}
                    {project.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Category</span>
                  <span className="text-slate-200 font-medium">{project.category}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Stack size</span>
                  <span className="text-slate-200 font-mono">{tech.length} tools</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            {project.link && (
              <div className="space-y-2.5">
                <Button asChild variant="unstyled" className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-b from-blue-500 to-blue-700 text-white text-sm font-medium rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] hover:from-blue-400 hover:to-blue-600 transition-colors">
                  <a href={project.link} {...(/^https?:/i.test(project.link) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {isGitHub ? <><GitFork size={15} /> View on GitHub</> : <><ExternalLink size={15} /> View Project</>}
                  </a>
                </Button>
              </div>
            )}

            {/* Key results highlight */}
            {project.results && (
              <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-5 text-white">
                <h4 className="text-xs font-semibold text-cyan-200 uppercase tracking-wider mb-3">Key Result</h4>
                <p className="text-sm leading-relaxed text-blue-50">{project.results}</p>
              </div>
            )}
          </div>
        </div>

        {/* Other projects */}
        {others.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/10">
            <h2 className="font-serif text-2xl text-slate-100 mb-6">More Projects</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {others.map((p) => (
                <Link
                  key={p.id}
                  href={`/portfolio/${p.id}`}
                  className="group flex gap-4 bg-white/[0.03] rounded-2xl border border-white/10 p-5 hover:border-site-accent/40 hover:shadow-sm transition-all"
                >
                  {p.image ? (
                    <img loading="lazy" decoding="async" src={p.image} alt={p.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-teal-400/10 flex items-center justify-center flex-shrink-0" aria-hidden><FolderOpen size={22} className="text-teal-400" /></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base text-slate-100 group-hover:text-site-accent transition-colors leading-snug mb-1">{p.title}</h4>
                    <p className="text-slate-400 text-xs line-clamp-2">{p.shortDescription}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-site-accent flex-shrink-0 self-center transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
