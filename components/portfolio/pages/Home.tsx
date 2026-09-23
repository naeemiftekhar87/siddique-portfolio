"use client";

import Link from "next/link";
import { ArrowRight, Download, Link2, GitFork, GraduationCap, Mail, SquareArrowOutUpRight, Briefcase, BarChart2, Trophy } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { profile, experiences, education, skills, achievements, researchPapers, certificates, projects } from "@/lib/data";

const sparkData = [
  { v: 10 }, { v: 22 }, { v: 18 }, { v: 35 }, { v: 28 }, { v: 42 },
  { v: 38 }, { v: 55 }, { v: 60 }, { v: 52 }, { v: 70 }, { v: 80 },
];

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center px-6 py-5">
      <div className="font-serif text-3xl font-medium text-blue-600 mb-1">{value}</div>
      <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-teal-100/20 blur-3xl" />
          <svg className="absolute right-0 top-0 opacity-5 w-1/2" viewBox="0 0 600 400" fill="none">
            {[...Array(8)].map((_, i) => (
              <circle key={i} cx={300 + (i % 4) * 60} cy={80 + Math.floor(i / 4) * 100} r="4" fill="#2563eb" />
            ))}
            {[...Array(5)].map((_, i) => (
              <line key={i} x1={300 + i * 60} y1={80} x2={320 + i * 60} y2={180} stroke="#2563eb" strokeWidth="1" />
            ))}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <span className="inline-block font-mono text-xs text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-6 tracking-widest">
                {profile.badge}
              </span>
              <h1 className="font-serif text-5xl md:text-6xl text-slate-900 mb-5 leading-tight">
                {profile.name}
              </h1>
              <p className="text-lg text-slate-600 mb-5 font-medium leading-relaxed">
                {profile.headline}
              </p>
              <p className="text-slate-500 mb-8 leading-relaxed max-w-lg">
                {profile.summary.slice(0, 200)}...
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  href="/portfolio"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                >
                  Explore My Work <ArrowRight size={16} />
                </Link>
                <Link
                  href="/resume"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  <Download size={16} /> View Resume
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  <Link2 size={16} /> LinkedIn
                </a>
                <a href={profile.scholar} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors">
                  <GraduationCap size={16} /> Scholar
                </a>
                <a href={profile.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                  <GitFork size={16} /> GitHub
                </a>
                <a href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                  <Mail size={16} /> Email
                </a>
              </div>
            </div>

            {/* Right — Profile image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-72 h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format"
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative ring */}
                <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl border-2 border-blue-200 z-0" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-2xl bg-teal-50 border border-teal-100 z-0" />

                {/* Floating analytics card */}
                <div className="absolute bottom-4 -left-10 bg-white rounded-2xl shadow-lg px-4 py-3 z-20 border border-slate-100 w-40">
                  <div className="font-mono text-xs text-teal-600 font-medium mb-2">Analytics Growth</div>
                  <ResponsiveContainer width="100%" height={36}>
                    <AreaChart data={sparkData}>
                      <defs>
                        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke="#0d9488" fill="url(#spark)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute -top-6 right-4 bg-white rounded-2xl shadow-lg px-4 py-3 z-20 border border-slate-100">
                  <div className="font-mono text-xs text-blue-600 font-medium">Your Field</div>
                  <div className="text-xs text-slate-500 mt-0.5">{profile.stats.experience} Yrs Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-slate-100">
            <StatCard value={profile.stats.experience} label="Years Experience" />
            <StatCard value={profile.stats.degrees} label="Academic Degrees" />
            <StatCard value={profile.stats.certificates} label="Certificates" />
            <StatCard value={profile.stats.research} label="Research Projects" />
            <StatCard value={profile.stats.publications} label="Publications" />
            <StatCard value={profile.stats.skills} label="Technical Skills" />
          </div>
        </div>
      </section>

      {/* Profile overview cards — Experience, Education, Skills, Achievements */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-mono text-xs text-blue-600 tracking-widest uppercase mb-2">Profile</p>
            <h2 className="font-serif text-3xl text-slate-900">Professional Background</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Experience */}
          <Link
            href="/experience"
            className="glass-card rounded-2xl p-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group flex flex-col"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              <Briefcase size={20} className="text-blue-600" />
            </div>
            <h3 className="font-serif text-xl text-slate-900 mb-1">Experience</h3>
            <p className="text-blue-600 font-mono text-2xl font-semibold mb-2">{profile.stats.experience}<span className="text-sm font-normal text-slate-400 ml-1">yrs</span></p>
            <p className="text-slate-500 text-sm leading-relaxed flex-1">
              {experiences.length} roles across your professional career so far.
            </p>
            <span className="mt-4 flex items-center gap-1 text-sm text-blue-600 font-medium group-hover:gap-2 transition-all">
              View Experience <ArrowRight size={14} />
            </span>
          </Link>

          {/* Education */}
          <Link
            href="/education"
            className="glass-card rounded-2xl p-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group flex flex-col"
          >
            <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
              <GraduationCap size={20} className="text-teal-600" />
            </div>
            <h3 className="font-serif text-xl text-slate-900 mb-1">Education</h3>
            <p className="text-teal-600 font-mono text-2xl font-semibold mb-2">{education.length}<span className="text-sm font-normal text-slate-400 ml-1">degrees</span></p>
            <p className="text-slate-500 text-sm leading-relaxed flex-1">
              {education.filter(e => e.status === "In Progress").length} in progress · {education.filter(e => e.status !== "In Progress").length} completed · across your academic programs.
            </p>
            <span className="mt-4 flex items-center gap-1 text-sm text-teal-600 font-medium group-hover:gap-2 transition-all">
              View Education <ArrowRight size={14} />
            </span>
          </Link>

          {/* Skills */}
          <Link
            href="/skills"
            className="glass-card rounded-2xl p-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group flex flex-col"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              <BarChart2 size={20} className="text-blue-600" />
            </div>
            <h3 className="font-serif text-xl text-slate-900 mb-1">Skills</h3>
            <p className="text-blue-600 font-mono text-2xl font-semibold mb-2">{profile.stats.skills}<span className="text-sm font-normal text-slate-400 ml-1">skills</span></p>
            <p className="text-slate-500 text-sm leading-relaxed flex-1">
              Technical, professional, and interpersonal skills across {new Set(skills.map(s => s.category)).size} domains.
            </p>
            <span className="mt-4 flex items-center gap-1 text-sm text-blue-600 font-medium group-hover:gap-2 transition-all">
              View Skills <ArrowRight size={14} />
            </span>
          </Link>

          {/* Achievements */}
          <Link
            href="/achievements"
            className="glass-card rounded-2xl p-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group flex flex-col"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <Trophy size={20} className="text-amber-600" />
            </div>
            <h3 className="font-serif text-xl text-slate-900 mb-1">Achievements</h3>
            <p className="text-amber-600 font-mono text-2xl font-semibold mb-2">{achievements.length}<span className="text-sm font-normal text-slate-400 ml-1">awards</span></p>
            <p className="text-slate-500 text-sm leading-relaxed flex-1">
              Academic honors, professional recognitions, and competition placements across {new Set(achievements.map(a => a.category)).size} categories.
            </p>
            <span className="mt-4 flex items-center gap-1 text-sm text-amber-600 font-medium group-hover:gap-2 transition-all">
              View Achievements <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </section>

      {/* Featured sections */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Research */}
          <div className="glass-card rounded-2xl p-7 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
              <GraduationCap size={20} className="text-blue-600" />
            </div>
            <h3 className="font-serif text-xl text-slate-900 mb-3">Research</h3>
            <p className="text-slate-500 text-sm mb-5 leading-relaxed">
              {researchPapers.length} research papers across your research areas.
            </p>
            <Link href="/research" className="flex items-center gap-1 text-sm text-blue-600 font-medium group-hover:gap-2 transition-all">
              Explore Research <ArrowRight size={15} />
            </Link>
          </div>

          {/* Portfolio */}
          <div className="glass-card rounded-2xl p-7 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-5">
              <SquareArrowOutUpRight size={20} className="text-teal-600" />
            </div>
            <h3 className="font-serif text-xl text-slate-900 mb-3">Portfolio</h3>
            <p className="text-slate-500 text-sm mb-5 leading-relaxed">
              {projects.length} projects from concept to delivery.
            </p>
            <Link href="/portfolio" className="flex items-center gap-1 text-sm text-teal-600 font-medium group-hover:gap-2 transition-all">
              View Projects <ArrowRight size={15} />
            </Link>
          </div>

          {/* Certificates */}
          <div className="glass-card rounded-2xl p-7 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
              <Download size={20} className="text-blue-600" />
            </div>
            <h3 className="font-serif text-xl text-slate-900 mb-3">Certificates</h3>
            <p className="text-slate-500 text-sm mb-5 leading-relaxed">
              {certificates.length}+ professional and academic certificates.
            </p>
            <Link href="/certificates" className="flex items-center gap-1 text-sm text-blue-600 font-medium group-hover:gap-2 transition-all">
              View Certificates <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent experience teaser */}
      <section className="py-16 bg-blue-50/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-mono text-xs text-blue-600 tracking-widest uppercase mb-2">Career</p>
              <h2 className="font-serif text-3xl text-slate-900">Recent Experience</h2>
            </div>
            <Link href="/experience" className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {experiences.slice(0, 2).map((exp) => (
              <div key={exp.id} className="glass-card rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <img src={exp.logo} alt={exp.company} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">{exp.position}</h4>
                    <p className="text-slate-600 text-sm">{exp.company}</p>
                    <p className="text-slate-400 text-xs mt-1 font-mono">{exp.startDate} – {exp.endDate} · {exp.location}</p>
                    <p className="text-slate-500 text-sm mt-3 line-clamp-2">{exp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Research */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-mono text-xs text-blue-600 tracking-widest uppercase mb-2">Scholarship</p>
            <h2 className="font-serif text-3xl text-slate-900">Recent Research</h2>
          </div>
          <Link href="/research" className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            All Research <ArrowRight size={15} />
          </Link>
        </div>
        <div className="space-y-4">
          {researchPapers.slice(0, 3).map((paper, idx) => (
            <Link
              key={paper.id}
              href={`/research/${paper.id}`}
              className="flex items-start gap-5 glass-card rounded-2xl p-6 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group"
            >
              <span className="font-mono text-2xl text-slate-200 font-bold flex-shrink-0 w-8 pt-0.5">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    paper.status === "Published" ? "bg-green-50 text-green-700 border-green-100" :
                    paper.status === "Under Review" ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                    "bg-blue-50 text-blue-700 border-blue-100"
                  }`}>{paper.status}</span>
                  <span className="text-slate-400 text-xs font-mono">{paper.year}</span>
                </div>
                <h3 className="font-serif text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-1">
                  {paper.title}
                </h3>
                <p className="text-slate-500 text-sm">{paper.authors?.join(", ")} · {paper.journal}</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-cyan-400 flex-shrink-0 mt-1 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-gradient-to-br from-[#040d1f] via-[#071428] to-[#040d1f] py-20 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs text-cyan-400 tracking-widest uppercase mb-4">Open to Collaboration</p>
          <h2 className="font-serif text-4xl text-white mb-5 leading-tight">
            Interested in working together?
          </h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Open to research collaborations, consulting, academic discussions, and professional inquiries.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm">
              Get in Touch <ArrowRight size={16} />
            </Link>
            <Link href="/research"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              Explore Research
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
