"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, FileText, User, Briefcase, GraduationCap, Award, BarChart2, LayoutTemplate, Languages } from "lucide-react";
import { profile, experiences, education, skills, certificates, languages } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const tabs = ["Professional Resume"];

export default function Resume() {
  const [activeTab, setActiveTab] = useState("Professional Resume");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
              <FileText size={18} className="text-cyan-400" />
            </div>
            <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">Documents</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-5xl lg:text-6xl text-white mb-3 leading-tight">
                Resume<br /><span className="italic text-cyan-300">Center</span>
              </h1>
              <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
                Professional resume and infographic resume — each tailored for different audiences and contexts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Button asChild variant="site-glass" className="flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors"><Link href="/resume/infographic">
                <LayoutTemplate size={16} /> Infographic View
              </Link></Button>
              <Button variant="site-primary" className="flex items-center gap-2 px-6 py-3 text-sm transition-colors">
                <Download size={16} /> Download PDF
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky tab bar */}
      <div className="sticky top-[72px] z-10 bg-white/90 backdrop-blur-md border-b border-blue-100/40 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap gap-2">
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

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Resume document */}
        <Card variant="site-glass-card" className="overflow-hidden shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#040d1f] to-[#071428] px-10 py-10 text-white">
            <h2 className="font-serif text-3xl mb-2">{profile.name}</h2>
            <p className="text-cyan-300 text-sm mb-1">{profile.headline}</p>
            <p className="text-slate-400 text-sm">{profile.location} · {profile.email}</p>
          </div>

          <div className="p-10 space-y-10">
            {/* Summary */}
            <section>
              <h3 className="font-serif text-xl text-slate-900 mb-4 flex items-center gap-2">
                <User size={18} className="text-blue-600" /> Professional Summary
              </h3>
              <p className="text-slate-600 leading-relaxed">{profile.summary}</p>
            </section>

            <div className="h-px bg-slate-100" />

            {/* Experience */}
            <section>
              <h3 className="font-serif text-xl text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase size={18} className="text-blue-600" /> Professional Experience
              </h3>
              <div className="space-y-6">
                {experiences.slice(0, 4).map((exp) => (
                  <div key={exp.id} className="pl-4 border-l-2 border-blue-100">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{exp.position}</h4>
                      <span className="text-slate-400 text-xs font-mono">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <p className="text-blue-600 text-sm mb-2">{exp.company} · {exp.location}</p>
                    <p className="text-slate-600 text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* Education */}
            <section>
              <h3 className="font-serif text-xl text-slate-900 mb-6 flex items-center gap-2">
                <GraduationCap size={18} className="text-blue-600" /> Education
              </h3>
              <div className="space-y-5">
                {education.map((edu) => (
                  <div key={edu.id} className="pl-4 border-l-2 border-teal-100">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
                      <span className="text-slate-400 text-xs font-mono">{edu.startDate} – {edu.endDate}</span>
                    </div>
                    <p className="text-teal-600 text-sm mb-1">{edu.university}</p>
                    <p className="text-slate-500 text-sm">{edu.major} · GPA: {edu.gpa}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* Skills */}
            <section>
              <h3 className="font-serif text-xl text-slate-900 mb-6 flex items-center gap-2">
                <BarChart2 size={18} className="text-blue-600" /> Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 20).map((s) => (
                  <span key={s.id} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-sm rounded-lg border border-slate-100">
                    {s.name}
                  </span>
                ))}
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* Certificates */}
            <section>
              <h3 className="font-serif text-xl text-slate-900 mb-6 flex items-center gap-2">
                <Award size={18} className="text-blue-600" /> Certifications
              </h3>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-slate-800 font-medium text-sm">{cert.title}</span>
                      <span className="text-slate-400 text-sm"> · {cert.issuer}</span>
                    </div>
                    <span className="text-slate-400 text-xs font-mono flex-shrink-0">{cert.completionDate}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* Languages */}
            <section>
              <h3 className="font-serif text-xl text-slate-900 mb-6 flex items-center gap-2">
                <Languages size={18} className="text-blue-600" /> Languages
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex items-center gap-4">
                    <span className="text-2xl flex-shrink-0">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-slate-800 font-medium text-sm">{lang.name}</span>
                        <span className="text-slate-400 text-xs">{lang.level}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                          style={{ width: `${lang.proficiency}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </Card>
      </div>
    </div>
  );
}

