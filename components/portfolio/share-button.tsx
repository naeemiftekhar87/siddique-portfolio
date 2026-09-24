"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shares the current page with the native share sheet, or copies its link. */
export function ShareButton({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Cancelled by the visitor.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable; nothing else to offer.
    }
  };

  return (
    <Button variant="site-glass" type="button" onClick={share} className={className} aria-live="polite">
      <Share2 size={15} /> {copied ? "Link copied" : "Share"}
    </Button>
  );
}
