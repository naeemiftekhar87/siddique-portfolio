"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Microscope, BookOpen, GraduationCap, ExternalLink, Download, Copy,
  Hash, Search, ChevronDown, ChevronUp, Lightbulb, FlaskConical,
  Calendar, Tag, ArrowRight,
} from "lucide-react";
import { researchPapers, publications, profile } from "@/lib/data";

// ── Section IDs for internal navigation ──────────────────────────────────────
const SECTIONS = [
  { id: "interests", label: "Research Interests" },
  { id: "published", label: "Published Research" },
  { id: "upcoming", label: "Upcoming Topics" },
] as const;

type SectionId = typeof SECTIONS[number]["id"];

// ── Status colour maps ────────────────────────────────────────────────────────
const paperStatusColor: Record<string, string> = {
  Published: "bg-green-50 text-green-700 border-green-100",
  "Under Review": "bg-yellow-50 text-yellow-700 border-yellow-100",
  "Working Paper": "bg-blue-50 text-blue-700 border-blue-100",
  Submitted: "bg-purple-50 text-purple-700 border-purple-100",
  Accepted: "bg-teal-50 text-teal-700 border-teal-100",
};

const upcomingStatusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Idea:              { color: "bg-blue-900/40 text-cyan-400 border-blue-800", icon: <Lightbulb size={11} /> },
  Conceptualized:    { color: "bg-blue-900/40 text-cyan-400 border-blue-800",       icon: <Lightbulb size={11} /> },
  "Literature Review":{ color: "bg-teal-900/40 text-teal-400 border-teal-800",     icon: <BookOpen size={11} /> },
  "Data Collection": { color: "bg-amber-900/40 text-amber-400 border-amber-800",   icon: <FlaskConical size={11} /> },
  "In Progress":     { color: "bg-green-900/40 text-green-400 border-green-800",   icon: <FlaskConical size={11} /> },
};

