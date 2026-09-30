"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Microscope, BookOpen, GraduationCap, ExternalLink, Download,
  Hash, Search, ChevronDown, ChevronUp, Lightbulb, FlaskConical,
  Calendar, Tag, ArrowRight,
} from "lucide-react";
import type { Paper, SiteProfile, UpcomingResearch } from "@/lib/data";
import { CopyButton } from "@/components/portfolio/copy-button";
import { paperLink, researchSections, type ResearchSectionId } from "@/lib/data/research";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// ── Section IDs for internal navigation ──────────────────────────────────────
const SECTIONS = researchSections;
type SectionId = ResearchSectionId;

// ── Status colour maps ────────────────────────────────────────────────────────
const paperStatusColor: Record<string, string> = {
  Published: "bg-green-400/10 text-green-300 border-green-400/20",
  "Under Review": "bg-yellow-400/10 text-yellow-300 border-yellow-400/20",
  "Working Paper": "bg-site-accent/10 text-site-accent border-site-accent/20",
  Submitted: "bg-purple-400/10 text-purple-300 border-purple-400/20",
  Accepted: "bg-teal-400/10 text-teal-300 border-teal-400/20",
  "Revision Requested": "bg-orange-400/10 text-orange-300 border-orange-400/20",
};

const upcomingStatusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Idea:              { color: "bg-blue-900/40 text-site-accent border-blue-800", icon: <Lightbulb size={11} /> },
  Conceptualized:    { color: "bg-blue-900/40 text-site-accent border-blue-800",       icon: <Lightbulb size={11} /> },
  "Literature Review":{ color: "bg-teal-900/40 text-teal-400 border-teal-800",     icon: <BookOpen size={11} /> },
  "Data Collection": { color: "bg-amber-900/40 text-amber-400 border-amber-800",   icon: <FlaskConical size={11} /> },
  "In Progress":     { color: "bg-green-900/40 text-green-400 border-green-800",   icon: <FlaskConical size={11} /> },
};

type ResearchProps = {
  papers: Paper[];
  upcomingTopics: UpcomingResearch[];
  profile: SiteProfile;
  initialSection: SectionId;
};

