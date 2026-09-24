"use client";

import "./globals.css";
import { Button } from "@/components/ui/button";

// Last-resort boundary for errors in the root or public layout (for example,
// the site settings could not be loaded). It replaces the whole document.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#040d1f] px-6">
        <main className="max-w-md text-center">
          <h1 className="text-3xl text-white mb-3" style={{ fontFamily: "Georgia, serif" }}>Something went wrong</h1>
          <p className="text-slate-300 mb-8">The site could not be loaded right now. Please try again in a moment.</p>
          <Button variant="site-primary" onClick={() => retry()} className="px-6 py-3 text-sm">
            Try again
          </Button>
        </main>
      </body>
    </html>
  );
}
