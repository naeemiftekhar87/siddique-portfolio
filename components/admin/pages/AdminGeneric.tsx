"use client";

import { Construction } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

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
        <Button variant="admin-primary" className="px-5 py-2.5">
          + Add New
        </Button>
        <Button variant="admin-outline" className="px-5 py-2.5">
          Import
        </Button>
      </div>
    </div>
  );
}
