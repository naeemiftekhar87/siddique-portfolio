import Link from "next/link";
import { Link2, GitFork, GraduationCap, Mail, ArrowRight } from "lucide-react";
import type { FooterSettings, SiteProfile } from "@/lib/data";
import { Button } from "@/components/ui/button";

const researchLinks = [
  ["Research & Publications", "/research"],
  ["Upcoming Research",       "/research/upcoming"],
  ["Experience",              "/experience"],
  ["Achievements",            "/achievements"],
];

const profileLinks = [
  ["View Resume",          "/resume"],
  ["Infographic Resume",   "/resume/infographic"],
  ["Education",            "/education"],
  ["Skills",               "/skills"],
];

type FooterProps = {
  profile: Pick<SiteProfile, "name" | "email" | "location" | "linkedin" | "github" | "scholar" | "stats">;
  footer: FooterSettings;
};

export default function Footer({ profile, footer }: FooterProps) {
  const year = new Date().getFullYear();
  const socials = [
    { href: profile.linkedin, label: "LinkedIn", Icon: Link2, hover: "hover:bg-blue-600" },
    { href: profile.github, label: "GitHub", Icon: GitFork, hover: "hover:bg-slate-700" },
    { href: profile.scholar, label: "Google Scholar", Icon: GraduationCap, hover: "hover:bg-teal-600" },
  ].filter((s) => s.href);
  const stats = [
    { value: profile.stats.experience, label: "Years Experience" },
    { value: profile.stats.degrees,     label: "Degrees" },
    { value: profile.stats.certificates, label: "Certificates" },
    { value: profile.stats.research,    label: "Research Projects" },
    { value: profile.stats.publications, label: "Publications" },
    { value: profile.stats.skills,      label: "Technical Skills" },
  ].filter((s) => s.value);
  return (
    <footer className="bg-(color:--site-footer) text-slate-300 print:hidden">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div>
            <h3 className="font-serif text-white text-lg mb-3">{profile.name}</h3>
            {footer.tagline && (
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {footer.tagline}
              </p>
            )}
            <div className="flex gap-2 mb-6">
              {socials.map(({ href, label, Icon, hover }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className={`p-2.5 rounded-xl bg-white/5 ${hover} text-slate-400 hover:text-white transition-all border border-white/10`}>
                  <Icon size={15} />
                </a>
              ))}
              {profile.email && (
                <a href={`mailto:${profile.email}`} aria-label="Email"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-white/10">
                  <Mail size={15} />
                </a>
              )}
            </div>
            <Button asChild variant="site-primary" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"><Link href="/contact"
             >
              Get in Touch <ArrowRight size={13} />
            </Link></Button>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white text-xs font-semibold mb-4 tracking-widest uppercase">Explore</h4>
            <ul className="space-y-2.5">
              {footer.quickLinks.map(({ id, label, to }) => (
                <li key={id}>
                  <Link href={to} className="text-slate-400 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Research */}
          <div>
            <h4 className="text-white text-xs font-semibold mb-4 tracking-widest uppercase">Research</h4>
            <ul className="space-y-2.5">
              {researchLinks.map(([label, to]) => (
                <li key={label}>
                  <Link href={to} className="text-slate-400 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resume & Profile */}
          <div>
            <h4 className="text-white text-xs font-semibold mb-4 tracking-widest uppercase">Resume & Profile</h4>
            <ul className="space-y-2.5">
              {profileLinks.map(([label, to]) => (
                <li key={label}>
                  <Link href={to} className="text-slate-400 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats strip */}
        {stats.length > 0 && (
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-wrap gap-8 justify-center">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-serif text-2xl text-white">{value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">{footer.copyright || `© ${year} ${profile.name}. All rights reserved.`}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
            {profile.location && <><span>{profile.location}</span><span>·</span></>}
            {profile.email && (
              <><a href={`mailto:${profile.email}`} className="hover:text-slate-400 transition-colors">{profile.email}</a><span>·</span></>
            )}
            <Link href="/admin" className="hover:text-slate-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
