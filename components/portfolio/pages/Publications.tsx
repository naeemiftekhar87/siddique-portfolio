"use client";

import { useState } from "react";
import { Search, ExternalLink, Download, Copy, BookOpen, Hash } from "lucide-react";
import Link from "next/link";
import { publications, profile } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const statusConfig: Record<string, { color: string }> = {
  Published:       { color: "bg-green-50 text-green-700 border-green-200" },
  "Under Review":  { color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  "Working Paper": { color: "bg-blue-50 text-blue-700 border-blue-200" },
  Submitted:       { color: "bg-blue-50 text-blue-700 border-blue-200" },
  "Revision Requested": { color: "bg-orange-50 text-orange-700 border-orange-200" },
  Accepted:        { color: "bg-teal-50 text-teal-700 border-teal-200" },
};

const allStatuses = ["All", ...Array.from(new Set(publications.map((p) => p.status)))];

export default function Publications() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = publications.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(q) || p.area.toLowerCase().includes(q) || p.journal.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <BookOpen size={18} className="text-cyan-400" />
            </div>
            <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">Academic Output</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Publications &<br /><span className="italic text-cyan-300">Research Output</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed mb-10">
            Peer-reviewed articles, conference papers, and working papers spanning your research areas.
          </p>

          {/* Scholar metrics strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: profile.scholarMetrics.publications, label: "Publications" },
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
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[72px] z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4">
          <div className="relative max-w-xs flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input variant="site-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, area, journal…"
              className="w-full focus:ring-blue-100"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {allStatuses.map((s) => (
              <Button variant="unstyled"
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${statusFilter === s ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-cyan-300"}`}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-slate-400 text-sm mb-6">{filtered.length} publication{filtered.length !== 1 ? "s" : ""}</p>

        <div className="space-y-5">
          {filtered.map((pub, idx) => {
            const status = statusConfig[pub.status] ?? { color: "bg-slate-100 text-slate-600 border-slate-200" };
            return (
              <Card variant="site-white-card" key={pub.id} className="p-7 hover:shadow-md hover:border-slate-200 transition-all group">
                <div className="flex items-start gap-5">
                  <span className="font-mono text-2xl text-slate-200 font-bold select-none flex-shrink-0 w-8 pt-1">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="unstyled" className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                        {pub.status}
                      </Badge>
                      <Badge variant="unstyled" className="text-xs text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
                        {pub.area}
                      </Badge>
                      <span className="text-xs text-slate-400 font-mono">{pub.year}</span>
                    </div>

                    <h3 className="font-serif text-xl text-[#040d1f] mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                      {pub.title}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
                      <span>{pub.authors.join(", ")}</span>
                      {pub.journal && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-blue-600 font-medium">{pub.journal}</span>
                        </>
                      )}
                    </div>

                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">{pub.abstract}</p>

                    {pub.doi && (
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                        <Hash size={11} />
                        <code className="text-teal-600">{pub.doi}</code>
                        <Button variant="unstyled" className="hover:text-slate-600 transition-colors">
                          <Copy size={11} />
                        </Button>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button variant="site-primary" className="flex items-center gap-1.5 px-3.5 py-2 text-xs transition-colors">
                        <ExternalLink size={12} /> Read Paper
                      </Button>
                      <Button variant="site-outline" className="flex items-center gap-1.5 px-3.5 py-2 text-slate-600 text-xs font-medium hover:border-slate-300 transition-colors">
                        <Download size={12} /> PDF
                      </Button>
                      <Link
                        href={`/research/${pub.id}`}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-medium rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <BookOpen size={12} /> Details
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen size={40} className="mx-auto mb-4 text-slate-200" />
            <p className="text-slate-400">No publications match your search.</p>
          </div>
        )}

        {/* Google Scholar CTA */}
        <div className="mt-14 bg-slate-50 rounded-3xl border border-slate-100 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <BookOpen size={24} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-xl text-[#040d1f] mb-1">Full Publication Record</h3>
            <p className="text-slate-500 text-sm">View the complete list of publications, citation history, and metrics on Google Scholar.</p>
          </div>
          <a
            href={profile.scholar}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#040d1f] text-white text-sm font-medium rounded-xl hover:bg-blue-900 transition-colors flex-shrink-0"
          >
            <ExternalLink size={14} /> Google Scholar
          </a>
        </div>
      </section>
    </div>
  );
}
