import { Loader2 } from "lucide-react";

// Shown inside the admin shell while a screen loads its data.
export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-32 text-slate-500" role="status">
      <Loader2 size={24} className="animate-spin" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
