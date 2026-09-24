import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, Copy, BookOpen, Users, Calendar, Hash, ArrowRight } from "lucide-react";
import { researchPapers, profile } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const statusConfig: Record<string, { label: string; color: string }> = {
  Published:      { label: "Published",      color: "bg-green-50 text-green-700 border-green-200" },
  "Under Review": { label: "Under Review",   color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  "Working Paper":{ label: "Working Paper",  color: "bg-blue-50 text-blue-700 border-blue-200" },
  Submitted:      { label: "Submitted",      color: "bg-blue-50 text-blue-700 border-blue-200" },
  "Revision Requested": { label: "Revision Requested", color: "bg-orange-50 text-orange-700 border-orange-200" },
  Accepted:       { label: "Accepted",       color: "bg-teal-50 text-teal-700 border-teal-200" },
};

export default function ResearchDetail({ id }: { id: string }) {
  const paper = researchPapers.find((p) => p.id === Number(id));
  const others = researchPapers.filter((p) => p.id !== Number(id)).slice(0, 2);

  if (!paper) return (
    <div className="min-h-screen pt-32 text-center text-slate-400">Paper not found.</div>
  );

  const status = statusConfig[paper.status] ?? { label: paper.status, color: "bg-slate-100 text-slate-600 border-slate-200" };

  return (
    <div className="min-h-screen">
      {/* Header band */}
      <div className="bg-(color:--site-top) pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/research" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors w-fit">
            <ArrowLeft size={14} /> Research
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Badge variant="unstyled" className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
              {status.label}
            </Badge>
            <Badge variant="unstyled" className="text-slate-400 text-xs px-3 py-1 bg-white/10 rounded-full">{paper.area}</Badge>
            <span className="text-slate-400 text-xs font-mono">{paper.year}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white leading-snug mb-6">{paper.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><Users size={14} /> {paper.authors.join(", ")}</span>
            <span className="flex items-center gap-1.5"><BookOpen size={14} /> {paper.journal}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {paper.year}</span>
          </div>
        </div>
      </div>

      {/* Scholar metrics strip */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap gap-6">
          {[
            { label: "Citations", value: profile.scholarMetrics.citations },
            { label: "h-Index", value: profile.scholarMetrics.hIndex },
            { label: "i10-Index", value: profile.scholarMetrics.i10Index },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="font-serif text-xl text-[#040d1f]">{value}</div>
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
            <div>
              <h2 className="font-serif text-xl text-[#040d1f] mb-4">Abstract</h2>
              <p className="text-slate-600 leading-relaxed text-base">{paper.abstract}</p>
            </div>

            {paper.keywords.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-[#040d1f] mb-4 flex items-center gap-2">
                  <Hash size={16} className="text-blue-500" /> Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {paper.keywords.map((k) => (
                    <span key={k} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors cursor-default">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* DOI */}
            {paper.doi && (
              <div>
                <h2 className="font-serif text-xl text-[#040d1f] mb-4">Digital Object Identifier</h2>
                <Card variant="site-panel" className="flex items-center gap-3 p-4">
                  <code className="text-slate-800 text-sm font-mono flex-1">{paper.doi}</code>
                  <Button variant="unstyled" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors px-3 py-1.5 bg-white rounded-lg border border-slate-200 hover:border-cyan-300">
                    <Copy size={12} /> Copy
                  </Button>
                </Card>
              </div>
            )}

            {/* Citation format */}
            <div>
              <h2 className="font-serif text-xl text-[#040d1f] mb-4">How to Cite</h2>
              <Card variant="site-panel" className="p-5">
                <p className="text-sm text-slate-600 font-mono leading-relaxed">
                  {paper.authors.join(", ")} ({paper.year}). {paper.title}. <em>{paper.journal}</em>
                  {paper.doi ? `. https://doi.org/${paper.doi}` : "."}
                </p>
                <Button variant="unstyled" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 mt-3 transition-colors">
                  <Copy size={11} /> Copy APA citation
                </Button>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Actions */}
            <div className="space-y-2.5">
              <Button variant="site-primary" className="w-full flex items-center justify-center gap-2 py-3 text-sm transition-colors shadow-sm">
                <ExternalLink size={15} /> Read Full Paper
              </Button>
              <Button variant="site-outline" className="w-full flex items-center justify-center gap-2 py-3 text-slate-700 text-sm font-medium hover:border-cyan-300 hover:text-blue-600 transition-colors">
                <Download size={15} /> Download PDF
              </Button>
            </div>

            {/* Details card */}
            <Card variant="site-panel" className="p-5 space-y-3">
              <h4 className="text-xs text-slate-400 uppercase tracking-wider">Publication Details</h4>
              {[
                { label: "Journal", value: paper.journal },
                { label: "Year", value: String(paper.year) },
                { label: "Research Area", value: paper.area },
                { label: "Status", value: paper.status },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5 py-2 border-b border-slate-100 last:border-0">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-sm text-slate-700 font-medium">{value}</span>
                </div>
              ))}
            </Card>

            {/* Scholar link */}
            <a
              href={profile.scholar}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <BookOpen size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-700 font-medium group-hover:text-blue-600 transition-colors">Google Scholar</p>
                <p className="text-xs text-slate-400">View full publication record</p>
              </div>
              <ExternalLink size={13} className="ml-auto text-slate-300 group-hover:text-cyan-400 transition-colors" />
            </a>
          </div>
        </div>

        {/* Related papers */}
        {others.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-100">
            <h2 className="font-serif text-2xl text-[#040d1f] mb-6">Related Research</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {others.map((p) => {
                const pStatus = statusConfig[p.status] ?? { label: p.status, color: "bg-slate-100 text-slate-600 border-slate-200" };
                return (
                  <Link
                    key={p.id}
                    href={`/research/${p.id}`}
                    className="group bg-slate-50 rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="unstyled" className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${pStatus.color}`}>{pStatus.label}</Badge>
                      <span className="text-xs text-slate-400 font-mono">{p.year}</span>
                    </div>
                    <h4 className="font-serif text-base text-[#040d1f] group-hover:text-blue-600 transition-colors leading-snug mb-2">{p.title}</h4>
                    <p className="text-xs text-slate-400 mb-3">{p.journal}</p>
                    <span className="flex items-center gap-1 text-xs text-blue-600 font-medium group-hover:gap-2 transition-all">
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
