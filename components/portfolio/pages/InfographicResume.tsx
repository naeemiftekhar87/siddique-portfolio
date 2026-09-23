import Link from "next/link";
import { Download, BarChart2, GraduationCap, Briefcase, Award, LayoutTemplate, ArrowLeft } from "lucide-react";
import { profile, experiences, education, skills, certificates, researchPapers } from "@/lib/data";

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

export default function InfographicResume() {
  const topSkills = [...skills].sort((a, b) => b.level - a.level).slice(0, 12);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#040d1f] via-[#071428] to-[#040d1f] py-20 px-6 relative overflow-hidden">
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
              <Link href="/resume"
                className="flex items-center gap-2 px-4 py-3 bg-white/10 text-white text-sm font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                <ArrowLeft size={15} /> Resume Center
              </Link>
              <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition-colors">
                <Download size={15} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* A4-proportioned infographic */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
          {/* Header band */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-10 py-10 relative overflow-hidden">
            {/* Decorative dots */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="absolute rounded-full bg-white"
                  style={{ width: 4, height: 4, top: `${(i * 53 + 17) % 100}%`, left: `${(i / 20) * 100}%` }} />
              ))}
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-24 h-24 rounded-2xl border-2 border-cyan-400/40 overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-serif text-4xl text-white mb-1">{profile.name}</h2>
                <p className="text-cyan-300 text-sm font-medium mb-3">{profile.headline}</p>
                <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                  <span>{profile.location}</span>
                  <span>·</span>
                  <span>{profile.email}</span>
                </div>
              </div>
              <div className="md:ml-auto grid grid-cols-3 gap-4">
                {[
                  [profile.stats.experience, "Years"],
                  [profile.stats.certificates, "Certs"],
                  [profile.stats.publications, "Papers"],
                ].map(([v, l]) => (
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
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <BarChart2 size={16} className="text-blue-600" />
                  <h3 className="font-serif text-lg text-slate-900">Core Skills</h3>
                </div>
                {topSkills.slice(0, 8).map((s) => (
                  <SkillBar key={s.id} name={s.name} level={s.level} />
                ))}
              </section>

              {/* Research areas */}
              <section>
                <h3 className="font-serif text-lg text-slate-900 mb-4">Research Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.researchInterests.slice(0, 8).map((r) => (
                    <span key={r} className="px-2.5 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                      {r}
                    </span>
                  ))}
                </div>
              </section>

              {/* Certificates */}
              <section>
                <h3 className="font-serif text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <Award size={15} className="text-amber-500" /> Certificates
                </h3>
                <div className="space-y-2">
                  {certificates.slice(0, 4).map((c) => (
                    <div key={c.id} className="text-xs">
                      <p className="text-slate-800 font-medium">{c.title}</p>
                      <p className="text-slate-400">{c.issuer} · {c.completionDate.split(",")[1]?.trim() || c.completionDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right columns (2 cols) */}
            <div className="md:col-span-2 p-8 space-y-8">
              {/* Summary */}
              <section>
                <p className="text-slate-600 leading-relaxed text-sm">{profile.summary}</p>
              </section>

              {/* Experience timeline */}
              <section>
                <h3 className="font-serif text-xl text-slate-900 mb-5 flex items-center gap-2">
                  <Briefcase size={16} className="text-blue-600" /> Professional Experience
                </h3>
                <div className="relative pl-6 border-l-2 border-blue-100 space-y-5">
                  {experiences.slice(0, 4).map((exp) => (
                    <div key={exp.id} className="relative">
                      <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow" />
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-0.5">
                        <h4 className="font-semibold text-slate-900 text-sm">{exp.position}</h4>
                        <span className="text-xs text-slate-400 font-mono">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <p className="text-blue-600 text-xs font-medium">{exp.company} · {exp.location}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <h3 className="font-serif text-xl text-slate-900 mb-5 flex items-center gap-2">
                  <GraduationCap size={16} className="text-teal-600" /> Education
                </h3>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex gap-4">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${edu.status === "In Progress" ? "bg-blue-600" : "bg-teal-500"}`} />
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{edu.degree}</h4>
                        <p className="text-slate-600 text-xs">{edu.university}</p>
                        <p className="text-slate-400 text-xs font-mono">{edu.startDate} – {edu.endDate} · GPA: {edu.gpa}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Publications */}
              <section>
                <h3 className="font-serif text-xl text-slate-900 mb-5">Publications</h3>
                <div className="space-y-3">
                  {researchPapers.map((p) => (
                    <div key={p.id} className="border-l-2 border-teal-200 pl-3">
                      <p className="text-slate-800 text-xs font-medium leading-snug">{p.title}</p>
                      <p className="text-slate-400 text-xs">{p.journal} · {p.year}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
