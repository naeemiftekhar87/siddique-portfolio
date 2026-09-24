"use client";

import { MapPin, Calendar, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { Experience as ExperienceEntry, SiteProfile } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dateRange } from "@/lib/data/format";

function CompanyLogo({ exp, className }: { exp: ExperienceEntry; className: string }) {
  return exp.logo ? (
    <img src={exp.logo} alt={exp.company} className={className} />
  ) : (
    <span className={`${className} bg-blue-50 flex items-center justify-center`} aria-hidden>
      <Briefcase size={16} className="text-blue-600" />
    </span>
  );
}

export default function Experience({ experiences, profile }: { experiences: ExperienceEntry[]; profile: SiteProfile }) {
  // The latest role starts open; "Expand all" opens every card.
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set(experiences.slice(0, 1).map((e) => e.id)));
  const allOpen = experiences.length > 0 && expanded.size === experiences.length;
  const toggle = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const companies = new Set(experiences.map((e) => e.company)).size;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
              <Briefcase size={18} className="text-cyan-400" />
            </div>
            <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">Career History</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Professional<br /><span className="italic text-cyan-300">Experience</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed mb-10">
            {profile.stats.experience ? `Over ${profile.stats.experience} years of professional experience — ` : ""}roles, responsibilities, and key achievements across my career.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: experiences.length, label: "Roles" },
              { value: companies, label: "Companies" },
              { value: profile.stats.experience, label: "Years Exp." },
              { value: profile.stats.skills, label: "Skills" },
            ].map(({ value, label }) => (
              <Card variant="site-glass-dark" key={label} className="p-4">
                <div className="font-serif text-3xl text-white">{value || "—"}</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {experiences.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No experience entries yet.</div>
        ) : (
        <>
        <div className="flex justify-end mb-4">
          <Button variant="unstyled"
            onClick={() => setExpanded(allOpen ? new Set() : new Set(experiences.map((e) => e.id)))}
            className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
            {allOpen ? <><ChevronUp size={15} /> Collapse all</> : <><ChevronDown size={15} /> Expand all</>}
          </Button>
        </div>
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 hidden md:block" />

          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <div key={exp.id} className="md:pl-20 relative">
                {/* Timeline dot */}
                <div className={`hidden md:flex absolute left-0 w-12 h-12 rounded-2xl items-center justify-center shadow-sm border ${
                  idx === 0 ? "bg-blue-600 border-blue-600" : "bg-white border-slate-200"
                }`}>
                  <CompanyLogo exp={exp} className="w-8 h-8 rounded-xl object-cover" />
                </div>

                <div
                  className={`bg-white rounded-2xl border transition-all cursor-pointer ${
                    expanded.has(exp.id) ? "border-blue-200 shadow-md" : "border-slate-100 hover:border-slate-200 hover:shadow-sm"
                  }`}
                  onClick={() => toggle(exp.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <CompanyLogo exp={exp} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 md:hidden" />
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg">{exp.position}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            <span className="text-blue-600 font-medium text-sm">{exp.company}</span>
                            {exp.type && (
                              <Badge variant="unstyled" className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md font-mono">
                                {exp.type}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <span className="flex items-center gap-1 text-slate-400 text-xs">
                              <Calendar size={12} /> {dateRange(exp.startDate, exp.endDate)}
                            </span>
                            {exp.location && (
                              <span className="flex items-center gap-1 text-slate-400 text-xs">
                                <MapPin size={12} /> {exp.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="unstyled"
                        onClick={(e) => { e.stopPropagation(); toggle(exp.id); }}
                        aria-expanded={expanded.has(exp.id)}
                        aria-label={`${expanded.has(exp.id) ? "Collapse" : "Expand"} ${exp.position}`}
                        className="text-slate-400 hover:text-slate-600 flex-shrink-0 mt-1">
                        {expanded.has(exp.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </Button>
                    </div>
                  </div>

                  {expanded.has(exp.id) && (
                    <div className="px-6 pb-6 border-t border-slate-50 pt-5">
                      <p className="text-slate-600 mb-6 leading-relaxed">{exp.description}</p>

                      <div className="grid md:grid-cols-2 gap-6">
                        {exp.responsibilities.length > 0 && (
                        <div>
                          <h4 className="text-slate-900 font-semibold text-sm mb-3">Key Responsibilities</h4>
                          <ul className="space-y-2">
                            {exp.responsibilities.map((r, i) => (
                              <li key={i} className="flex gap-2 text-slate-600 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                        )}
                        {exp.achievements.length > 0 && (
                        <div>
                          <h4 className="text-slate-900 font-semibold text-sm mb-3">Achievements</h4>
                          <ul className="space-y-2">
                            {exp.achievements.map((a, i) => (
                              <li key={i} className="flex gap-2 text-slate-600 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0 mt-2" />
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                        )}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {exp.skills.map((skill) => (
                          <Badge variant="unstyled" key={skill} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-100">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
