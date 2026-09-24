import Link from "next/link";
import { BarChart2, GraduationCap, Briefcase, Award, LayoutTemplate, ArrowLeft, User, Languages } from "lucide-react";
import type { ResumeData } from "@/components/portfolio/pages/Resume";
import { PrintButton } from "@/components/portfolio/print-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dateRange } from "@/lib/data/format";

function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-700 font-medium">{name}</span>
        <span className="text-slate-400 font-mono">{level}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-teal-500"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

export default function InfographicResume({ profile, config, experiences, education, skills, certificates, languages, papers: researchPapers }: ResumeData) {
  const topSkills = [...skills].sort((a, b) => b.level - a.level).slice(0, config.skillsLimit);
  const accent = { color: config.accentColor };
  const heading = config.fontStyle === "serif" ? "font-serif" : "font-sans font-semibold";
  const headerStats = [
    [profile.stats.experience, "Years"],
    [profile.stats.certificates, "Certs"],
    [profile.stats.publications, "Papers"],
  ].filter(([v]) => v);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden print:hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
              <LayoutTemplate size={18} className="text-cyan-400" />
            </div>
            <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">Visual Resume</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-5xl lg:text-6xl text-white mb-3 leading-tight">
                Infographic<br /><span className="italic text-cyan-300">Resume</span>
              </h1>
              <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
                A visual one-page summary of professional experience, skills, education, and research output.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Button asChild variant="site-glass" className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors"><Link href="/resume"
               >
                <ArrowLeft size={15} /> Resume Center
              </Link></Button>
              <PrintButton className="flex items-center gap-2 px-5 py-3 text-sm transition-colors" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 print:p-0 print:max-w-none">

        {/* A4-proportioned infographic */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 print:shadow-none print:border-0 print:rounded-none">
          {/* Header band */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-10 py-10 relative overflow-hidden print-color">
            {/* Decorative dots */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="absolute rounded-full bg-white"
                  style={{ width: 4, height: 4, top: `${(i * 53 + 17) % 100}%`, left: `${(i / 20) * 100}%` }} />
              ))}
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-24 h-24 rounded-2xl border-2 border-cyan-400/40 overflow-hidden flex-shrink-0">
                {profile.photo ? (
                  <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center" aria-hidden><User size={32} className="text-slate-500" /></div>
                )}
              </div>
              <div>
                <h2 className={`${heading} text-4xl text-white mb-1`}>{profile.name}</h2>
                {profile.headline && <p className="text-cyan-300 text-sm font-medium mb-3">{profile.headline}</p>}
                <p className="text-xs text-slate-400">{[profile.location, profile.email].filter(Boolean).join(" · ")}</p>
              </div>
              <div className="md:ml-auto grid grid-cols-3 gap-4">
                {headerStats.map(([v, l]) => (
                  <div key={l} className="text-center">
                    <div className="font-serif text-2xl text-cyan-400">{v}</div>
                    <div className="text-slate-500 text-xs">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0">
            {/* Left column */}
            <div className="bg-slate-50 p-8 space-y-8 border-r border-slate-100">
              {/* Skills */}
              {config.showSkills && topSkills.length > 0 && (
              <section className="break-inside-avoid">
                <div className="flex items-center gap-2 mb-5">
                  <BarChart2 size={16} style={accent} />
                  <h3 className={`${heading} text-lg text-slate-900`}>Core Skills</h3>
                </div>
                {topSkills.map((s) => (
                  <SkillBar key={s.id} name={s.name} level={s.level} />
                ))}
              </section>
              )}

              {/* Research areas */}
              {config.showResearch && profile.researchInterests.length > 0 && (
              <section className="break-inside-avoid">
                <h3 className={`${heading} text-lg text-slate-900 mb-4`}>Research Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.researchInterests.slice(0, 8).map((r) => (
                    <Badge variant="unstyled" key={r} className="px-2.5 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                      {r}
                    </Badge>
                  ))}
                </div>
              </section>
              )}

              {/* Certificates */}
              {config.showCertificates && certificates.length > 0 && (
              <section className="break-inside-avoid">
                <h3 className={`${heading} text-lg text-slate-900 mb-4 flex items-center gap-2`}>
                  <Award size={15} className="text-amber-500" /> Certificates
                </h3>
                <div className="space-y-2">
                  {certificates.slice(0, 4).map((c) => (
                    <div key={c.id} className="text-xs">
                      <p className="text-slate-800 font-medium">{c.title}</p>
                      <p className="text-slate-400">{[c.issuer, c.completionDate.split(",")[1]?.trim() || c.completionDate].filter(Boolean).join(" · ")}</p>
                    </div>
                  ))}
                </div>
              </section>
              )}

              {/* Languages */}
              {config.showLanguages && languages.length > 0 && (
              <section className="break-inside-avoid">
                <h3 className={`${heading} text-lg text-slate-900 mb-4 flex items-center gap-2`}>
                  <Languages size={15} style={accent} /> Languages
                </h3>
                {languages.map((l) => (
                  <SkillBar key={l.id} name={`${l.flag} ${l.name}`.trim()} level={l.proficiency} />
                ))}
              </section>
              )}
            </div>

            {/* Right columns (2 cols) */}
            <div className="md:col-span-2 p-8 space-y-8">
              {/* Summary */}
              {config.showSummary && profile.summary && (
              <section>
                <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">{profile.summary}</p>
              </section>
              )}

              {/* Experience timeline */}
              {config.showExperience && experiences.length > 0 && (
              <section>
                <h3 className={`${heading} text-xl text-slate-900 mb-5 flex items-center gap-2`}>
                  <Briefcase size={16} style={accent} /> Professional Experience
                </h3>
                <div className="relative pl-6 border-l-2 border-blue-100 space-y-5">
                  {experiences.slice(0, config.experienceLimit).map((exp) => (
                    <div key={exp.id} className="relative break-inside-avoid">
                      <div className="absolute -left-[25px] w-3 h-3 rounded-full border-2 border-white shadow" style={{ backgroundColor: config.accentColor }} />
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-0.5">
                        <h4 className="font-semibold text-slate-900 text-sm">{exp.position}</h4>
                        <span className="text-xs text-slate-400 font-mono">{dateRange(exp.startDate, exp.endDate)}</span>
                      </div>
                      <p className="text-xs font-medium" style={accent}>{[exp.company, exp.location].filter(Boolean).join(" · ")}</p>
                    </div>
                  ))}
                </div>
              </section>
              )}

              {/* Education */}
              {config.showEducation && education.length > 0 && (
              <section className="break-inside-avoid">
                <h3 className={`${heading} text-xl text-slate-900 mb-5 flex items-center gap-2`}>
                  <GraduationCap size={16} className="text-teal-600" /> Education
                </h3>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex gap-4">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${edu.status === "In Progress" ? "bg-blue-600" : "bg-teal-500"}`} />
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{edu.degree}</h4>
                        <p className="text-slate-600 text-xs">{edu.university}</p>
                        <p className="text-slate-400 text-xs font-mono">{[dateRange(edu.startDate, edu.endDate), edu.gpa && `GPA: ${edu.gpa}`].filter(Boolean).join(" · ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              )}

              {/* Publications */}
              {config.showResearch && researchPapers.length > 0 && (
              <section>
                <h3 className={`${heading} text-xl text-slate-900 mb-5`}>Publications</h3>
                <div className="space-y-3">
                  {researchPapers.map((p) => (
                    <div key={p.id} className="border-l-2 border-teal-200 pl-3 break-inside-avoid">
                      <p className="text-slate-800 text-xs font-medium leading-snug">{p.title}</p>
                      <p className="text-slate-400 text-xs">{[p.journal, p.year].filter(Boolean).join(" · ")}</p>
                    </div>
                  ))}
                </div>
              </section>
              )}

              {config.customNote && (
                <p className="text-slate-500 text-xs italic border-t border-slate-100 pt-4 whitespace-pre-line">{config.customNote}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
