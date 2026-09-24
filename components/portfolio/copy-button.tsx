"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Copies `text` to the clipboard and briefly shows "Copied". */
export function CopyButton({ text, label, className, iconSize = 11 }: { text: string; label: string; className?: string; iconSize?: number }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
      setTimeout(() => setFailed(false), 2000);
    }
  };

  return (
    <Button variant="unstyled" type="button" onClick={copy} className={className} aria-live="polite">
      {copied ? <Check size={iconSize} className="text-green-500" /> : <Copy size={iconSize} />}
      {copied ? "Copied" : failed ? "Copy failed" : label}
    </Button>
  );
}
