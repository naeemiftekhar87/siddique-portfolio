"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = [
  { label: "Home",         to: "/" },
  { label: "About",        to: "/about" },
  { label: "Portfolio",    to: "/portfolio" },
  { label: "Research",     to: "/research" },
  { label: "Certificates", to: "/certificates" },
  { label: "Contact",      to: "/contact" },
];

export default function NotFound() {
  // The 404 page is prerendered once at build time, so read the requested
  // path in the browser (the server snapshot is empty) to avoid a mismatch.
  const pathname = useSyncExternalStore(
    () => () => {},
    () => window.location.pathname,
    () => "",
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dark header band */}
      <section className="bg-(color:--site-top) py-20 px-6 flex-1 flex items-center">
        <div className="max-w-3xl mx-auto text-center w-full">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
            <Search size={28} className="text-cyan-400" />
          </div>

          <p className="font-mono text-cyan-400 text-sm tracking-widest uppercase mb-4">404 — Not Found</p>
          <h1 className="font-serif text-6xl lg:text-7xl text-white mb-5 leading-tight">
            Page not<br /><span className="italic text-cyan-300">found</span>
          </h1>
          <p className="text-slate-400 text-lg mb-4 leading-relaxed max-w-md mx-auto">
            The page at <code className="text-cyan-400 bg-white/5 px-2 py-0.5 rounded text-sm font-mono">{pathname}</code> doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Button asChild variant="site-primary" className="flex items-center gap-2 px-6 py-3 transition-all"><Link
              href="/"
             
            >
              <Home size={16} /> Go Home
            </Link></Button>
            <Button variant="site-glass"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 font-medium transition-all"
            >
              <ArrowLeft size={16} /> Go Back
            </Button>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-slate-500 text-sm mb-4">Or try one of these pages:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map(({ label, to }) => (
                <Link
                  key={to}
                  href={to}
                  className="px-4 py-2 bg-white/5 text-slate-300 text-sm rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
