"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Download, Library } from "lucide-react";
import type { EBook } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function EBooks({ ebooks }: { ebooks: EBook[] }) {
  const [active, setActive] = useState("All");

  const categories = ["All", ...Array.from(new Set(ebooks.map((b) => b.category).filter(Boolean)))];
  const filtered = active === "All" ? ebooks : ebooks.filter((b) => b.category === active);
  const totalPages = ebooks.reduce((sum, b) => sum + b.pages, 0);
  const downloads = ebooks.reduce((sum, b) => sum + b.downloads, 0);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center">
              <Library size={18} className="text-orange-400" />
            </div>
            <span className="text-orange-400 text-sm font-medium tracking-wide uppercase">Library</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Books &<br /><span className="italic text-orange-300">eBooks</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed mb-10">
            Free books and practical guides — written for professionals and researchers alike. Read online or download.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: ebooks.length, label: "Total Titles" },
              { value: totalPages.toLocaleString("en-US"), label: "Total Pages" },
              { value: categories.length - 1, label: "Topics Covered" },
              { value: downloads.toLocaleString("en-US"), label: "Downloads" },
            ].map(({ value, label }) => (
              <Card variant="site-glass-dark" key={label} className="p-4">
                <div className="font-serif text-3xl text-white">{value}</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="sticky top-[72px] z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button variant="unstyled"
                key={cat}
                onClick={() => setActive(cat)}
                aria-pressed={active === cat}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active === cat
                    ? "bg-[#040d1f] text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {ebooks.length === 0 ? (
          <p className="text-center py-16 text-slate-400">No eBooks yet.</p>
        ) : (
          <p className="text-slate-400 text-sm mb-6">{filtered.length} title{filtered.length !== 1 ? "s" : ""}</p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((book) => (
            // The title link stretches over the whole card; the action links sit above it.
            <div
              key={book.id}
              className="relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all group flex flex-col"
            >
              {/* Cover */}
              <div className="relative h-64 bg-slate-100 overflow-hidden flex items-center justify-center">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Library size={48} className="text-orange-300" aria-hidden />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                {book.category && (
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="unstyled" className="bg-white/90 text-xs font-medium text-slate-700 px-2.5 py-1 rounded-full">
                      {book.category}
                    </Badge>
                  </div>
                )}
                {book.fileUrl && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="unstyled" className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-400 text-white">
                      Free
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-serif text-xl text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  <Link href={`/ebooks/${book.id}`} className="after:absolute after:inset-0 after:content-['']">
                    {book.title}
                  </Link>
                </h3>
                <p className="text-slate-500 text-sm mb-2">{book.subtitle}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <BookOpen size={12} /> {[book.pages > 0 && `${book.pages} pages`, book.year].filter(Boolean).join(" · ")}
                </div>
                <p className="text-slate-500 text-sm line-clamp-2 flex-1 mb-5">{book.description}</p>
                {book.fileUrl && (
                  <div className="relative z-10 flex gap-2">
                    {/* Route Handler: counts the download, then redirects to the PDF. */}
                    <Button asChild variant="site-primary"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs transition-colors">
                      <a href={`/api/ebooks/${book.id}/download`}><Download size={13} /> Download</a>
                    </Button>
                    <Button asChild variant="unstyled"
                      className="px-3 py-2.5 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-medium rounded-xl hover:bg-slate-100 transition-colors">
                      <Link href={`/ebooks/${book.id}#reader`}>Preview</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
