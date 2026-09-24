"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * "Download PDF" via the browser's print dialog (Save as PDF) using the A4
 * print stylesheet (owner decision 2026-09-25; no server-side PDF export).
 */
export function PrintButton({ className }: { className?: string }) {
  return (
    <Button variant="site-primary" onClick={() => window.print()} className={className}>
      <Download size={15} /> Download PDF
    </Button>
  );
}
