import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, BookOpen, Users, Calendar, Hash, ArrowRight } from "lucide-react";
import type { Paper, SiteProfile } from "@/lib/data";
import { apaCitation, bibtexCitation } from "@/lib/data/citation";
import { CopyButton } from "@/components/portfolio/copy-button";
import { paperLink } from "@/lib/data/research";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const statusConfig: Record<string, { label: string; color: string }> = {
  Published:      { label: "Published",      color: "bg-green-400/10 text-green-300 border-green-400/20" },
  "Under Review": { label: "Under Review",   color: "bg-yellow-400/10 text-yellow-300 border-yellow-400/20" },
  "Working Paper":{ label: "Working Paper",  color: "bg-site-accent/10 text-site-accent border-site-accent/20" },
  Submitted:      { label: "Submitted",      color: "bg-site-accent/10 text-site-accent border-site-accent/20" },
  "Revision Requested": { label: "Revision Requested", color: "bg-orange-400/10 text-orange-300 border-orange-400/20" },
  Accepted:       { label: "Accepted",       color: "bg-teal-400/10 text-teal-300 border-teal-400/20" },
};

export default function ResearchDetail({ paper, others, profile }: { paper: Paper; others: Paper[]; profile: SiteProfile }) {
  const readUrl = paperLink(paper);
  const apa = apaCitation(paper);

  const status = statusConfig[paper.status] ?? { label: paper.status, color: "bg-white/[0.06] text-slate-300 border-white/10" };

  return (
    <div className="min-h-screen">
      {/* Header band */}
      <div className="site-hero bg-(color:--site-top) pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/research" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors w-fit">
            <ArrowLeft size={14} /> Research
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Badge variant="unstyled" className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
              {status.label}
            </Badge>
            {paper.area && <Badge variant="unstyled" className="text-slate-400 text-xs px-3 py-1 bg-white/10 rounded-full">{paper.area}</Badge>}
            <span className="text-slate-400 text-xs font-mono">{paper.year}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white leading-snug mb-6">{paper.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            {paper.authors.length > 0 && <span className="flex items-center gap-1.5"><Users size={14} /> {paper.authors.join(", ")}</span>}
            {paper.journal && <span className="flex items-center gap-1.5"><BookOpen size={14} /> {paper.journal}</span>}
            {paper.year && <span className="flex items-center gap-1.5"><Calendar size={14} /> {paper.year}</span>}
          </div>
        </div>
      </div>

      {/* Scholar metrics strip */}
      <div className="bg-white/[0.03] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap gap-6">
          {[
            { label: "Citations", value: profile.scholarMetrics.citations },
            { label: "h-Index", value: profile.scholarMetrics.hIndex },
            { label: "i10-Index", value: profile.scholarMetrics.i10Index },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="font-serif text-xl text-slate-100">{value}</div>
              <div className="text-slate-400 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left: abstract + keywords */}
          <div className="lg:col-span-2 space-y-8">
            {paper.abstract && (
              <div>
                <h2 className="font-serif text-xl text-slate-100 mb-4">Abstract</h2>
                <p className="text-slate-300 leading-relaxed text-base whitespace-pre-line">{paper.abstract}</p>
              </div>
            )}

            {paper.keywords.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-slate-100 mb-4 flex items-center gap-2">
                  <Hash size={16} className="text-site-accent" /> Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {paper.keywords.map((k) => (
                    <span key={k} className="px-3 py-1.5 bg-site-accent/10 text-site-accent text-sm rounded-xl border border-site-accent/20 hover:bg-site-accent/15 transition-colors cursor-default">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* DOI */}
            {paper.doi && (
              <div>
                <h2 className="font-serif text-xl text-slate-100 mb-4">Digital Object Identifier</h2>
                <Card variant="site-panel" className="flex items-center gap-3 p-4">
                  <code className="text-slate-100 text-sm font-mono flex-1 break-all">{paper.doi}</code>
                  <CopyButton text={paper.doi} label="Copy" iconSize={12}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-site-accent transition-colors px-3 py-1.5 bg-white/[0.04] rounded-lg border border-white/10 hover:border-site-accent/40" />
                </Card>
              </div>
            )}

            {/* Citation format */}
            <div>
              <h2 className="font-serif text-xl text-slate-100 mb-4">How to Cite</h2>
              <Card variant="site-panel" className="p-5">
                <p className="text-sm text-slate-300 font-mono leading-relaxed break-words">{apa}</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <CopyButton text={apa} label="Copy APA citation"
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-site-accent transition-colors" />
                  <CopyButton text={bibtexCitation(paper)} label="Copy BibTeX"
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-site-accent transition-colors" />
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Actions */}
            {(readUrl || paper.pdfUrl || paper.preprintUrl) && (
              <div className="space-y-2.5">
                {readUrl && (
                  <Button asChild variant="site-primary" className="w-full flex items-center justify-center gap-2 py-3 text-sm transition-colors shadow-sm">
                    <a href={readUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Read Full Paper</a>
                  </Button>
                )}
                {paper.pdfUrl && (
                  <Button asChild variant="site-outline" className="w-full flex items-center justify-center gap-2 py-3 text-slate-200 text-sm font-medium hover:border-site-accent/40 hover:text-site-accent transition-colors">
                    <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer"><Download size={15} /> Download PDF</a>
                  </Button>
                )}
                {paper.preprintUrl && (
                  <Button asChild variant="site-outline" className="w-full flex items-center justify-center gap-2 py-3 text-slate-200 text-sm font-medium hover:border-site-accent/40 hover:text-site-accent transition-colors">
                    <a href={paper.preprintUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Preprint</a>
                  </Button>
                )}
              </div>
            )}

            {/* Details card */}
            <Card variant="site-panel" className="p-5 space-y-3">
              <h4 className="text-xs text-slate-400 uppercase tracking-wider">Publication Details</h4>
              {[
                { label: "Journal", value: paper.journal },
                { label: "Year", value: paper.year ? String(paper.year) : "" },
                { label: "Research Area", value: paper.area },
                { label: "Status", value: paper.status },
                { label: "Version", value: paper.status !== "Published" && paper.status !== "Accepted" ? paper.version : "" },
              ].filter(({ value }) => value).map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5 py-2 border-b border-white/10 last:border-0">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-sm text-slate-200 font-medium">{value}</span>
                </div>
              ))}
            </Card>

            {/* Scholar link */}
            {profile.scholar && (
            <a
              href={profile.scholar}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 glass-card rounded-2xl transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-site-accent/10 flex items-center justify-center flex-shrink-0">
                <BookOpen size={16} className="text-site-accent" />
              </div>
              <div>
                <p className="text-sm text-slate-200 font-medium group-hover:text-site-accent transition-colors">Google Scholar</p>
                <p className="text-xs text-slate-400">View full publication record</p>
              </div>
              <ExternalLink size={13} className="ml-auto text-slate-300 group-hover:text-site-accent transition-colors" />
            </a>
            )}
          </div>
        </div>

        {/* Related papers */}
        {others.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/10">
            <h2 className="font-serif text-2xl text-slate-100 mb-6">Related Research</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {others.map((p) => {
                const pStatus = statusConfig[p.status] ?? { label: p.status, color: "bg-white/[0.06] text-slate-300 border-white/10" };
                return (
                  <Link
                    key={p.id}
                    href={`/research/${p.id}`}
                    className="group bg-white/[0.03] rounded-2xl border border-white/10 p-5 hover:border-site-accent/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="unstyled" className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${pStatus.color}`}>{pStatus.label}</Badge>
                      <span className="text-xs text-slate-400 font-mono">{p.year}</span>
                    </div>
                    <h4 className="font-serif text-base text-slate-100 group-hover:text-site-accent transition-colors leading-snug mb-2">{p.title}</h4>
                    <p className="text-xs text-slate-400 mb-3">{p.journal}</p>
                    <span className="flex items-center gap-1 text-xs text-site-accent font-medium group-hover:gap-2 transition-all">
                      Read paper <ArrowRight size={12} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
