import { education, experiences, profile } from "@/lib/data";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  GitFork,
  GraduationCap,
  Link2,
  Mail,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function About() {
  const currentRole = experiences[0];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=280&h=280&fit=crop"
                  alt={profile.name}
                  className="w-36 h-36 rounded-3xl object-cover border-2 border-white/10 shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-mono px-2.5 py-1 rounded-lg border-2 border-[#040d1f]">
                  {profile.badge}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-cyan-400 text-sm font-medium tracking-wide uppercase mb-3">
                Profile
              </p>
              <h1 className="font-serif text-5xl text-white mb-3 leading-tight">
                {profile.name}
              </h1>
              <p className="text-cyan-300 font-medium mb-4">
                {profile.headline}
              </p>
              <div className="flex flex-wrap gap-4 text-slate-400 text-sm mb-6">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} /> {profile.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={14} /> {profile.email}
                </span>
              </div>
              <div className="flex gap-3">
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm rounded-xl border border-white/10 hover:bg-white/20 transition-colors"
                >
                  <Link2 size={14} /> LinkedIn
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm rounded-xl border border-white/10 hover:bg-white/20 transition-colors"
                >
                  <GitFork size={14} /> GitHub
                </a>
                <a
                  href={profile.scholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm rounded-xl border border-white/10 hover:bg-white/20 transition-colors"
                >
                  <GraduationCap size={14} /> Scholar
                </a>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-12">
            {[
              { value: profile.stats.experience, label: "Years Exp." },
              { value: profile.stats.degrees, label: "Degrees" },
              { value: profile.stats.certificates, label: "Certificates" },
              { value: profile.stats.research, label: "Research" },
              { value: profile.stats.publications, label: "Publications" },
              { value: profile.stats.skills, label: "Skills" },
            ].map(({ value, label }) => (
              <Card variant="site-glass-dark"
                key={label}
                className="p-4 text-center"
              >
                <div className="font-serif text-2xl text-white">{value}</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-serif text-2xl text-[#040d1f] mb-4">
                Professional Summary
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {profile.summary}
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#040d1f] mb-4">
                Career Focus
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Placeholder career focus. Replace it with a few sentences about
                your current role, the problems you focus on, and how your
                professional experience and research connect.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#040d1f] mb-4">
                Academic Journey
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Placeholder academic journey. Replace it with a short narrative
                about your degrees, the institutions you studied at, and how
                your studies connect to your current work and research.
              </p>
              <div className="space-y-3">
                {education.map((edu) => (
                  <Card variant="site-panel"
                    key={edu.id}
                    className="flex items-start gap-4 p-4"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${edu.status === "In Progress" ? "bg-blue-100" : "bg-teal-100"}`}
                    >
                      <GraduationCap
                        size={16}
                        className={
                          edu.status === "In Progress"
                            ? "text-blue-600"
                            : "text-teal-600"
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-medium text-sm">
                        {edu.degree}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {edu.university} · {edu.startDate}–{edu.endDate}
                      </p>
                    </div>
                    <Badge variant="unstyled"
                      className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 border ${edu.status === "In Progress" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-green-50 text-green-600 border-green-100"}`}
                    >
                      {edu.status}
                    </Badge>
                  </Card>
                ))}
              </div>
            </div>

            {currentRole && (
              <div>
                <h2 className="font-serif text-2xl text-[#040d1f] mb-4">
                  Current Role
                </h2>
                <Card variant="site-glass-card" className="p-6 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <img
                      src={currentRole.logo}
                      alt={currentRole.company}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {currentRole.position}
                      </h3>
                      <p className="text-blue-600 text-sm font-medium">
                        {currentRole.company}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {currentRole.startDate} – {currentRole.endDate} ·{" "}
                        {currentRole.location}
                      </p>
                      <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                        {currentRole.description}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/experience"
                    className="flex items-center gap-1.5 text-sm text-blue-600 font-medium mt-4 hover:gap-2.5 transition-all"
                  >
                    Full experience history <ArrowRight size={14} />
                  </Link>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card variant="site-panel" className="p-6">
              <h3 className="font-serif text-lg text-[#040d1f] mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-blue-500" /> Research
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.researchInterests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1.5 bg-white text-blue-700 text-xs rounded-xl border border-blue-100 font-medium hover:bg-blue-50 transition-colors cursor-default"
                  >
                    {interest}
                  </span>
                ))}
              </div>
              <Link
                href="/research"
                className="flex items-center gap-1 text-xs text-blue-600 mt-4 hover:underline"
              >
                View research papers <ArrowRight size={11} />
              </Link>
            </Card>

            <Card variant="site-glass-card" className="p-6">
              <h3 className="font-serif text-lg text-[#040d1f] mb-4">
                At a Glance
              </h3>
              <div className="space-y-3">
                {[
                  ["Experience", profile.stats.experience + " years"],
                  ["Degrees", profile.stats.degrees],
                  ["Certificates", profile.stats.certificates + "+"],
                  ["Research Projects", profile.stats.research],
                  ["Publications", profile.stats.publications],
                  ["Technical Skills", profile.stats.skills],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0"
                  >
                    <span className="text-slate-500 text-sm">{label}</span>
                    <span className="font-semibold text-[#040d1f] text-sm font-mono">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Experience", to: "/experience", icon: Briefcase },
                { label: "Research", to: "/research", icon: BookOpen },
                { label: "Portfolio", to: "/portfolio", icon: GitFork },
                {
                  label: "Certificates",
                  to: "/certificates",
                  icon: GraduationCap,
                },
              ].map(({ label, to, icon: Icon }) => (
                <Link
                  key={to}
                  href={to}
                  className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 text-sm hover:border-blue-200 hover:text-blue-600 transition-all"
                >
                  <Icon size={14} /> {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
