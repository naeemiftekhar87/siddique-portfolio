"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Two-step delete: the trash button turns into Confirm / Cancel, so nothing
 * is removed by a single click. `variant` picks the trash button style used
 * by the surrounding screen.
 */
export function ConfirmDelete({
  onConfirm,
  label = "item",
  pending = false,
  variant = "admin-icon-danger",
  size = 14,
}: {
  onConfirm: () => void;
  label?: string;
  pending?: boolean;
  variant?: "admin-icon-danger" | "admin-ghost-danger";
  size?: number;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
        <Button variant="admin-danger-sm" disabled={pending} autoFocus
          onClick={() => { onConfirm(); setConfirming(false); }}
          className="transition-colors disabled:opacity-50">
          Confirm
        </Button>
        <Button variant="unstyled" onClick={() => setConfirming(false)}
          className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
          Cancel
        </Button>
      </div>
    );
  }
  return (
    <Button variant={variant} aria-label={`Delete ${label}`} title={`Delete ${label}`}
      onClick={(e) => { e.stopPropagation(); setConfirming(true); }}>
      <Trash2 size={size} />
    </Button>
  );
}
