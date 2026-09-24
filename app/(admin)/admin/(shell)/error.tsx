"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Admin screen failed to load (for example, the database is unreachable).
export default function AdminError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <AlertTriangle size={36} className="text-amber-400 mx-auto mb-4" />
      <h1 className="font-serif text-2xl text-white mb-2">This screen could not be loaded</h1>
      <p className="text-slate-400 text-sm mb-6">Check your connection and try again. Nothing was changed.</p>
      <Button variant="admin-primary" onClick={() => retry()} className="inline-flex items-center gap-2 px-5 py-2.5">
        <RotateCcw size={15} /> Try again
      </Button>
    </div>
  );
}
