"use client";

import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";
import {
  ArrowRight, ArrowUpRight, Award, BarChart2, Briefcase, Download, FolderKanban, GitFork, GraduationCap, Link2, Mail,
  Trophy, User, BookOpen,
} from "lucide-react";
import {
  MotionConfig, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants,
} from "motion/react";
import type { Achievement, Certificate, Education, Experience, HomeSettings, Paper, Project, SiteProfile, Skill } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/portfolio/count-up";
import { dateRange } from "@/lib/data/format";

// Glossy glass surface (app/globals.css .glass-card: sheen sweeps across on hover).
const glass = "glass-card";

// ── Motion (motion/react, formerly Framer Motion) ──────────────────────────
// Home runs its own animations; data-motion-managed keeps the site-wide
// scroll reveal (site-motion.tsx) off these elements.
const EASE = [0.2, 0.7, 0.2, 1] as const;
const rise: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};
const group = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } } as const;
const hoverLift = { y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } } as const;
const MotionLink = motion.create(Link);

/** Eyebrow + title (+ optional "view all" link) used by every section. */
function SectionHeader({ eyebrow, title, href, linkLabel }: { eyebrow: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <motion.div {...inView} variants={group(0.1)} className="flex flex-wrap items-end justify-between gap-4 mb-10">
      <div>
        <motion.p variants={rise} className="flex items-center gap-2 text-xs font-semibold text-site-accent tracking-[0.14em] uppercase mb-3">
          <motion.span
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }}
            className="h-px w-6 origin-left bg-gradient-to-r from-site-accent to-blue-500" aria-hidden
          />
          {eyebrow}
        </motion.p>
        <motion.h2 variants={rise} className="font-serif text-3xl md:text-4xl text-slate-100 tracking-tight">{title}</motion.h2>
      </div>
      {href && linkLabel && (
        <motion.div variants={rise}>
          <Link href={href} className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-site-accent transition-colors">
            {linkLabel}
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <motion.div variants={rise} className="px-4 py-6 sm:px-6 text-center sm:text-left">
      <div className="font-serif text-2xl md:text-3xl leading-none mb-2 truncate bg-gradient-to-b from-slate-100 to-slate-300 bg-clip-text text-transparent">
        {value ? <CountUp value={value} /> : "—"}
      </div>
      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">{label}</div>
    </motion.div>
  );
}

type OverviewCardProps = {
  href: string; title: string; Icon: typeof Briefcase; value: ReactNode; unit: string; description: string; tone: string;
};

