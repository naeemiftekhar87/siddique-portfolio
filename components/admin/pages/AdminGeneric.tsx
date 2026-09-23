"use client";

import { Construction } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminGeneric() {
  const pathname = usePathname();
  const page = pathname.split("/").filter(Boolean).slice(1).join(" / ");

  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-6">
        <Construction size={28} className="text-slate-400" />
      </div>
      <h2 className="font-serif text-2xl text-white mb-3 capitalize">{page || "Content Manager"}</h2>
      <p className="text-slate-400 text-sm mb-8">
        This CMS module is ready for content management. Connect it to your data layer to manage content, add entries, upload media, and publish changes to the live website.
      </p>
      <div className="flex justify-center gap-3">
        <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
          + Add New
        </button>
        <button className="px-5 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
          Import
        </button>
      </div>
    </div>
  );
}
