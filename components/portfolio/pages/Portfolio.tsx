"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";
import { projects } from "@/lib/data";

const categories = ["All", "Sample Category A", "Sample Category B", "Sample Category C", "Sample Category D"];

export default function Portfolio() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);
  const completed = projects.filter((p) => p.status === "Completed").length;
  const areas = new Set(projects.map((p) => p.category)).size;
  const techCount = projects.flatMap((p) => p.technologies).filter((v, i, a) => a.indexOf(v) === i).length;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#040d1f] via-[#071428] to-[#040d1f] py-20 px-6 relative overflow-hidden">
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
            Placeholder portfolio introduction. Replace it with a sentence about the kinds of projects you build, from concept to delivery.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: projects.length, label: "Total Projects" },
              { value: completed, label: "Completed" },
              { value: areas, label: "Focus Areas" },
              { value: techCount, label: "Technologies" },
            ].map(({ value, label }) => (
              <div key={label} className="glass-dark rounded-2xl p-4">
                <div className="font-serif text-3xl text-white">{value}</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-[72px] z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active === cat
                    ? "bg-[#040d1f] text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-cyan-300 hover:text-blue-600"
                }`}
              >
                {cat}
              </button>
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
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 px-3 py-1.5 rounded-full">
                    {project.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${
                    project.status === "Completed"
                      ? "bg-green-900/60 text-green-300 border-green-700/40"
                      : "bg-blue-900/60 text-cyan-300 border-blue-700/40"
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-[#040d1f] mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-500 text-sm mb-5 line-clamp-2 leading-relaxed">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.technologies.slice(0, 5).map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-100">
                      {t}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="px-2.5 py-1 bg-slate-50 text-slate-400 text-xs rounded-lg border border-slate-100">
                      +{project.technologies.length - 5}
                    </span>
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
            <p>No projects match the selected filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}