export default function Research({ papers, upcomingTopics, profile, initialSection }: ResearchProps) {
  const [activeSection, setSection] = useState<SectionId>(initialSection);

  // The active tab lives in the URL (?tab=) so it survives refresh and can be shared.
  const setActiveSection = (id: SectionId) => {
    setSection(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.replaceState(null, "", url);
  };

  // Published papers state
  const [paperSearch, setPaperSearch] = useState("");
  const [paperStatus, setPaperStatus] = useState("All");
  const allPaperStatuses = ["All", ...Array.from(new Set(papers.map(p => p.status)))];

  // One paper list (working paper → published); ids are unique, so no duplicates.
  const allPublished = papers;
  const filteredPublished = allPublished.filter(p => {
    const q = paperSearch.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.authors?.join(" ") ?? "").toLowerCase().includes(q);
    const matchStatus = paperStatus === "All" || p.status === paperStatus;
    return matchSearch && matchStatus;
  });

  // Upcoming topics state
  const [topicExpanded, setTopicExpanded] = useState<number | null>(null);
  const [topicArea, setTopicArea] = useState("All");
  const allAreas = ["All", ...Array.from(new Set(upcomingTopics.map(t => t.area).filter(Boolean)))];
  const filteredTopics = topicArea === "All" ? upcomingTopics : upcomingTopics.filter(t => t.area === topicArea);

  return (
    <div className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="site-hero bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-site-accent/15 border border-site-accent/30 flex items-center justify-center">
              <Microscope size={18} className="text-site-accent" />
            </div>
            <span className="text-site-accent text-sm font-medium tracking-wide uppercase">Scholarship</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Research &<br /><span className="italic text-site-accent">Publications</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed mb-10">
            My research agenda — from published papers to upcoming work in the pipeline.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { value: profile.scholarMetrics.publications || papers.length, label: "Total Publications" },
              { value: profile.scholarMetrics.citations, label: "Citations" },
              { value: profile.scholarMetrics.hIndex, label: "h-Index" },
              { value: profile.scholarMetrics.i10Index, label: "i10-Index" },
            ].map(({ value, label }) => (
              <Card variant="site-glass-dark" key={label} className="p-4">
                <div className="font-serif text-3xl text-white">{value}</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </Card>
            ))}
          </div>

          {/* Internal section navigation */}
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map(s => (
              <Button variant="unstyled"
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                aria-pressed={activeSection === s.id}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all border ${
                  activeSection === s.id
                    ? "bg-site-accent/15 text-site-accent border-site-accent/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                    : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section: Research Interests ─────────────────────────────────────── */}
      {activeSection === "interests" && (
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="mb-10">
            <h2 className="font-serif text-3xl text-slate-100 mb-3">Research Interests</h2>
            <p className="text-slate-400 max-w-2xl">
              Core thematic areas that drive the research agenda.
            </p>
          </div>

          {profile.researchInterests.length === 0 && (
            <p className="text-slate-400 mb-14">Research interests will appear here soon.</p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {profile.researchInterests.map((interest, i) => (
              <Card variant="site-glass-card"
                key={interest}
                className="p-5 hover:border-site-accent/40 hover:shadow-sm transition-all flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-site-accent/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={15} className="text-site-accent" />
                </div>
                <div>
                  <p className="text-slate-100 font-medium text-sm">{interest}</p>
                  <p className="text-slate-400 text-xs mt-1 font-mono">#{String(i + 1).padStart(2, "0")}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Google Scholar CTA */}
          <div className="glass-card rounded-2xl p-8 text-white flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap size={22} className="text-site-accent" />
                <h3 className="font-serif text-xl">Google Scholar Profile</h3>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  ["Citations", profile.scholarMetrics.citations],
                  ["h-index", profile.scholarMetrics.hIndex],
                  ["i10-index", profile.scholarMetrics.i10Index],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="font-serif text-3xl text-site-accent mb-1">{value}</div>
                    <div className="text-slate-400 text-xs font-mono">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            {profile.scholar && (
              <a
                href={profile.scholar}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white/[0.06] text-slate-100 text-sm font-semibold rounded-xl border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/[0.12] transition-colors flex-shrink-0"
              >
                View Scholar Profile <ExternalLink size={14} />
              </a>
            )}
          </div>

          <div className="flex justify-end mt-8">
            <Button variant="unstyled"
              onClick={() => setActiveSection("published")}
              className="flex items-center gap-2 text-sm text-site-accent font-medium hover:gap-3 transition-all"
            >
              Browse Published Research <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      )}

      {/* ── Section: Published Research ─────────────────────────────────────── */}
      {activeSection === "published" && (
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="mb-8">
            <h2 className="font-serif text-3xl text-slate-100 mb-3">Published Research</h2>
            <p className="text-slate-400 max-w-2xl">
              Peer-reviewed papers, conference articles, and working papers available for public reading.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative max-w-xs flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input variant="site-search"
                value={paperSearch}
                onChange={e => setPaperSearch(e.target.value)}
                placeholder="Search title or author…"
                aria-label="Search papers"
                className="w-full focus:ring-violet-400/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {allPaperStatuses.map(s => (
                <Button variant="unstyled"
                  key={s}
                  onClick={() => setPaperStatus(s)}
                  aria-pressed={paperStatus === s}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    paperStatus === s ? "bg-site-accent/15 text-site-accent ring-1 ring-inset ring-site-accent/30" : "bg-white/[0.04] text-slate-300 border border-white/10 hover:border-white/15"
                  }`}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <p className="text-slate-400 text-sm mb-6">{filteredPublished.length} result{filteredPublished.length !== 1 ? "s" : ""}</p>

          <div className="space-y-5">
            {filteredPublished.map((paper, idx) => (
              <Card variant="site-white-card"
                key={paper.id}
                className="p-7 hover:shadow-md hover:border-white/10 transition-all group"
              >
                <div className="flex items-start gap-5">
                  <span className="font-mono text-2xl text-slate-200 font-bold select-none flex-shrink-0 w-8 pt-1">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="unstyled" className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${paperStatusColor[paper.status] ?? "bg-white/[0.03] text-slate-300 border-white/10"}`}>
                        {paper.status}
                      </Badge>
                      {paper.area && (
                        <Badge variant="unstyled" className="px-2.5 py-0.5 bg-white/[0.03] text-slate-400 text-xs rounded-full border border-white/10">
                          {paper.area}
                        </Badge>
                      )}
                      <span className="text-slate-400 text-xs font-mono">{paper.year}</span>
                    </div>

                    <h3 className="font-serif text-xl text-slate-100 mb-2 group-hover:text-site-accent transition-colors leading-snug">
                      {paper.title}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400 mb-3">
                      {paper.authors.length > 0 && <span>{paper.authors.join(", ")}</span>}
                      {paper.journal && paper.authors.length > 0 && (
                        <>
                          <span className="text-slate-300">·</span>
                        </>
                      )}
                      {paper.journal && <span className="text-site-accent font-medium">{paper.journal}</span>}
                    </div>

                    <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">{paper.abstract}</p>

                    {paper.doi && (
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                        <Hash size={11} />
                        <code className="text-teal-300 break-all">{paper.doi}</code>
                        <CopyButton text={paper.doi} label="Copy DOI"
                          className="flex items-center gap-1 hover:text-slate-300 transition-colors" />
                      </div>
                    )}

                    {paper.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper.keywords.slice(0, 5).map((k) => (
                          <Badge variant="unstyled" key={k} className="px-2.5 py-1 bg-white/[0.03] text-slate-400 text-xs rounded-lg border border-white/10">{k}</Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      {paperLink(paper) && (
                        <Button asChild variant="site-primary" className="flex items-center gap-1.5 px-3.5 py-2 text-xs transition-colors">
                          <a href={paperLink(paper)} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={12} /> Read Paper
                          </a>
                        </Button>
                      )}
                      {paper.pdfUrl && (
                        <Button asChild variant="site-outline" className="flex items-center gap-1.5 px-3.5 py-2 text-slate-300 text-xs font-medium hover:border-white/15 transition-colors">
                          <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Download size={12} /> PDF
                          </a>
                        </Button>
                      )}
                      <Link
                        href={`/research/${paper.id}`}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.03] border border-white/10 text-slate-300 text-xs font-medium rounded-xl hover:bg-white/[0.06] transition-colors"
                      >
                        <BookOpen size={12} /> Details
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredPublished.length === 0 && (
            <div className="text-center py-20">
              <BookOpen size={40} className="mx-auto mb-4 text-slate-200" />
              <p className="text-slate-400">{papers.length === 0 ? "No papers yet." : "No publications match your search."}</p>
            </div>
          )}

          <div className="flex justify-end mt-8">
            <Button variant="unstyled"
              onClick={() => setActiveSection("upcoming")}
              className="flex items-center gap-2 text-sm text-site-accent font-medium hover:gap-3 transition-all"
            >
              See Upcoming Research <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      )}

      {/* ── Section: Upcoming Topics ─────────────────────────────────────────── */}
      {activeSection === "upcoming" && (
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="mb-8">
            <h2 className="font-serif text-3xl text-slate-100 mb-3">Upcoming Research</h2>
            <p className="text-slate-400 max-w-2xl">
              Research topics currently in development — from early ideas through active data collection. Each entry outlines the research question, expected contribution, and methodology.
            </p>
          </div>

          {/* Area filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {allAreas.map(a => (
              <Button variant="unstyled"
                key={a}
                onClick={() => setTopicArea(a)}
                aria-pressed={topicArea === a}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  topicArea === a ? "bg-site-accent/15 text-site-accent ring-1 ring-inset ring-site-accent/30" : "bg-white/[0.06] text-slate-300 hover:bg-white/10"
                }`}
              >
                {a}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredTopics.map((topic) => {
              const sc = upcomingStatusConfig[topic.status] ?? { color: "bg-white/[0.06] text-slate-300 border-white/10", icon: null };
              const isOpen = topicExpanded === topic.id;
              return (
                <div key={topic.id} className="border border-white/10 rounded-2xl overflow-hidden hover:border-site-accent/40 transition-colors">
                  <Button variant="unstyled"
                    onClick={() => setTopicExpanded(isOpen ? null : topic.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start gap-5 p-6 text-left hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="unstyled" className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border font-medium ${sc.color}`}>
                          {sc.icon} {topic.status}
                        </Badge>
                        {topic.area && <Badge variant="unstyled" className="px-2.5 py-1 rounded-full bg-white/[0.06] text-slate-300 text-xs">{topic.area}</Badge>}
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
                          {topic.keywords.map(kw => (
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

          {filteredTopics.length === 0 && (
            <div className="text-center py-20">
              <Microscope size={40} className="text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">{upcomingTopics.length === 0 ? "No upcoming topics yet." : "No topics match the current filter."}</p>
            </div>
          )}

          {/* Collaboration CTA */}
          <div className="mt-16 glass-card rounded-3xl p-8 text-center">
            <h3 className="font-serif text-2xl text-white mb-3">Interested in Collaboration?</h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
              If any of these research directions align with your expertise or organisational needs, I welcome conversations about potential research collaboration or industry partnerships.
            </p>
            <Button asChild variant="site-primary" className="inline-flex items-center gap-2 px-6 py-3 text-sm transition-colors"><Link
              href="/contact"
             
            >
              Get in Touch <ArrowRight size={14} />
            </Link></Button>
          </div>
        </div>
      )}
    </div>
  );
}
