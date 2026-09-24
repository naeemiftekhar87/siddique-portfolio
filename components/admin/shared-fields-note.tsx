import Link from "next/link";
import { Info } from "lucide-react";

/** Points to the one screen where a shared field (name, photo, links, ...) is edited. */
export function SharedFieldsNote({ fields, href, screen }: { fields: string; href: string; screen: string }) {
  return (
    <p className="flex items-start gap-2 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-sm">
      <Info size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
      <span>
        {fields} {fields.includes(",") ? "are" : "is"} edited once in{" "}
        <Link href={href} className="text-blue-400 hover:underline">{screen}</Link> and shown here automatically.
      </span>
    </p>
  );
}
