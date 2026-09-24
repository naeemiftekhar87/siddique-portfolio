"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, FileText, User, Briefcase, GraduationCap, Award, BarChart2, LayoutTemplate, Languages, BookOpen } from "lucide-react";
import type { Certificate, Education, Experience, Language, Paper, ResumeConfig, SiteProfile, Skill } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dateRange } from "@/lib/data/format";

const tabs = ["Professional Resume"];

export type ResumeData = {
  profile: SiteProfile;
  config: ResumeConfig;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  certificates: Certificate[];
  languages: Language[];
  papers: Paper[];
};

export default function Resume({ profile, config, experiences, education, skills, certificates, languages, papers }: ResumeData) {
  const [activeTab, setActiveTab] = useState("Professional Resume");
  const accent = { color: config.accentColor };
  const heading = config.fontStyle === "serif" ? "font-serif" : "font-sans font-semibold";

  // Sections in order; each is shown when enabled in the admin and not empty.
  const sections = [
    config.showSummary && profile.summary && "summary",
    config.showExperience && experiences.length > 0 && "experience",
    config.showEducation && education.length > 0 && "education",
    config.showSkills && skills.length > 0 && "skills",
    config.showCertificates && certificates.length > 0 && "certificates",
    config.showResearch && papers.length > 0 && "research",
    config.showLanguages && languages.length > 0 && "languages",
  ].filter(Boolean) as string[];
  const divider = (key: string) => sections.indexOf(key) > 0 && <div className="h-px bg-slate-100" />;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden print:hidden">
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
              {/* Browser print ("Save as PDF") with the A4 print stylesheet (owner decision). */}
              <Button variant="site-primary" onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 text-sm transition-colors">
                <Download size={16} /> Download PDF
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky tab bar */}
      <div className="sticky top-[72px] z-10 bg-white/90 backdrop-blur-md border-b border-blue-100/40 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button variant="unstyled"
              key={tab}
              onClick={() => setActiveTab(tab)}
              aria-pressed={activeTab === tab}
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

      <div className="max-w-5xl mx-auto px-6 py-12 print:p-0 print:max-w-none">
        {/* Resume document */}
        <Card variant="site-glass-card" className="overflow-hidden shadow-lg print:shadow-none print:border-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#040d1f] to-[#071428] px-10 py-10 text-white print-color">
            <h2 className={`${heading} text-3xl mb-2`}>{profile.name}</h2>
            {profile.headline && <p className="text-cyan-300 text-sm mb-1">{profile.headline}</p>}
            <p className="text-slate-400 text-sm">{[profile.location, profile.email].filter(Boolean).join(" · ")}</p>
          </div>

          <div className="p-10 space-y-10">
            {sections.length === 0 && (
              <p className="text-slate-400 text-center py-8">The resume will appear here once content is added.</p>
            )}

            {/* Summary */}
            {sections.includes("summary") && (
            <section className="break-inside-avoid">
              <h3 className={`${heading} text-xl text-slate-900 mb-4 flex items-center gap-2`}>
                <User size={18} style={accent} /> Professional Summary
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{profile.summary}</p>
            </section>
            )}

            {/* Experience */}
            {sections.includes("experience") && (<>
            {divider("experience")}
            <section>
              <h3 className={`${heading} text-xl text-slate-900 mb-6 flex items-center gap-2`}>
                <Briefcase size={18} style={accent} /> Professional Experience
              </h3>
              <div className="space-y-6">
                {experiences.slice(0, config.experienceLimit).map((exp) => (
                  <div key={exp.id} className="pl-4 border-l-2 border-blue-100 break-inside-avoid">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{exp.position}</h4>
                      <span className="text-slate-400 text-xs font-mono">{dateRange(exp.startDate, exp.endDate)}</span>
                    </div>
                    <p className="text-sm mb-2" style={accent}>{[exp.company, exp.location].filter(Boolean).join(" · ")}</p>
                    <p className="text-slate-600 text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
            </>)}

            {/* Education */}
            {sections.includes("education") && (<>
            {divider("education")}
            <section>
              <h3 className={`${heading} text-xl text-slate-900 mb-6 flex items-center gap-2`}>
                <GraduationCap size={18} style={accent} /> Education
              </h3>
              <div className="space-y-5">
                {education.map((edu) => (
                  <div key={edu.id} className="pl-4 border-l-2 border-teal-100 break-inside-avoid">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
                      <span className="text-slate-400 text-xs font-mono">{dateRange(edu.startDate, edu.endDate)}</span>
                    </div>
                    <p className="text-teal-600 text-sm mb-1">{edu.university}</p>
                    <p className="text-slate-500 text-sm">{[edu.major, edu.gpa && `GPA: ${edu.gpa}`].filter(Boolean).join(" · ")}</p>
                  </div>
                ))}
              </div>
            </section>
            </>)}

            {/* Skills */}
            {sections.includes("skills") && (<>
            {divider("skills")}
            <section className="break-inside-avoid">
              <h3 className={`${heading} text-xl text-slate-900 mb-6 flex items-center gap-2`}>
                <BarChart2 size={18} style={accent} /> Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, config.skillsLimit).map((s) => (
                  <span key={s.id} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-sm rounded-lg border border-slate-100">
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
            </>)}

            {/* Certificates */}
            {sections.includes("certificates") && (<>
            {divider("certificates")}
            <section>
              <h3 className={`${heading} text-xl text-slate-900 mb-6 flex items-center gap-2`}>
                <Award size={18} style={accent} /> Certifications
              </h3>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-start justify-between gap-4 break-inside-avoid">
                    <div>
                      <span className="text-slate-800 font-medium text-sm">{cert.title}</span>
                      <span className="text-slate-400 text-sm"> · {cert.issuer}</span>
                    </div>
                    <span className="text-slate-400 text-xs font-mono flex-shrink-0">{cert.completionDate}</span>
                  </div>
                ))}
              </div>
            </section>
            </>)}

            {/* Research */}
            {sections.includes("research") && (<>
            {divider("research")}
            <section>
              <h3 className={`${heading} text-xl text-slate-900 mb-6 flex items-center gap-2`}>
                <BookOpen size={18} style={accent} /> Research &amp; Publications
              </h3>
              <div className="space-y-3">
                {papers.map((p) => (
                  <div key={p.id} className="break-inside-avoid">
                    <p className="text-slate-800 font-medium text-sm">{p.title}</p>
                    <p className="text-slate-400 text-xs">{[p.journal, p.year, p.status].filter(Boolean).join(" · ")}</p>
                  </div>
                ))}
              </div>
            </section>
            </>)}

            {/* Languages */}
            {sections.includes("languages") && (<>
            {divider("languages")}
            <section className="break-inside-avoid">
              <h3 className={`${heading} text-xl text-slate-900 mb-6 flex items-center gap-2`}>
                <Languages size={18} style={accent} /> Languages
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
            </>)}

            {config.customNote && (
              <p className="text-slate-500 text-sm italic border-t border-slate-100 pt-6 whitespace-pre-line">{config.customNote}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

