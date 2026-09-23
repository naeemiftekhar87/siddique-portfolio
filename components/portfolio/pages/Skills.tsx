"use client";

import { useState } from "react";
import { Search, BarChart2 } from "lucide-react";
import { skills, skillCategories } from "@/lib/data";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = skills.filter((s) => {
    const matchCat = activeCategory === "ALL" || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const avgLevel = Math.round(skills.reduce((s, k) => s + k.level, 0) / skills.length);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#040d1f] via-[#071428] to-[#040d1f] py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
              <BarChart2 size={18} className="text-cyan-400" />
            </div>
            <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">Competencies</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Skills &<br /><span className="italic text-cyan-300">Expertise</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed mb-10">
            A broad technical and analytical skill set built through professional practice, academic research, and continuous self-development across your domains.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: skills.length, label: "Total Skills" },
              { value: skillCategories.length - 1, label: "Categories" },
              { value: skills.filter((s) => s.level >= 80).length, label: "Expert Level" },
              { value: `${avgLevel}%`, label: "Avg. Proficiency" },
            ].map(({ value, label }) => (
              <div key={label} className="glass-dark rounded-2xl p-4">
                <div className="font-serif text-3xl text-white">{value}</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {skillCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-cyan-300 hover:text-blue-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((skill) => (
            <div
              key={skill.id}
              className="glass-card rounded-2xl p-5 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{skill.name}</h4>
                  <span className={`text-xs font-mono mt-0.5 inline-block ${
                    skill.category === "TOOLS & TECHNOLOGIES" ? "text-blue-500" :
                    skill.category === "INDUSTRY KNOWLEDGE" ? "text-teal-500" :
                    skill.category === "INTERPERSONAL" ? "text-blue-500" :
                    "text-orange-500"
                  }`}>
                    {skill.category === "ALL" ? "" : skill.category}
                  </span>
                </div>
                <span className="font-mono text-xs text-slate-400">{skill.level}%</span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-blue-500 to-teal-500"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            No skills match your search.
          </div>
        )}
      </div>
    </div>
  );
}
