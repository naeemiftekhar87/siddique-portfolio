"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, Award } from "lucide-react";
import { certificates } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const tabs = ["All", "Academic Certificates", "Professional Certificates", "Training", "Awards"];

export default function Certificates() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? certificates
      : certificates.filter((c) => c.category === activeTab);

  const verified = certificates.filter((c) => c.verified).length;
  const categories = new Set(certificates.map((c) => c.category)).size;
  const issuers = new Set(certificates.map((c) => c.issuer)).size;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#040d1f] via-[#071428] to-[#040d1f] py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Award size={18} className="text-amber-400" />
            </div>
            <span className="text-amber-400 text-sm font-medium tracking-wide uppercase">Credentials</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Certificates &<br /><span className="italic text-amber-300">Credentials</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            A curated collection of academic and professional certifications reflecting continuous learning across your fields of study and practice.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {[
              { value: certificates.length, label: "Total Certificates" },
              { value: verified, label: "Verified" },
              { value: categories, label: "Categories" },
              { value: issuers, label: "Issuing Bodies" },
            ].map(({ value, label }) => (
              <Card variant="site-glass-dark" key={label} className="p-4">
                <div className="font-serif text-3xl text-white">{value}</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-[72px] z-10 bg-white/90 backdrop-blur-md border-b border-blue-100/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button variant="unstyled"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-[#040d1f] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert) => (
            <Link
              key={cert.id}
              href={`/certificates/${cert.id}`}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all group"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {cert.verified && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-green-100">
                    <CheckCircle size={12} className="text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Verified</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3">
                  <Badge variant="unstyled" className="bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-600 px-2.5 py-1 rounded-full border border-slate-100">
                    {cert.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-blue-600 text-sm mb-3">{cert.issuer}</p>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {cert.completionDate}
                  </span>
                  {cert.grade && (
                    <span className="flex items-center gap-1">
                      <Award size={11} /> {cert.grade}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.slice(0, 4).map((s) => (
                    <Badge variant="unstyled" key={s} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-md border border-slate-100">
                      {s}
                    </Badge>
                  ))}
                  {cert.skills.length > 4 && (
                    <Badge variant="unstyled" className="px-2 py-1 bg-slate-50 text-slate-400 text-xs rounded-md border border-slate-100">
                      +{cert.skills.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

