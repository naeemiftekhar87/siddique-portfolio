"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * "Download PDF" for the resumes: counts the download (anonymous daily
 * counter on the admin dashboard), then opens the browser's Save as PDF
 * dialog for this page (A4 print stylesheet; owner decision 2026-09-25).
 *
 * The dialog is opened straight from the click. Browsers only reliably allow
 * print() during a user gesture: an earlier version opened a new tab that
 * printed itself on load, which Safari/iOS block and which React's dev-mode
 * double effects cancelled, so visitors only got a second copy of the page.
 */
export function PrintButton({ variant, className }: { variant: "professional" | "infographic"; className?: string }) {
  const download = () => {
    // Fire-and-forget; keepalive lets the request finish while the dialog is open.
    fetch("/api/downloads/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variant }),
      keepalive: true,
    }).catch(() => undefined);
    window.print();
  };

  return (
    <Button variant="site-primary" onClick={download} className={className}
      title="Opens the print dialog: choose “Save as PDF” as the printer">
      <Download size={variant === "professional" ? 16 : 15} /> Download PDF
    </Button>
  );
}
