"use client";

import { useState } from "react";
import { Microscope, Tag, ChevronDown, ChevronUp, Calendar, Lightbulb, BookOpen, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { UpcomingResearch as ResearchTopic } from "@/lib/data";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  Idea: { label: "Idea", color: "bg-blue-900/40 text-site-accent border-blue-800", icon: <Lightbulb size={11} /> },
  Conceptualized: { label: "Conceptualized", color: "bg-blue-900/40 text-site-accent border-blue-800", icon: <Lightbulb size={11} /> },
  "Literature Review": { label: "Literature Review", color: "bg-teal-900/40 text-teal-400 border-teal-800", icon: <BookOpen size={11} /> },
  "Data Collection": { label: "Data Collection", color: "bg-amber-900/40 text-amber-400 border-amber-800", icon: <FlaskConical size={11} /> },
  "In Progress": { label: "In Progress", color: "bg-green-900/40 text-green-400 border-green-800", icon: <FlaskConical size={11} /> },
};


export default function UpcomingResearch({ topics }: { topics: ResearchTopic[] }) {
  const areas = ["All", ...Array.from(new Set(topics.map((t) => t.area).filter(Boolean)))];
  const statuses = ["All", ...Array.from(new Set(topics.map((t) => t.status)))];
  const [areaFilter, setAreaFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = topics.filter((t) => {
    const matchArea = areaFilter === "All" || t.area === areaFilter;
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchArea && matchStatus;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="site-hero bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Microscope size={18} className="text-site-accent" />
            </div>
            <span className="text-site-accent text-sm font-medium tracking-wide uppercase">Research Pipeline</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Upcoming<br /><span className="italic text-site-accent">Research</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            A forward-looking view of research topics currently being developed — from early-stage ideas through active data collection. Each entry outlines the research question, expected contribution, and methodology.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {[
              { value: topics.length, label: "Topics in Pipeline" },
              { value: topics.filter((t) => t.status === "Data Collection" || t.status === "In Progress").length, label: "Active" },
              { value: topics.filter((t) => t.status === "Literature Review").length, label: "Under Review" },
              { value: Array.from(new Set(topics.map((t) => t.area).filter(Boolean))).length, label: "Research Areas" },
            ].map(({ value, label }) => (
              <Card variant="site-glass-dark" key={label} className="p-4">
                <div className="font-serif text-3xl text-white">{value}</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[72px] z-10 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-slate-400 text-xs self-center mr-1">Area:</span>
            {areas.map((a) => (
              <Button variant="unstyled"
                key={a}
                onClick={() => setAreaFilter(a)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${areaFilter === a ? "bg-site-accent/15 text-site-accent ring-1 ring-inset ring-site-accent/30" : "bg-white/[0.06] text-slate-300 hover:bg-white/10"}`}
              >
                {a}
              </Button>
            ))}
          </div>
          <div className="sm:border-l sm:border-white/10 sm:pl-4 flex flex-wrap gap-2">
            <span className="text-slate-400 text-xs self-center mr-1">Status:</span>
            {statuses.map((s) => (
              <Button variant="unstyled"
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-blue-600 text-white" : "bg-white/[0.06] text-slate-300 hover:bg-white/10"}`}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Topics */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-4">
          {filtered.map((topic) => {
            const status = statusConfig[topic.status] ?? { label: topic.status, color: "bg-white/[0.06] text-slate-300 border-white/10", icon: null };
            const isOpen = expanded === topic.id;
            return (
              <div key={topic.id} className="border border-white/10 rounded-2xl overflow-hidden hover:border-site-accent/40 transition-colors">
                <Button variant="unstyled"
                  onClick={() => setExpanded(isOpen ? null : topic.id)}
                  className="w-full flex items-start gap-5 p-6 text-left hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="unstyled" className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border font-medium ${status.color}`}>
                        {status.icon} {status.label}
                      </Badge>
                      <Badge variant="unstyled" className="px-2.5 py-1 rounded-full bg-white/[0.06] text-slate-300 text-xs">{topic.area}</Badge>
                      {topic.expectedYear && (
                        <span className="flex items-center gap-1 text-slate-400 text-xs">
                          <Calendar size={11} /> Est. {topic.expectedYear}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-slate-100 leading-snug mb-2">{topic.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{topic.question}</p>
                  </div>
                  <div className="flex-shrink-0 mt-1 text-slate-400">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </Button>

                {isOpen && (
                  <div className="border-t border-white/10 bg-white/[0.03] px-6 py-6 space-y-5">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Research Question</h4>
                      <p className="text-slate-200 text-sm leading-relaxed">{topic.question}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Expected Contribution</h4>
                        <p className="text-slate-200 text-sm leading-relaxed">{topic.contribution}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Methodology</h4>
                        <p className="text-slate-200 text-sm leading-relaxed">{topic.methodology}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Tag size={11} /> Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {topic.keywords.map((kw) => (
                          <Badge variant="unstyled" key={kw} className="px-3 py-1 bg-white/[0.04] border border-white/10 text-slate-300 text-xs rounded-lg">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Microscope size={40} className="text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">{topics.length === 0 ? "No upcoming topics yet." : "No topics match the current filters."}</p>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-16 glass-card rounded-3xl p-8 text-center">
          <h3 className="font-serif text-2xl text-white mb-3">Interested in Collaboration?</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
            If any of these research directions align with your expertise or organizational needs, I welcome conversations about potential research collaboration or industry partnerships.
          </p>
          <Button asChild variant="site-primary" className="inline-flex items-center gap-2 px-6 py-3 text-sm transition-colors"><a
            href="/contact"
           
          >
            Get in Touch
          </a></Button>
        </div>
      </section>
    </div>
  );
}
