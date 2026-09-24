import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, Award, ExternalLink, Download, Copy, Tag, ArrowRight } from "lucide-react";
import { certificates } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CertificateDetail({ id }: { id: string }) {
  const cert = certificates.find((c) => c.id === Number(id));
  const related = certificates.filter((c) => c.id !== Number(id) && c.category === cert?.category).slice(0, 2);

  if (!cert) return (
    <div className="min-h-screen pt-32 text-center text-slate-400">Certificate not found.</div>
  );

  return (
    <div className="min-h-screen">
      {/* Dark header */}
      <div className="bg-(color:--site-top) pt-20 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/certificates" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors w-fit">
            <ArrowLeft size={14} /> Certificates
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {cert.verified && (
              <Badge variant="unstyled" className="flex items-center gap-1.5 bg-green-900/40 text-green-400 text-xs px-3 py-1 rounded-full border border-green-800/50">
                <CheckCircle size={11} /> Verified
              </Badge>
            )}
            <Badge variant="unstyled" className="text-slate-400 text-xs px-3 py-1 bg-white/10 rounded-full">{cert.category}</Badge>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-3 leading-snug">{cert.title}</h1>
          <p className="text-cyan-300 font-medium text-lg">{cert.issuer}</p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Certificate image */}
          <div className="lg:col-span-3 space-y-4">
            <Card variant="site-white-card" className="overflow-hidden shadow-md">
              <img src={cert.image} alt={cert.title} className="w-full object-cover" />
            </Card>
            <div className="flex gap-3">
              <Button variant="site-primary" className="flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-colors shadow-sm">
                <Download size={15} /> Download Certificate
              </Button>
              <Button variant="site-outline" className="flex items-center gap-2 px-5 py-3 text-slate-700 text-sm font-medium hover:border-cyan-300 hover:text-blue-600 transition-colors">
                <ExternalLink size={15} /> Verify
              </Button>
            </div>
          </div>

          {/* Details sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick stats */}
            <Card variant="site-panel" className="p-5 space-y-3">
              <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-4">Certificate Details</h4>
              {[
                { label: "Completion Date", value: cert.completionDate, icon: <Clock size={13} /> },
                { label: "Grade", value: cert.grade, icon: <Award size={13} /> },
                { label: "Duration", value: cert.duration, icon: <Clock size={13} /> },
                { label: "Credential ID", value: cert.credentialId, icon: <Copy size={13} />, mono: true },
              ].map(({ label, value, icon, mono }) =>
                value ? (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-400 text-xs flex items-center gap-1.5">{icon}{label}</span>
                    <span className={`text-slate-800 text-sm font-medium ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
                  </div>
                ) : null
              )}
            </Card>

            {/* Description */}
            <div>
              <h4 className="font-serif text-lg text-[#040d1f] mb-3">About This Certificate</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{cert.description}</p>
            </div>

            {/* Skills */}
            <div>
              <h4 className="font-serif text-lg text-[#040d1f] mb-3 flex items-center gap-2">
                <Tag size={16} className="text-teal-600" /> Skills Covered
              </h4>
              <div className="flex flex-wrap gap-2">
                {cert.skills.map((s) => (
                  <span key={s} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors cursor-default">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Share / copy credential */}
            {cert.credentialId && (
              <Card variant="site-panel" className="flex items-center gap-3 p-4">
                <code className="text-xs text-slate-600 font-mono flex-1 truncate">{cert.credentialId}</code>
                <Button variant="unstyled" className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors px-3 py-1.5 bg-white rounded-lg border border-slate-200 hover:border-cyan-300 flex-shrink-0">
                  <Copy size={11} /> Copy ID
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* Related certificates */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-100">
            <h2 className="font-serif text-2xl text-[#040d1f] mb-6">More in {cert.category}</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((c) => (
                <Link
                  key={c.id}
                  href={`/certificates/${c.id}`}
                  className="group flex gap-4 bg-slate-50 rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <img src={c.image} alt={c.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base text-[#040d1f] group-hover:text-blue-600 transition-colors leading-snug mb-1 line-clamp-2">{c.title}</h4>
                    <p className="text-slate-400 text-xs mb-1">{c.issuer}</p>
                    <div className="flex items-center gap-2">
                      {c.verified && <CheckCircle size={11} className="text-green-500" />}
                      <span className="text-xs text-slate-400">{c.completionDate}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 flex-shrink-0 self-center transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
