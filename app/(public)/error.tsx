"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Shown when a public page cannot load its content (for example, the
// database is unreachable). Details are logged on the server, not shown here.
export default function PublicError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={20} className="text-amber-400" />
          </div>
          <h1 className="font-serif text-4xl text-white mb-4">Something went wrong</h1>
          <p className="text-slate-300 mb-8">This page could not be loaded right now. Please try again in a moment.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="site-primary" onClick={() => retry()} className="flex items-center gap-2 px-6 py-3 text-sm">
              <RotateCcw size={15} /> Try again
            </Button>
            <Button asChild variant="site-glass" className="flex items-center gap-2 px-6 py-3 text-sm font-medium">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
