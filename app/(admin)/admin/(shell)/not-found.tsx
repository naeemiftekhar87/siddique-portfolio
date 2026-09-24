import Link from "next/link";
import { SearchX } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <SearchX size={36} className="text-slate-600 mx-auto mb-4" />
      <h1 className="font-serif text-2xl text-white mb-2">Page not found</h1>
      <p className="text-slate-400 text-sm mb-6">This admin page does not exist.</p>
      <Link href="/admin" className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
        Back to Dashboard
      </Link>
    </div>
  );
}