// ── Upcoming research topics (inline, matches UpcomingResearch.tsx) ───────────
const upcomingTopics = [
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

export default function Research() {
  const [activeSection, setActiveSection] = useState<SectionId>("interests");

  // Published papers state
  const [paperSearch, setPaperSearch] = useState("");
  const [paperStatus, setPaperStatus] = useState("All");
  const allPaperStatuses = ["All", ...Array.from(new Set([...researchPapers.map(p => p.status), ...publications.map(p => p.status)]))];

  // Combine researchPapers + publications into one deduplicated list
  const allPublished = [
    ...researchPapers.map(p => ({ ...p, source: "paper" as const })),
    ...publications.filter(pub => !researchPapers.some(rp => rp.id === pub.id)).map(p => ({ ...p, source: "pub" as const })),
  ];
  const filteredPublished = allPublished.filter(p => {
    const q = paperSearch.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.authors?.join(" ") ?? "").toLowerCase().includes(q);
    const matchStatus = paperStatus === "All" || p.status === paperStatus;
    return matchSearch && matchStatus;
  });

  // Upcoming topics state
  const [topicExpanded, setTopicExpanded] = useState<number | null>(null);
  const [topicArea, setTopicArea] = useState("All");
  const allAreas = ["All", ...Array.from(new Set(upcomingTopics.map(t => t.area)))];
  const filteredTopics = topicArea === "All" ? upcomingTopics : upcomingTopics.filter(t => t.area === topicArea);

  return (
    <div className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#040d1f] via-[#071428] to-[#040d1f] py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
              <Microscope size={18} className="text-cyan-400" />
            </div>
            <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">Scholarship</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Research &<br /><span className="italic text-cyan-300">Publications</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed mb-10">
            Placeholder research introduction. Replace it with a sentence about your research agenda — from published papers to upcoming work in the pipeline.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { value: researchPapers.length + publications.length, label: "Total Publications" },
              { value: profile.scholarMetrics.citations, label: "Citations" },
              { value: profile.scholarMetrics.hIndex, label: "h-Index" },
              { value: upcomingTopics.length, label: "Pipeline Topics" },
            ].map(({ value, label }) => (
              <div key={label} className="glass-dark rounded-2xl p-4">
                <div className="font-serif text-3xl text-white">{value}</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Internal section navigation */}
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all border ${
                  activeSection === s.id
                    ? "bg-white text-[#040d1f] border-white"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section: Research Interests ─────────────────────────────────────── */}
      {activeSection === "interests" && (
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="mb-10">
            <h2 className="font-serif text-3xl text-[#040d1f] mb-3">Research Interests</h2>
            <p className="text-slate-500 max-w-2xl">
              Core thematic areas that drive the research agenda.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {profile.researchInterests.map((interest, i) => (
              <div
                key={interest}
                className="glass-card rounded-2xl p-5 hover:border-blue-200 hover:shadow-sm transition-all flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={15} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[#040d1f] font-medium text-sm">{interest}</p>
                  <p className="text-slate-400 text-xs mt-1 font-mono">#{String(i + 1).padStart(2, "0")}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Google Scholar CTA */}
          <div className="bg-gradient-to-br from-[#040d1f] to-[#071428] rounded-2xl p-8 text-white flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap size={22} className="text-cyan-400" />
                <h3 className="font-serif text-xl">Google Scholar Profile</h3>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  ["Citations", profile.scholarMetrics.citations],
                  ["h-index", profile.scholarMetrics.hIndex],
                  ["i10-index", profile.scholarMetrics.i10Index],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="font-serif text-3xl text-cyan-400 mb-1">{value}</div>
                    <div className="text-slate-400 text-xs font-mono">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <a
              href={profile.scholar}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors flex-shrink-0"
            >
              View Scholar Profile <ExternalLink size={14} />
            </a>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={() => setActiveSection("published")}
              className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:gap-3 transition-all"
            >
              Browse Published Research <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Section: Published Research ─────────────────────────────────────── */}
      {activeSection === "published" && (
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="mb-8">
            <h2 className="font-serif text-3xl text-[#040d1f] mb-3">Published Research</h2>
            <p className="text-slate-500 max-w-2xl">
              Peer-reviewed papers, conference articles, and working papers available for public reading.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative max-w-xs flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={paperSearch}
                onChange={e => setPaperSearch(e.target.value)}
                placeholder="Search title or author…"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {allPaperStatuses.map(s => (
                <button
                  key={s}
                  onClick={() => setPaperStatus(s)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    paperStatus === s ? "bg-[#040d1f] text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <p className="text-slate-400 text-sm mb-6">{filteredPublished.length} result{filteredPublished.length !== 1 ? "s" : ""}</p>

          <div className="space-y-5">
            {filteredPublished.map((paper, idx) => (
              <div
                key={`${paper.source}-${paper.id}`}
                className="bg-white rounded-2xl border border-slate-100 p-7 hover:shadow-md hover:border-slate-200 transition-all group"
              >
                <div className="flex items-start gap-5">
                  <span className="font-mono text-2xl text-slate-200 font-bold select-none flex-shrink-0 w-8 pt-1">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${paperStatusColor[paper.status] ?? "bg-slate-50 text-slate-600 border-slate-100"}`}>
                        {paper.status}
                      </span>
                      {"area" in paper && paper.area && (
                        <span className="px-2.5 py-0.5 bg-slate-50 text-slate-500 text-xs rounded-full border border-slate-100">
                          {paper.area}
                        </span>
                      )}
                      <span className="text-slate-400 text-xs font-mono">{paper.year}</span>
                    </div>

                    <h3 className="font-serif text-xl text-[#040d1f] mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                      {paper.title}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
                      <span>{paper.authors?.join(", ")}</span>
                      {paper.journal && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-blue-600 font-medium">{paper.journal}</span>
                        </>
                      )}
                    </div>

                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">{paper.abstract}</p>

                    {"doi" in paper && paper.doi && (
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                        <Hash size={11} />
                        <code className="text-teal-600">{paper.doi}</code>
                        <button
                          onClick={() => navigator.clipboard?.writeText(paper.doi)}
                          className="hover:text-slate-600 transition-colors"
                          title="Copy DOI"
                        >
                          <Copy size={11} />
                        </button>
                      </div>
                    )}

                    {"keywords" in paper && paper.keywords?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper.keywords.slice(0, 5).map((k: string) => (
                          <span key={k} className="px-2.5 py-1 bg-slate-50 text-slate-500 text-xs rounded-lg border border-slate-100">{k}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl hover:bg-blue-700 transition-colors">
                        <ExternalLink size={12} /> Read Paper
                      </button>
                      <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-xl hover:border-slate-300 transition-colors">
                        <Download size={12} /> PDF
                      </button>
                      <Link
                        href={`/research/${paper.id}`}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-medium rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <BookOpen size={12} /> Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPublished.length === 0 && (
            <div className="text-center py-20">
              <BookOpen size={40} className="mx-auto mb-4 text-slate-200" />
              <p className="text-slate-400">No publications match your search.</p>
            </div>
          )}

          <div className="flex justify-end mt-8">
            <button
              onClick={() => setActiveSection("upcoming")}
              className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:gap-3 transition-all"
            >
              See Upcoming Research <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Section: Upcoming Topics ─────────────────────────────────────────── */}
      {activeSection === "upcoming" && (
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="mb-8">
            <h2 className="font-serif text-3xl text-[#040d1f] mb-3">Upcoming Research</h2>
            <p className="text-slate-500 max-w-2xl">
              Research topics currently in development — from early ideas through active data collection. Each entry outlines the research question, expected contribution, and methodology.
            </p>
          </div>

          {/* Area filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {allAreas.map(a => (
              <button
                key={a}
                onClick={() => setTopicArea(a)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  topicArea === a ? "bg-[#040d1f] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredTopics.map((topic) => {
              const sc = upcomingStatusConfig[topic.status] ?? { color: "bg-gray-100 text-gray-600 border-gray-200", icon: null };
              const isOpen = topicExpanded === topic.id;
              return (
                <div key={topic.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-200 transition-colors">
                  <button
                    onClick={() => setTopicExpanded(isOpen ? null : topic.id)}
                    className="w-full flex items-start gap-5 p-6 text-left hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border font-medium ${sc.color}`}>
                          {sc.icon} {topic.status}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">{topic.area}</span>
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
                  </button>

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
                          {topic.keywords.map(kw => (
                            <span key={kw} className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-lg">{kw}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredTopics.length === 0 && (
            <div className="text-center py-20">
              <Microscope size={40} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400">No topics match the current filter.</p>
            </div>
          )}

          {/* Collaboration CTA */}
          <div className="mt-16 bg-[#040d1f] rounded-3xl p-8 text-center">
            <h3 className="font-serif text-2xl text-white mb-3">Interested in Collaboration?</h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
              If any of these research directions align with your expertise or organisational needs, I welcome conversations about potential research collaboration or industry partnerships.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Get in Touch <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
