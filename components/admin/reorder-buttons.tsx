"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Up/down buttons for ordering a list (keyboard-accessible alternative to drag-and-drop). */
export function ReorderButtons({
  index,
  count,
  label,
  disabled = false,
  onMove,
}: {
  index: number;
  count: number;
  label: string;
  disabled?: boolean;
  onMove: (delta: -1 | 1) => void;
}) {
  const cls = "text-slate-600 hover:text-slate-300 disabled:opacity-30 disabled:pointer-events-none";
  return (
    <div className="flex flex-col flex-shrink-0" onClick={(e) => e.stopPropagation()}>
      <Button variant="unstyled" type="button" onClick={() => onMove(-1)} disabled={disabled || index === 0}
        aria-label={`Move ${label} up`} className={cls}>
        <ChevronUp size={14} />
      </Button>
      <Button variant="unstyled" type="button" onClick={() => onMove(1)} disabled={disabled || index === count - 1}
        aria-label={`Move ${label} down`} className={cls}>
        <ChevronDown size={14} />
      </Button>
    </div>
  );
}

/** Returns a copy of `list` with the item at `index` moved by `delta`. */
export function moveItem<T>(list: T[], index: number, delta: -1 | 1): T[] {
  const next = [...list];
  const [item] = next.splice(index, 1);
  next.splice(index + delta, 0, item);
  return next;
}
