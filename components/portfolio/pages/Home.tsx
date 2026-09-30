"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight, ArrowUpRight, Award, BarChart2, Briefcase, Download, FolderKanban, GitFork, GraduationCap, Link2, Mail,
  Trophy, User, BookOpen,
} from "lucide-react";
import type { Achievement, Certificate, Education, Experience, HomeSettings, Paper, Project, SiteProfile, Skill } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/portfolio/count-up";
import { dateRange } from "@/lib/data/format";

// Glossy glass surface: translucent fill with a top-lit sheen, hairline border
// and an inner highlight along the top edge.
const glass =
  "bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_40px_-24px_rgba(0,0,0,0.6)]";
const glassHover =
  "hover:border-site-accent/30 hover:from-white/[0.12] hover:to-white/[0.04] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_24px_48px_-20px_rgba(96,165,250,0.2)]";

/** Eyebrow + title (+ optional "view all" link) used by every section. */
function SectionHeader({ eyebrow, title, href, linkLabel }: { eyebrow: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
      <div>
        <p className="flex items-center gap-2 text-xs font-semibold text-site-accent tracking-[0.14em] uppercase mb-3">
          <span className="h-px w-6 bg-gradient-to-r from-site-accent to-blue-500" aria-hidden />
          {eyebrow}
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-slate-100 tracking-tight">{title}</h2>
      </div>
      {href && linkLabel && (
        <Link href={href} className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-site-accent transition-colors">
          {linkLabel}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
        </Link>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-4 py-6 sm:px-6 text-center sm:text-left">
      <div className="font-serif text-2xl md:text-3xl leading-none mb-2 truncate bg-gradient-to-b from-slate-100 to-slate-300 bg-clip-text text-transparent">
        {value ? <CountUp value={value} /> : "—"}
      </div>
      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">{label}</div>
    </div>
  );
}

type OverviewCardProps = {
  href: string; title: string; Icon: typeof Briefcase; value: ReactNode; unit: string; description: string; tone: string;
};

function OverviewCard({ href, title, Icon, value, unit, description, tone }: OverviewCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col rounded-2xl p-6 ${glass} ${glassHover} hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-8">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ring-inset ${tone}`}>
          <Icon size={18} />
        </span>
        <ArrowUpRight size={18} className="text-slate-500 group-hover:text-site-accent transition-colors" />
      </div>
      <p className="font-serif text-4xl text-slate-100 leading-none mb-1 truncate">{value}</p>
      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-4">{unit}</p>
      <h3 className="font-sans font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
    </Link>
  );
}

type HomeProps = {
  profile: SiteProfile;
  home: HomeSettings;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  achievements: Achievement[];
  researchPapers: Paper[];
  certificates: Certificate[];
  projects: Project[];
};

const paperStatusStyle = (status: Paper["status"]) =>
  status === "Published" ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/25" :
  status === "Under Review" ? "bg-amber-400/10 text-amber-300 border-amber-400/25" :
  "bg-blue-400/10 text-site-accent border-blue-400/25";

export default function Home({ profile, home, experiences, education, skills, achievements, researchPapers, certificates, projects }: HomeProps) {
  const { sections } = home;
  const socials = [
    { href: profile.linkedin, label: "LinkedIn", Icon: Link2 },
    { href: profile.scholar, label: "Google Scholar", Icon: GraduationCap },
    { href: profile.github, label: "GitHub", Icon: GitFork },
    { href: profile.email && `mailto:${profile.email}`, label: "Email", Icon: Mail },
  ].filter((s) => s.href);
  const field = profile.badge.split(/[•|·]/)[0]?.trim();
  const stats = [
    { value: profile.stats.experience, label: "Years Experience" },
    { value: profile.stats.degrees, label: "Academic Degrees" },
    { value: profile.stats.certificates, label: "Certificates" },
    { value: profile.stats.research, label: "Research Projects" },
    { value: profile.stats.publications, label: "Publications" },
    { value: profile.stats.skills, label: "Technical Skills" },
  ];
  const showStats = sections.showStats && stats.some((s) => s.value);
  const inProgress = education.filter((e) => e.status === "In Progress").length;

  return (
    // The page background and its glow come from the admin Colours settings (body).
    <div className="relative min-h-screen overflow-hidden text-slate-300 tracking-[0.01em]">
      {/* Ambient light for the whole page */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-10%] w-[42rem] h-[42rem] rounded-full bg-site-glow/25 blur-[120px]" />
        <div className="absolute top-[28rem] left-[-15%] w-[34rem] h-[34rem] rounded-full bg-site-glow/10 blur-[120px]" />
        <div className="absolute top-[70rem] right-[-10%] w-[30rem] h-[30rem] rounded-full bg-site-glow/15 blur-[120px]" />
        <div className="absolute bottom-40 left-[20%] w-[30rem] h-[30rem] rounded-full bg-site-glow/10 blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_70%_20%,black,transparent)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-20 items-center">
            <div className="min-w-0">
              {profile.badge && (
                <Badge variant="unstyled" className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-7 text-xs font-medium text-slate-200 ${glass}`}>
                  <span className="relative flex w-2 h-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping motion-reduce:animate-none" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
                  </span>
                  {profile.badge}
                </Badge>
              )}
              <h1 className="font-serif text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-7xl tracking-tight mb-6 break-words bg-gradient-to-br from-slate-100 via-slate-100 to-site-accent bg-clip-text text-transparent">
                {profile.name}
              </h1>
              {profile.headline && (
                <p className="text-xl md:text-2xl text-slate-200 leading-snug mb-5 max-w-2xl">
                  {profile.headline}
                </p>
              )}
              {profile.summary && (
                <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-9 max-w-xl">
                  {profile.summary.length > 200 ? `${profile.summary.slice(0, 200)}...` : profile.summary}
                </p>
              )}

              <div className="flex flex-wrap gap-3 mb-10">
                {home.cta1Label && home.cta1Link && (
                  <Button asChild variant="unstyled" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 px-6 py-3.5 font-medium text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_30px_-10px_rgba(59,130,246,0.8)] hover:from-blue-400 hover:to-blue-600 transition-colors">
                    <Link href={home.cta1Link}>
                      {home.cta1Label}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                    </Link>
                  </Button>
                )}
                {home.cta2Label && home.cta2Link && (
                  <Button asChild variant="unstyled" className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-medium text-slate-100 ${glass} ${glassHover} transition-all`}>
                    <Link href={home.cta2Link}>
                      <Download size={16} /> {home.cta2Label}
                    </Link>
                  </Button>
                )}
              </div>

              {socials.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400 mr-2">Connect</span>
                  {socials.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      title={label}
                      {...(label === "Email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                      className={`w-10 h-10 rounded-full text-slate-300 flex items-center justify-center hover:text-site-accent ${glass} ${glassHover} transition-all`}
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Portrait */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[22rem]">
                <div className="absolute -inset-px rounded-[2.1rem] bg-gradient-to-br from-site-accent/60 via-blue-500/20 to-transparent" aria-hidden />
                <div className="absolute -inset-8 rounded-full bg-site-glow/25 blur-3xl" aria-hidden />
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-navy-light">
                  {profile.photo ? (
                    <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" aria-hidden>
                      <User size={72} className="text-slate-600" />
                    </div>
                  )}
                  {/* Gloss: diagonal sheen + bottom fade into the page */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#040d1f]/70 to-transparent" aria-hidden />
                </div>
                {(field || profile.stats.experience) && (
                  <Card variant="unstyled" className={`absolute -bottom-5 left-4 right-4 sm:-left-8 sm:right-auto rounded-2xl px-5 py-4 flex items-center gap-3 bg-[#0a1628]/80 ${glass}`}>
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-slate-100 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                      <Briefcase size={18} />
                    </span>
                    <div className="min-w-0">
                      {field && <div className="text-sm font-semibold text-slate-100 truncate">{field}</div>}
                      {profile.stats.experience && <div className="text-xs text-slate-400">{profile.stats.experience} yrs experience</div>}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {showStats && (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x divide-white/10 rounded-2xl ${glass}`}>
            {stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </section>
      )}

      {/* Professional background */}
      {sections.showProfileCards && (
        <section className="relative py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="Profile" title="Professional Background" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <OverviewCard
              href="/experience" title="Experience" Icon={Briefcase} tone="bg-blue-500/15 text-site-accent ring-blue-400/25"
              value={profile.stats.experience || experiences.length}
              unit={profile.stats.experience ? "years" : "roles"}
              description={`${experiences.length} roles across your professional career so far.`}
            />
            <OverviewCard
              href="/education" title="Education" Icon={GraduationCap} tone="bg-teal-500/15 text-teal-300 ring-teal-400/25"
              value={education.length} unit="degrees"
              description={`${inProgress} in progress · ${education.length - inProgress} completed · across your academic programs.`}
            />
            <OverviewCard
              href="/skills" title="Skills" Icon={BarChart2} tone="bg-indigo-500/15 text-indigo-300 ring-indigo-400/25"
              value={profile.stats.skills || skills.length} unit="skills"
              description={`Technical, professional, and interpersonal skills across ${new Set(skills.map((s) => s.category)).size} domains.`}
            />
            <OverviewCard
              href="/achievements" title="Achievements" Icon={Trophy} tone="bg-amber-500/15 text-amber-300 ring-amber-400/25"
              value={achievements.length} unit="awards"
              description={`Academic honors, professional recognitions, and competition placements across ${new Set(achievements.map((a) => a.category)).size} categories.`}
            />
          </div>
        </section>
      )}

      {/* Featured: research, portfolio, certificates */}
      {sections.showFeatured && (
        <section className={`relative max-w-7xl mx-auto px-4 sm:px-6 ${sections.showProfileCards ? "pb-20 md:pb-24" : "py-20 md:py-24"}`}>
          <div className={`grid md:grid-cols-3 rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/10 ${glass}`}>
            {[
              { href: "/research", title: "Research", count: researchPapers.length, text: "research papers across your research areas.", cta: "Explore Research", Icon: BookOpen },
              { href: "/portfolio", title: "Portfolio", count: projects.length, text: "projects from concept to delivery.", cta: "View Projects", Icon: FolderKanban },
              { href: "/certificates", title: "Certificates", count: certificates.length, text: "professional and academic certificates.", cta: "View Certificates", Icon: Award },
            ].map(({ href, title, count, text, cta, Icon }) => (
              <Link key={href} href={href} className="group p-7 md:p-8 hover:bg-white/[0.04] transition-colors flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <Icon size={18} className="text-site-accent" />
                  <h3 className="font-sans font-semibold text-slate-100">{title}</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1">
                  <span className="font-serif text-2xl text-slate-100 mr-1.5">{count}</span>{text}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-site-accent">
                  {cta}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent experience */}
      {sections.showExperience && experiences.length > 0 && (
        <section className="relative py-20 md:py-24 border-y border-white/[0.06] bg-white/[0.015]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader eyebrow="Career" title="Recent Experience" href="/experience" linkLabel="View all experience" />
            <ol className="grid md:grid-cols-2 gap-5">
              {experiences.slice(0, 2).map((exp) => (
                <li key={exp.id}>
                  <Card variant="unstyled" className={`h-full rounded-2xl p-6 md:p-7 ${glass}`}>
                    <div className="flex items-start gap-4">
                      {exp.logo ? (
                        <img loading="lazy" decoding="async" src={exp.logo} alt={exp.company} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 ring-1 ring-white/15" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-500/15 ring-1 ring-inset ring-blue-400/25 flex items-center justify-center flex-shrink-0"><Briefcase size={20} className="text-site-accent" /></div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-mono text-slate-400 mb-1.5">{[dateRange(exp.startDate, exp.endDate), exp.location].filter(Boolean).join(" · ")}</p>
                        <h3 className="font-sans font-semibold text-lg text-slate-100 leading-snug">{exp.position}</h3>
                        <p className="text-site-accent text-sm font-medium">{exp.company}</p>
                        {exp.description && <p className="text-slate-300 text-sm leading-relaxed mt-3 line-clamp-3">{exp.description}</p>}
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Recent research */}
      {sections.showResearchInterests && researchPapers.length > 0 && (
        <section className="relative py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="Scholarship" title="Recent Research" href="/research" linkLabel="All research" />
          <ol className={`rounded-2xl divide-y divide-white/10 overflow-hidden ${glass}`}>
            {researchPapers.slice(0, 3).map((paper, idx) => (
              <li key={paper.id}>
                <Link href={`/research/${paper.id}`} className="group flex items-start gap-4 sm:gap-6 p-6 md:p-7 hover:bg-white/[0.04] transition-colors">
                  <span className="hidden sm:block font-mono text-sm text-slate-500 pt-1 w-6 flex-shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <Badge variant="unstyled" className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${paperStatusStyle(paper.status)}`}>{paper.status}</Badge>
                      {paper.year && <span className="text-slate-400 text-xs font-mono">{paper.year}</span>}
                    </div>
                    <h3 className="font-serif text-xl text-slate-100 group-hover:text-site-accent transition-colors leading-snug mb-1.5">
                      {paper.title}
                    </h3>
                    <p className="text-slate-400 text-sm truncate">{[paper.authors.join(", "), paper.journal].filter(Boolean).join(" · ")}</p>
                  </div>
                  <ArrowUpRight size={18} className="text-slate-500 group-hover:text-site-accent flex-shrink-0 mt-1 transition-colors" />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Call to action */}
      <section className="relative px-4 sm:px-6 pb-20 md:pb-24 pt-4">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-site-glow/40 via-(color:--site-bg)/80 to-site-accent/15 px-6 py-16 md:px-16 md:py-20 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_40px_80px_-40px_rgba(37,99,235,0.6)]">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.07] to-transparent" />
          </div>
          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <p className="text-xs font-semibold text-site-accent tracking-[0.14em] uppercase mb-4">Open to Collaboration</p>
              <h2 className="font-serif text-3xl md:text-5xl text-slate-100 leading-tight tracking-tight mb-4">
                Interested in working together?
              </h2>
              <p className="text-slate-200 text-base md:text-lg leading-relaxed max-w-xl">
                Open to research collaborations, consulting, academic discussions, and professional inquiries.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button asChild variant="unstyled" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-white to-slate-200 px-6 py-3.5 font-medium text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_30px_-10px_rgba(255,255,255,0.4)] hover:from-blue-50 hover:to-blue-100 transition-colors">
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </Link>
              </Button>
              <Button asChild variant="unstyled" className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-medium text-slate-100 ${glass} ${glassHover} transition-all`}>
                <Link href="/research">Explore Research</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
