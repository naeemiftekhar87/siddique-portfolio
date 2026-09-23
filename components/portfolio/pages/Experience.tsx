"use client";

import { MapPin, Calendar, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { experiences, profile } from "@/lib/data";

export default function Experience() {
  const [expanded, setExpanded] = useState<number | null>(1);

  const companies = new Set(experiences.map((e) => e.company)).size;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#040d1f] via-[#071428] to-[#040d1f] py-20 px-6 relative overflow-hidden">
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
            Over {profile.stats.experience} years of professional experience. Replace this placeholder with a sentence about your career focus.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: experiences.length, label: "Roles" },
              { value: companies, label: "Companies" },
              { value: profile.stats.experience, label: "Years Exp." },
              { value: profile.stats.skills, label: "Skills" },
            ].map(({ value, label }) => (
              <div key={label} className="glass-dark rounded-2xl p-4">
                <div className="font-serif text-3xl text-white">{value}</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12">
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
                  <img src={exp.logo} alt={exp.company} className="w-8 h-8 rounded-xl object-cover" />
                </div>

                <div
                  className={`bg-white rounded-2xl border transition-all cursor-pointer ${
                    expanded === exp.id ? "border-blue-200 shadow-md" : "border-slate-100 hover:border-slate-200 hover:shadow-sm"
                  }`}
                  onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img src={exp.logo} alt={exp.company} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 md:hidden" />
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg">{exp.position}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            <span className="text-blue-600 font-medium text-sm">{exp.company}</span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md font-mono">
                              {exp.type}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <span className="flex items-center gap-1 text-slate-400 text-xs">
                              <Calendar size={12} /> {exp.startDate} – {exp.endDate}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400 text-xs">
                              <MapPin size={12} /> {exp.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 flex-shrink-0 mt-1">
                        {expanded === exp.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>

                  {expanded === exp.id && (
                    <div className="px-6 pb-6 border-t border-slate-50 pt-5">
                      <p className="text-slate-600 mb-6 leading-relaxed">{exp.description}</p>

                      <div className="grid md:grid-cols-2 gap-6">
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
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {exp.skills.map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
