"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";
import type { GalleryItem, PortfolioCategory, Project } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PortfolioProps = { projects: Project[]; categories: PortfolioCategory[]; gallery: GalleryItem[] };

export default function Portfolio({ projects, categories: categoryList, gallery }: PortfolioProps) {
  const [active, setActive] = useState("All");
  // Filter tabs follow the order set in Portfolio → Categories.
  const categories = [
    "All",
    ...categoryList.map((c) => c.name),
    ...(projects.some((p) => p.categoryId === null) ? ["Uncategorized"] : []),
  ];

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);
  const completed = projects.filter((p) => p.status === "Completed").length;
  const areas = new Set(projects.map((p) => p.category)).size;
  const techCount = projects.flatMap((p) => p.technologies).filter((v, i, a) => a.indexOf(v) === i).length;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
              <FolderOpen size={18} className="text-teal-400" />
            </div>
            <span className="text-teal-400 text-sm font-medium tracking-wide uppercase">Work</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Project<br /><span className="italic text-teal-300">Portfolio</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed mb-10">
            Selected projects from concept to delivery — the problem, the approach, and the results.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: projects.length, label: "Total Projects" },
              { value: completed, label: "Completed" },
              { value: areas, label: "Focus Areas" },
              { value: techCount, label: "Technologies" },
            ].map(({ value, label }) => (
              <Card variant="site-glass-dark" key={label} className="p-4">
                <div className="font-serif text-3xl text-white">{value}</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-[72px] z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button variant="unstyled"
                key={cat}
                onClick={() => setActive(cat)}
                aria-pressed={active === cat}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active === cat
                    ? "bg-[#040d1f] text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-cyan-300 hover:text-blue-600"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-slate-400 text-sm mb-6">{filtered.length} project{filtered.length !== 1 ? "s" : ""}</p>
        <div className="grid md:grid-cols-2 gap-8">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.id}`}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all group"
            >
              <div className="relative h-52 overflow-hidden bg-slate-100">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-slate-100" aria-hidden>
                    <FolderOpen size={44} className="text-teal-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge variant="unstyled" className="bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 px-3 py-1.5 rounded-full">
                    {project.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="unstyled" className={`text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${
                    project.status === "Completed"
                      ? "bg-green-900/60 text-green-300 border-green-700/40"
                      : "bg-blue-900/60 text-cyan-300 border-blue-700/40"
                  }`}>
                    {project.status}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-[#040d1f] mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-500 text-sm mb-5 line-clamp-2 leading-relaxed">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.technologies.slice(0, 5).map((t) => (
                    <Badge variant="unstyled" key={t} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-100">
                      {t}
                    </Badge>
                  ))}
                  {project.technologies.length > 5 && (
                    <Badge variant="unstyled" className="px-2.5 py-1 bg-slate-50 text-slate-400 text-xs rounded-lg border border-slate-100">
                      +{project.technologies.length - 5}
                    </Badge>
                  )}
                </div>
                <span className="flex items-center gap-1.5 text-sm text-blue-600 font-medium group-hover:gap-2.5 transition-all">
                  View Project <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <FolderOpen size={40} className="mx-auto mb-4 opacity-30" />
            <p>{projects.length === 0 ? "No projects yet." : "No projects match the selected filter."}</p>
          </div>
        )}
      </section>

      {/* Gallery (Portfolio → Gallery in the admin) */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <h2 className="font-serif text-3xl text-[#040d1f] mb-6">Gallery</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => {
              const card = (
                <>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <Badge variant="unstyled" className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 px-2.5 py-1 rounded-full">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    {item.caption && <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{item.caption}</p>}
                  </div>
                </>
              );
              const cls = "block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all group";
              return item.projectLink ? (
                <Link key={item.id} href={item.projectLink} className={cls}
                  {...(/^https?:/i.test(item.projectLink) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {card}
                </Link>
              ) : (
                <div key={item.id} className={cls}>{card}</div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
