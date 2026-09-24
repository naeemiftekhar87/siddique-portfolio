"use client";

import { useState } from "react";
import { Microscope, Tag, ChevronDown, ChevronUp, Calendar, Lightbulb, BookOpen, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ResearchTopic = {
  id: number;
  title: string;
  area: string;
  status: string;
  question: string;
  contribution: string;
  methodology: string;
  keywords: string[];
  expectedYear?: string;
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  Idea: { label: "Idea", color: "bg-blue-900/40 text-cyan-400 border-blue-800", icon: <Lightbulb size={11} /> },
  Conceptualized: { label: "Conceptualized", color: "bg-blue-900/40 text-cyan-400 border-blue-800", icon: <Lightbulb size={11} /> },
  "Literature Review": { label: "Literature Review", color: "bg-teal-900/40 text-teal-400 border-teal-800", icon: <BookOpen size={11} /> },
  "Data Collection": { label: "Data Collection", color: "bg-amber-900/40 text-amber-400 border-amber-800", icon: <FlaskConical size={11} /> },
  "In Progress": { label: "In Progress", color: "bg-green-900/40 text-green-400 border-green-800", icon: <FlaskConical size={11} /> },
};

const topics: ResearchTopic[] = [
  {
    id: 1,
    title: "Example Upcoming Research Topic 1",
    area: "Research Area A",
    status: "Conceptualized",
    question: "Placeholder research question. Replace it with the question this study sets out to answer.",
    contribution: "Placeholder expected contribution. Replace it with what this work will add to the field.",
    methodology: "Placeholder methodology. Replace it with the planned data, methods, and evaluation approach.",
    keywords: ["Keyword 1", "Keyword 2", "Keyword 3"],
    expectedYear: "2027",
  },
  {
    id: 2,
    title: "Example Upcoming Research Topic 2",
    area: "Research Area B",
    status: "Literature Review",
    question: "Placeholder research question. Replace it with the question this study sets out to answer.",
    contribution: "Placeholder expected contribution. Replace it with what this work will add to the field.",
    methodology: "Placeholder methodology. Replace it with the planned data, methods, and evaluation approach.",
    keywords: ["Keyword 1", "Keyword 2", "Keyword 3"],
    expectedYear: "2026",
  },
  {
    id: 3,
    title: "Example Upcoming Research Topic 3",
    area: "Research Area A",
    status: "Idea",
    question: "Placeholder research question. Replace it with the question this study sets out to answer.",
    contribution: "Placeholder expected contribution. Replace it with what this work will add to the field.",
    methodology: "Placeholder methodology. Replace it with the planned data, methods, and evaluation approach.",
    keywords: ["Keyword 1", "Keyword 2", "Keyword 3"],
    expectedYear: "2027",
  },
  {
    id: 4,
    title: "Example Upcoming Research Topic 4",
    area: "Research Area C",
    status: "Data Collection",
    question: "Placeholder research question. Replace it with the question this study sets out to answer.",
    contribution: "Placeholder expected contribution. Replace it with what this work will add to the field.",
    methodology: "Placeholder methodology. Replace it with the planned data, methods, and evaluation approach.",
    keywords: ["Keyword 1", "Keyword 2", "Keyword 3"],
    expectedYear: "2026",
  },
  {
    id: 5,
    title: "Example Upcoming Research Topic 5",
    area: "Research Area D",
    status: "Conceptualized",
    question: "Placeholder research question. Replace it with the question this study sets out to answer.",
    contribution: "Placeholder expected contribution. Replace it with what this work will add to the field.",
    methodology: "Placeholder methodology. Replace it with the planned data, methods, and evaluation approach.",
    keywords: ["Keyword 1", "Keyword 2", "Keyword 3"],
    expectedYear: "2028",
  },
];

const areas = ["All", ...Array.from(new Set(topics.map((t) => t.area)))];
const statuses = ["All", ...Array.from(new Set(topics.map((t) => t.status)))];

export default function UpcomingResearch() {
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
      <section className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Microscope size={18} className="text-cyan-400" />
            </div>
            <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">Research Pipeline</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Upcoming<br /><span className="italic text-cyan-300">Research</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            A forward-looking view of research topics currently being developed — from early-stage ideas through active data collection. Each entry outlines the research question, expected contribution, and methodology.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {[
              { value: topics.length, label: "Topics in Pipeline" },
              { value: topics.filter((t) => t.status === "Data Collection" || t.status === "In Progress").length, label: "Active" },
              { value: topics.filter((t) => t.status === "Literature Review").length, label: "Under Review" },
              { value: Array.from(new Set(topics.map((t) => t.area))).length, label: "Research Areas" },
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
      <div className="sticky top-[72px] z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-400 text-xs self-center mr-1">Area:</span>
            {areas.map((a) => (
              <Button variant="unstyled"
                key={a}
                onClick={() => setAreaFilter(a)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${areaFilter === a ? "bg-[#040d1f] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {a}
              </Button>
            ))}
          </div>
          <div className="sm:border-l sm:border-gray-200 sm:pl-4 flex flex-wrap gap-2">
            <span className="text-gray-400 text-xs self-center mr-1">Status:</span>
            {statuses.map((s) => (
              <Button variant="unstyled"
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
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
            const status = statusConfig[topic.status] ?? { label: topic.status, color: "bg-gray-100 text-gray-600 border-gray-200", icon: null };
            const isOpen = expanded === topic.id;
            return (
              <div key={topic.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-200 transition-colors">
                <Button variant="unstyled"
                  onClick={() => setExpanded(isOpen ? null : topic.id)}
                  className="w-full flex items-start gap-5 p-6 text-left hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="unstyled" className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border font-medium ${status.color}`}>
                        {status.icon} {status.label}
                      </Badge>
                      <Badge variant="unstyled" className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">{topic.area}</Badge>
                      {topic.expectedYear && (
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <Calendar size={11} /> Est. {topic.expectedYear}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-[#040d1f] leading-snug mb-2">{topic.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{topic.question}</p>
                  </div>
                  <div className="flex-shrink-0 mt-1 text-gray-400">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </Button>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50/40 px-6 py-6 space-y-5">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Research Question</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{topic.question}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Expected Contribution</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{topic.contribution}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Methodology</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{topic.methodology}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Tag size={11} /> Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {topic.keywords.map((kw) => (
                          <Badge variant="unstyled" key={kw} className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-lg">{kw}</Badge>
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
            <Microscope size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">No topics match the current filters.</p>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-16 bg-[#040d1f] rounded-3xl p-8 text-center">
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