function OverviewCard({ href, title, Icon, value, unit, description, tone }: OverviewCardProps) {
  return (
    <MotionLink
      href={href}
      variants={rise}
      whileHover={hoverLift}
      className={`group relative flex flex-col rounded-2xl p-6 ${glass}`}
    >
      <div className="flex items-center justify-between mb-8">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ring-inset transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none ${tone}`}>
          <Icon size={18} />
        </span>
        <ArrowUpRight size={18} className="text-slate-500 group-hover:text-site-accent transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
      </div>
      <p className="font-serif text-4xl text-slate-100 leading-none mb-1 truncate">{value}</p>
      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-4">{unit}</p>
      <h3 className="font-sans font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
    </MotionLink>
  );
}

/** Portrait that tilts toward the pointer, with a moving glare and a slow float. */
function Portrait({ photo, name, children }: { photo: string; name: string; children?: ReactNode }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 160, damping: 18 };
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), spring);
  const glareX = useTransform(px, [0, 1], [0, 100]);
  const glareY = useTransform(py, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22), transparent 55%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { px.set(0.5); py.set(0.5); };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
      className="relative w-full max-w-[22rem]"
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ perspective: 900 }}
      >
        <div className="absolute -inset-px rounded-[2.1rem] bg-gradient-to-br from-site-accent/60 via-blue-500/20 to-transparent" aria-hidden />
        <div className="absolute -inset-8 rounded-full bg-site-glow/25 blur-3xl" aria-hidden />
        <motion.div
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-navy-light"
        >
          {photo ? (
            <img src={photo} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" aria-hidden>
              <User size={72} className="text-slate-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" aria-hidden />
          <motion.div className="absolute inset-0 mix-blend-soft-light motion-reduce:hidden" style={{ background: glare }} aria-hidden />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#040d1f]/70 to-transparent" aria-hidden />
        </motion.div>
      </motion.div>
      {children}
    </motion.div>
  );
}

/** Soft light pool drifting slowly behind the content. */
function Glow({ className, duration, delay = 0 }: { className: string; duration: number; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`absolute rounded-full blur-[120px] ${className}`}
      animate={reduce ? undefined : { x: ["0%", "6%", "-4%", "0%"], y: ["0%", "8%", "4%", "0%"], scale: [1, 1.12, 0.95, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
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
  const reduce = useReducedMotion();
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
    // reducedMotion="user": transforms are dropped for visitors who ask for less motion.
    <MotionConfig reducedMotion="user">
    {/* The page background and its glow come from the admin Colours settings (body). */}
    <div data-motion-managed className="relative min-h-screen overflow-hidden text-slate-300 tracking-[0.01em]">
      {/* Ambient light for the whole page */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Glow className="-top-40 right-[-10%] w-[42rem] h-[42rem] bg-site-glow/25" duration={24} />
        <Glow className="top-[28rem] left-[-15%] w-[34rem] h-[34rem] bg-site-glow/10" duration={30} delay={-8} />
        <Glow className="top-[70rem] right-[-10%] w-[30rem] h-[30rem] bg-site-glow/15" duration={27} delay={-4} />
        <Glow className="bottom-40 left-[20%] w-[30rem] h-[30rem] bg-site-glow/10" duration={33} delay={-12} />
      </div>

      {/* Hero */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-24">
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6 }}
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_70%_20%,black,transparent)]"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-20 items-center">
            <motion.div initial="hidden" animate="show" variants={group(0.09, 0.05)} className="min-w-0">
              {profile.badge && (
                <motion.div variants={rise}>
                  <Badge variant="unstyled" className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-7 text-xs font-medium text-slate-200 ${glass}`}>
                    <span className="relative flex w-2 h-2" aria-hidden>
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping motion-reduce:animate-none" />
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
                    </span>
                    {profile.badge}
                  </Badge>
                </motion.div>
              )}
              <motion.h1 variants={rise} className="font-serif text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-7xl tracking-tight mb-6 break-words">
                {/* A soft band of the accent colour glides through the name. */}
                <motion.span
                  className="bg-[linear-gradient(90deg,#f1f5f9_0%,#f1f5f9_40%,var(--site-accent)_50%,#f1f5f9_60%,#f1f5f9_100%)] bg-[length:250%_100%] bg-clip-text text-transparent"
                  initial={{ backgroundPosition: "100% 50%" }}
                  animate={reduce ? undefined : { backgroundPosition: ["100% 50%", "-150% 50%"] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                >
                  {profile.name}
                </motion.span>
              </motion.h1>
              {profile.headline && (
                <motion.p variants={rise} className="text-xl md:text-2xl text-slate-200 leading-snug mb-5 max-w-2xl">
                  {profile.headline}
                </motion.p>
              )}
              {profile.summary && (
                <motion.p variants={rise} className="text-base md:text-lg text-slate-400 leading-relaxed mb-9 max-w-xl">
                  {profile.summary.length > 200 ? `${profile.summary.slice(0, 200)}...` : profile.summary}
                </motion.p>
              )}

              <motion.div variants={rise} className="flex flex-wrap gap-3 mb-10">
                {home.cta1Label && home.cta1Link && (
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                    <Button asChild variant="unstyled" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 px-6 py-3.5 font-medium text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_30px_-10px_rgba(59,130,246,0.8)] hover:from-blue-400 hover:to-blue-600 transition-colors">
                      <Link href={home.cta1Link}>
                        {home.cta1Label}
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                      </Link>
                    </Button>
                  </motion.div>
                )}
                {home.cta2Label && home.cta2Link && (
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                    <Button asChild variant="unstyled" className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-medium text-slate-100 ${glass}`}>
                      <Link href={home.cta2Link}>
                        <Download size={16} /> {home.cta2Label}
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </motion.div>

              {socials.length > 0 && (
                <motion.div variants={rise} className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400 mr-2">Connect</span>
                  {socials.map(({ href, label, Icon }) => (
                    <motion.a
                      key={label}
                      href={href}
                      aria-label={label}
                      title={label}
                      {...(label === "Email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                      whileHover={{ y: -3, scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      className={`w-10 h-10 rounded-full text-slate-300 flex items-center justify-center hover:text-site-accent ${glass}`}
                    >
                      <Icon size={16} />
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Portrait */}
            <div className="flex justify-center lg:justify-end">
              <Portrait photo={profile.photo} name={profile.name}>
                {(field || profile.stats.experience) && (
                  <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
                    className="absolute -bottom-5 left-4 right-4 sm:-left-8 sm:right-auto"
                  >
                    <Card variant="unstyled" className={`rounded-2xl px-5 py-4 flex items-center gap-3 ${glass}`}>
                      <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-slate-100 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                        <Briefcase size={18} />
                      </span>
                      <div className="min-w-0">
                        {field && <div className="text-sm font-semibold text-slate-100 truncate">{field}</div>}
                        {profile.stats.experience && <div className="text-xs text-slate-400">{profile.stats.experience} yrs experience</div>}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </Portrait>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {showStats && (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...inView} variants={group(0.07)} className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x divide-white/10 rounded-2xl ${glass}`}>
            {stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </motion.div>
        </section>
      )}

      {/* Professional background */}
      {sections.showProfileCards && (
        <section className="relative py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="Profile" title="Professional Background" />
          <motion.div {...inView} variants={group(0.1)} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
          </motion.div>
        </section>
      )}

      {/* Featured: research, portfolio, certificates */}
      {sections.showFeatured && (
        <section className={`relative max-w-7xl mx-auto px-4 sm:px-6 ${sections.showProfileCards ? "pb-20 md:pb-24" : "py-20 md:py-24"}`}>
          <motion.div {...inView} variants={group(0.12)} className={`grid md:grid-cols-3 rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/10 ${glass}`}>
            {[
              { href: "/research", title: "Research", count: researchPapers.length, text: "research papers across your research areas.", cta: "Explore Research", Icon: BookOpen },
              { href: "/portfolio", title: "Portfolio", count: projects.length, text: "projects from concept to delivery.", cta: "View Projects", Icon: FolderKanban },
              { href: "/certificates", title: "Certificates", count: certificates.length, text: "professional and academic certificates.", cta: "View Certificates", Icon: Award },
            ].map(({ href, title, count, text, cta, Icon }) => (
              <MotionLink key={href} href={href} variants={rise} className="group p-7 md:p-8 hover:bg-white/[0.04] transition-colors flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <Icon size={18} className="text-site-accent transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transform-none" />
                  <h3 className="font-sans font-semibold text-slate-100">{title}</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1">
                  <span className="font-serif text-2xl text-slate-100 mr-1.5">{count}</span>{text}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-site-accent">
                  {cta}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
                </span>
              </MotionLink>
            ))}
          </motion.div>
        </section>
      )}

      {/* Recent experience */}
      {sections.showExperience && experiences.length > 0 && (
        <section className="relative py-20 md:py-24 border-y border-white/[0.06] bg-white/[0.015]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader eyebrow="Career" title="Recent Experience" href="/experience" linkLabel="View all experience" />
            <motion.ol {...inView} variants={group(0.12)} className="grid md:grid-cols-2 gap-5">
              {experiences.slice(0, 2).map((exp) => (
                <motion.li key={exp.id} variants={rise}>
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
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>
      )}

      {/* Recent research */}
      {sections.showResearchInterests && researchPapers.length > 0 && (
        <section className="relative py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="Scholarship" title="Recent Research" href="/research" linkLabel="All research" />
          <motion.ol {...inView} variants={group(0.1)} className={`rounded-2xl divide-y divide-white/10 overflow-hidden ${glass}`}>
            {researchPapers.slice(0, 3).map((paper, idx) => (
              <motion.li key={paper.id} variants={rise}>
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
                  <ArrowUpRight size={18} className="text-slate-500 group-hover:text-site-accent flex-shrink-0 mt-1 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
                </Link>
              </motion.li>
            ))}
          </motion.ol>
        </section>
      )}

      {/* Call to action */}
      <section className="relative px-4 sm:px-6 pb-20 md:pb-24 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-site-glow/40 via-(color:--site-bg)/80 to-site-accent/15 px-6 py-16 md:px-16 md:py-20 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_40px_80px_-40px_rgba(37,99,235,0.6)]"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.07] to-transparent" />
            {/* A slow light beam sweeping across the panel */}
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -skew-x-12 motion-reduce:hidden"
              initial={{ left: "-40%" }}
              animate={{ left: ["-40%", "140%"] }}
              transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
            />
          </div>
          <motion.div {...inView} variants={group(0.1, 0.2)} className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <motion.p variants={rise} className="font-mono text-xs text-site-accent tracking-[0.2em] uppercase mb-4">Open to Collaboration</motion.p>
              <motion.h2 variants={rise} className="font-serif text-3xl md:text-5xl text-slate-100 leading-tight tracking-tight mb-4">
                Interested in working together?
              </motion.h2>
              <motion.p variants={rise} className="text-slate-200 text-base md:text-lg leading-relaxed max-w-xl">
                Open to research collaborations, consulting, academic discussions, and professional inquiries.
              </motion.p>
            </div>
            <motion.div variants={rise} className="flex flex-wrap gap-3 lg:justify-end">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button asChild variant="unstyled" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-white to-slate-200 px-6 py-3.5 font-medium text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_30px_-10px_rgba(255,255,255,0.4)] hover:from-blue-50 hover:to-blue-100 transition-colors">
                  <Link href="/contact">
                    Get in Touch
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button asChild variant="unstyled" className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-medium text-slate-100 ${glass}`}>
                  <Link href="/research">Explore Research</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
    </MotionConfig>
  );
}
