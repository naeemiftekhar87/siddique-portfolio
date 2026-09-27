"use client";

import { useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRINT_FLAG = "print";

/**
 * "Download PDF" for the resumes: counts the download (anonymous daily
 * counter on the admin dashboard), then opens the resume in a new tab that
 * starts the browser's print dialog (Save as PDF, A4 print stylesheet), so
 * the visitor's current page stays open (owner decisions 2026-09-25/27).
 */
export function PrintButton({ variant, className }: { variant: "professional" | "infographic"; className?: string }) {
  // In the tab opened by the button (?print=1): print once fonts and the page have loaded.
  // Read from window.location because the resume pages are statically rendered.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get(PRINT_FLAG) !== "1") return;
    url.searchParams.delete(PRINT_FLAG);
    window.history.replaceState(null, "", url);
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setTimeout(() => window.print(), 300);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const download = () => {
    // Fire-and-forget; keepalive lets the request finish even if the tab changes.
    fetch("/api/downloads/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variant }),
      keepalive: true,
    }).catch(() => undefined);
    const target = new URL(window.location.href);
    target.searchParams.set(PRINT_FLAG, "1");
    window.open(target.toString(), "_blank", "noopener");
  };

  return (
    <Button variant="site-primary" onClick={download} className={className}>
      <Download size={variant === "professional" ? 16 : 15} /> Download PDF
    </Button>
  );
}
