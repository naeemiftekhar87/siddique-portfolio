import Link from "next/link";
import { ArrowLeft, Download, BookOpen, User, Hash, ArrowRight, ExternalLink, Library } from "lucide-react";
import type { EBook, SiteProfile } from "@/lib/data";
import { ShareButton } from "@/components/portfolio/share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function Cover({ book, className }: { book: EBook; className: string }) {
  return book.image ? (
    <img src={book.image} alt={book.title} className={className} />
  ) : (
    <div className={`${className} aspect-[3/4] bg-gradient-to-br from-orange-100 to-slate-100 flex items-center justify-center`} aria-hidden>
      <Library size={32} className="text-orange-400" />
    </div>
  );
}

export default function BookDetail({ book, others, profile }: { book: EBook; others: EBook[]; profile: SiteProfile }) {
  const downloadUrl = `/api/ebooks/${book.id}/download`;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-(color:--site-top) to-(color:--site-top-end) pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/ebooks" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors w-fit">
            <ArrowLeft size={14} /> Library
          </Link>
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Cover */}
            <div className="flex-shrink-0">
              <div className="w-40 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <Cover book={book} className="w-full object-cover" />
              </div>
            </div>
            {/* Info */}
            <div className="flex-1">
              {book.category && (
                <Badge variant="unstyled" className="inline-block px-3 py-1 bg-blue-600/30 text-cyan-300 text-xs rounded-full border border-blue-500/30 mb-4">
                  {book.category}
                </Badge>
              )}
              <h1 className="font-serif text-3xl sm:text-4xl text-white mb-2">{book.title}</h1>
              {book.subtitle && <p className="text-slate-300 text-lg mb-5">{book.subtitle}</p>}
              <div className="flex flex-wrap gap-5 text-sm text-slate-400 mb-6">
                {book.author && <span className="flex items-center gap-1.5"><User size={14} /> {book.author}</span>}
                {book.pages > 0 && <span className="flex items-center gap-1.5"><BookOpen size={14} /> {book.pages} pages</span>}
                {book.year && <span className="flex items-center gap-1.5"><Hash size={14} /> {book.year}</span>}
                {book.fileUrl && <span className="flex items-center gap-1.5 text-teal-400 font-semibold">Free Download</span>}
              </div>
              <div className="flex flex-wrap gap-3">
                {book.fileUrl && (
                  <>
                    <Button asChild variant="site-primary" className="flex items-center gap-2 px-6 py-3 text-sm transition-colors shadow-sm">
                      <a href="#reader"><BookOpen size={15} /> Read Online</a>
                    </Button>
                    <Button asChild variant="site-glass" className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors">
                      <a href={downloadUrl}><Download size={15} /> Free Download</a>
                    </Button>
                  </>
                )}
                <ShareButton title={book.title} className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors" />
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
            {book.description && (
              <div>
                <h2 className="font-serif text-2xl text-[#040d1f] mb-4">About This Book</h2>
                <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">{book.description}</p>
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
                { label: "Pages", value: book.pages > 0 ? `${book.pages} pages` : "" },
                { label: "Year", value: book.year ? String(book.year) : "" },
                { label: "ISBN", value: book.isbn },
                { label: "Category", value: book.category },
                { label: "Price", value: "Free" },
              ].filter(({ value }) => value).map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5 py-2 border-b border-slate-100 last:border-0">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-sm text-slate-700 font-medium">{value}</span>
                </div>
              ))}
            </Card>

            {/* Author card */}
            {book.author && (
              <Card variant="site-glass-card" className="p-5">
                <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-4">About the Author</h4>
                <div className="flex items-center gap-3 mb-3">
                  {profile.photo && book.author === profile.name ? (
                    <img src={profile.photo} alt={book.author} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0" aria-hidden>
                      <User size={18} className="text-slate-400" />
                    </div>
                  )}
                  <div>
                    <p className="text-slate-800 font-semibold text-sm">{book.author}</p>
                    {book.author === profile.name && profile.headline && <p className="text-slate-400 text-xs">{profile.headline}</p>}
                  </div>
                </div>
                <Link href="/about" className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-3">
                  View full profile <ArrowRight size={11} />
                </Link>
              </Card>
            )}
          </div>
        </div>

        {/* In-site reader. Browsers that cannot show PDFs inline (Android
            Chrome and some other mobile browsers) render the fallback. */}
        {book.fileUrl && (
          <section id="reader" className="mt-16 pt-10 border-t border-slate-100 scroll-mt-24">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h2 className="font-serif text-2xl text-[#040d1f]">Read Online</h2>
              <a href={book.fileUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline">
                Open in new tab <ExternalLink size={13} />
              </a>
            </div>
            <object data={book.fileUrl} type="application/pdf" aria-label={`${book.title} (PDF)`}
              className="w-full h-[80vh] min-h-[480px] rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex flex-col items-center justify-center text-center gap-4 p-10 h-full">
                <BookOpen size={36} className="text-slate-300" />
                <p className="text-slate-500 text-sm max-w-sm">
                  Your browser can&apos;t show the PDF here. Open it in a new tab or download it instead.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild variant="site-primary" className="flex items-center gap-2 px-5 py-2.5 text-sm">
                    <a href={book.fileUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /> Open PDF</a>
                  </Button>
                  <Button asChild variant="site-outline" className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-700">
                    <a href={downloadUrl}><Download size={14} /> Download</a>
                  </Button>
                </div>
              </div>
            </object>
          </section>
        )}

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
                  <Cover book={b} className="w-14 rounded-xl object-cover flex-shrink-0 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base text-[#040d1f] group-hover:text-blue-600 transition-colors leading-snug mb-1">{b.title}</h4>
                    {b.subtitle && <p className="text-slate-400 text-xs mb-1">{b.subtitle}</p>}
                    {b.fileUrl && <span className="text-xs font-semibold text-teal-600">Free</span>}
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
