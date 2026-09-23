import Link from "next/link";
import { ArrowLeft, Download, BookOpen, User, Hash, Star, ArrowRight, Share2 } from "lucide-react";
import { ebooks } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const tableOfContents: Record<number, string[]> = {
  1: [
    "Sample Chapter 1",
    "Sample Chapter 2",
    "Sample Chapter 3",
    "Sample Chapter 4",
    "Sample Chapter 5",
    "Sample Chapter 6",
    "Sample Chapter 7",
    "Sample Chapter 8",
  ],
  2: [
    "Sample Chapter 1",
    "Sample Chapter 2",
    "Sample Chapter 3",
    "Sample Chapter 4",
    "Sample Chapter 5",
    "Sample Chapter 6",
    "Sample Chapter 7",
    "Sample Chapter 8",
    "Sample Chapter 9",
  ],
  3: [
    "Sample Chapter 1",
    "Sample Chapter 2",
    "Sample Chapter 3",
    "Sample Chapter 4",
    "Sample Chapter 5",
    "Sample Chapter 6",
    "Sample Chapter 7",
    "Sample Chapter 8",
    "Sample Chapter 9",
    "Sample Chapter 10",
  ],
};

export default function BookDetail({ id }: { id: string }) {
  const book = ebooks.find((b) => b.id === Number(id));
  const others = ebooks.filter((b) => b.id !== Number(id));

  if (!book) return (
    <div className="min-h-screen pt-32 text-center text-slate-400">Book not found.</div>
  );

  const toc = tableOfContents[book.id] ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#040d1f] to-blue-950 pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/ebooks" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors w-fit">
            <ArrowLeft size={14} /> Library
          </Link>
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Cover */}
            <div className="flex-shrink-0">
              <div className="w-40 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img src={book.image} alt={book.title} className="w-full object-cover" />
              </div>
            </div>
            {/* Info */}
            <div className="flex-1">
              <Badge variant="unstyled" className="inline-block px-3 py-1 bg-blue-600/30 text-cyan-300 text-xs rounded-full border border-blue-500/30 mb-4">
                {book.category}
              </Badge>
              <h1 className="font-serif text-3xl sm:text-4xl text-white mb-2">{book.title}</h1>
              <p className="text-slate-300 text-lg mb-5">{book.subtitle}</p>
              <div className="flex flex-wrap gap-5 text-sm text-slate-400 mb-6">
                <span className="flex items-center gap-1.5"><User size={14} /> {book.author}</span>
                <span className="flex items-center gap-1.5"><BookOpen size={14} /> {book.pages} pages</span>
                <span className="flex items-center gap-1.5"><Hash size={14} /> {book.year}</span>
                <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
                  {book.price === "Free" ? "Free Download" : book.price}
                </span>
              </div>
              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={14} className={n <= 4 ? "text-amber-400 fill-amber-400" : "text-slate-600"} />
                  ))}
                </div>
                <span className="text-slate-400 text-sm">4.0 · 48 readers</span>
              </div>
              <div className="flex gap-3">
                <Button variant="site-primary" className="flex items-center gap-2 px-6 py-3 text-sm transition-colors shadow-sm">
                  <Download size={15} />
                  {book.price === "Free" ? "Free Download" : "Purchase & Download"}
                </Button>
                <Button variant="site-glass" className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors">
                  <Share2 size={15} /> Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-serif text-2xl text-[#040d1f] mb-4">About This Book</h2>
              <p className="text-slate-600 leading-relaxed text-base">{book.description}</p>
            </div>

            {toc.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl text-[#040d1f] mb-5">Table of Contents</h2>
                <div className="space-y-2">
                  {toc.map((chapter, i) => (
                    <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                      <span className="font-mono text-sm text-slate-400 w-5 text-right flex-shrink-0">{i + 1}</span>
                      <span className="text-slate-700 text-sm group-hover:text-[#040d1f] transition-colors">{chapter}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Book details */}
            <Card variant="site-panel" className="p-5 space-y-3">
              <h4 className="text-xs text-slate-400 uppercase tracking-wider">Book Details</h4>
              {[
                { label: "Author", value: book.author },
                { label: "Pages", value: `${book.pages} pages` },
                { label: "Year", value: String(book.year) },
                { label: "ISBN", value: book.isbn },
                { label: "Category", value: book.category },
                { label: "Price", value: book.price },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5 py-2 border-b border-slate-100 last:border-0">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-sm text-slate-700 font-medium">{value}</span>
                </div>
              ))}
            </Card>

            {/* Author card */}
            <Card variant="site-glass-card" className="p-5">
              <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-4">About the Author</h4>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                  alt="Author"
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-slate-800 font-semibold text-sm">{book.author}</p>
                  <p className="text-slate-400 text-xs">Your Field</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Placeholder author bio. Replace it with one or two sentences about your background and expertise.
              </p>
              <Link href="/about" className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-3">
                View full profile <ArrowRight size={11} />
              </Link>
            </Card>
          </div>
        </div>

        {/* Other books */}
        {others.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-100">
            <h2 className="font-serif text-2xl text-[#040d1f] mb-6">More from the Library</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {others.map((b) => (
                <Link
                  key={b.id}
                  href={`/ebooks/${b.id}`}
                  className="group flex gap-4 bg-slate-50 rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <img src={b.image} alt={b.title} className="w-14 rounded-xl object-cover flex-shrink-0 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base text-[#040d1f] group-hover:text-blue-600 transition-colors leading-snug mb-1">{b.title}</h4>
                    <p className="text-slate-400 text-xs mb-1">{b.subtitle}</p>
                    <span className={`text-xs font-semibold ${b.price === "Free" ? "text-teal-600" : "text-blue-600"}`}>{b.price}</span>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 flex-shrink-0 self-center transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
