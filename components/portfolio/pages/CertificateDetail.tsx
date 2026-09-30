import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, Award, ExternalLink, Download, Copy, Tag, ArrowRight } from "lucide-react";
import type { Certificate } from "@/lib/data";
import { CopyButton } from "@/components/portfolio/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CertificateDetail({ cert, related }: { cert: Certificate; related: Certificate[] }) {
  return (
    <div className="min-h-screen">
      {/* Dark header */}
      <div className="site-hero bg-(color:--site-top) pt-20 pb-12 px-6">
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
          <p className="text-site-accent font-medium text-lg">{cert.issuer}</p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Certificate image */}
          <div className="lg:col-span-3 space-y-4">
            <Card variant="site-white-card" className="overflow-hidden shadow-md">
              {cert.image ? (
                <img src={cert.image} alt={cert.title} className="w-full object-cover" />
              ) : (
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-amber-400/10 to-white/5" aria-hidden>
                  <Award size={56} className="text-amber-400" />
                </div>
              )}
            </Card>
            {(cert.image || cert.verifyUrl) && (
              <div className="flex gap-3">
                {cert.image && (
                  <Button asChild variant="site-primary" className="flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-colors shadow-sm">
                    <a href={cert.image} target="_blank" rel="noopener noreferrer" download>
                      <Download size={15} /> Download Certificate
                    </a>
                  </Button>
                )}
                {cert.verifyUrl && (
                  <Button asChild variant="site-outline" className="flex items-center gap-2 px-5 py-3 text-slate-200 text-sm font-medium hover:border-site-accent/40 hover:text-site-accent transition-colors">
                    <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={15} /> Verify
                    </a>
                  </Button>
                )}
              </div>
            )}
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
                  <div key={label} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                    <span className="text-slate-400 text-xs flex items-center gap-1.5">{icon}{label}</span>
                    <span className={`text-slate-100 text-sm font-medium ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
                  </div>
                ) : null
              )}
            </Card>

            {/* Description */}
            {cert.description && (
              <div>
                <h4 className="font-serif text-lg text-slate-100 mb-3">About This Certificate</h4>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{cert.description}</p>
              </div>
            )}

            {/* Skills */}
            {cert.skills.length > 0 && (
            <div>
              <h4 className="font-serif text-lg text-slate-100 mb-3 flex items-center gap-2">
                <Tag size={16} className="text-teal-300" /> Skills Covered
              </h4>
              <div className="flex flex-wrap gap-2">
                {cert.skills.map((s) => (
                  <span key={s} className="px-3 py-1.5 bg-site-accent/10 text-site-accent text-xs rounded-xl border border-site-accent/20 hover:bg-site-accent/15 transition-colors cursor-default">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            )}

            {/* Share / copy credential */}
            {cert.credentialId && (
              <Card variant="site-panel" className="flex items-center gap-3 p-4">
                <code className="text-xs text-slate-300 font-mono flex-1 truncate">{cert.credentialId}</code>
                <CopyButton text={cert.credentialId} label="Copy ID"
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-site-accent transition-colors px-3 py-1.5 bg-white/[0.04] rounded-lg border border-white/10 hover:border-site-accent/40 flex-shrink-0" />
              </Card>
            )}
          </div>
        </div>

        {/* Related certificates */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/10">
            <h2 className="font-serif text-2xl text-slate-100 mb-6">More in {cert.category}</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((c) => (
                <Link
                  key={c.id}
                  href={`/certificates/${c.id}`}
                  className="group flex gap-4 glass-card rounded-2xl p-5 transition-all"
                >
                  {c.image ? (
                    <img loading="lazy" decoding="async" src={c.image} alt={c.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-amber-400/10 flex items-center justify-center flex-shrink-0" aria-hidden><Award size={22} className="text-amber-400" /></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base text-slate-100 group-hover:text-site-accent transition-colors leading-snug mb-1 line-clamp-2">{c.title}</h4>
                    <p className="text-slate-400 text-xs mb-1">{c.issuer}</p>
                    <div className="flex items-center gap-2">
                      {c.verified && <CheckCircle size={11} className="text-green-300" />}
                      <span className="text-xs text-slate-400">{c.completionDate}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-site-accent flex-shrink-0 self-center transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
