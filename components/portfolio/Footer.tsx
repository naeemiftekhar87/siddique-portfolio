import Link from "next/link";
import { Link2, GitFork, GraduationCap, Mail, ArrowRight } from "lucide-react";
import { profile } from "@/lib/data";
import { Button } from "@/components/ui/button";

const exploreLinks = [
  ["About",        "/about"],
  ["Portfolio",    "/portfolio"],
  ["Certificates", "/certificates"],
  ["eBooks",       "/ebooks"],
  ["Contact",      "/contact"],
];

const researchLinks = [
  ["Research & Publications", "/research"],
  ["Upcoming Research",       "/research"],
  ["Experience",              "/experience"],
  ["Achievements",            "/achievements"],
];

const profileLinks = [
  ["View Resume",          "/resume"],
  ["Infographic Resume",   "/resume/infographic"],
  ["Education",            "/education"],
  ["Skills",               "/skills"],
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#0a1628] text-slate-300">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div>
            <h3 className="font-serif text-white text-lg mb-3">{profile.name}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Placeholder tagline. Replace it with a short line about who you are and what you work on.
            </p>
            <div className="flex gap-2 mb-6">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-600 text-slate-400 hover:text-white transition-all border border-white/10">
                <Link2 size={15} />
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-white/10">
                <GitFork size={15} />
              </a>
              <a href={profile.scholar} target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-teal-600 text-slate-400 hover:text-white transition-all border border-white/10">
                <GraduationCap size={15} />
              </a>
              <a href={`mailto:${profile.email}`}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-white/10">
                <Mail size={15} />
              </a>
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
              {exploreLinks.map(([label, to]) => (
                <li key={to + label}>
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
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-wrap gap-8 justify-center">
            {[
              { value: profile.stats.experience, label: "Years Experience" },
              { value: profile.stats.degrees,     label: "Degrees" },
              { value: profile.stats.certificates, label: "Certificates" },
              { value: profile.stats.research,    label: "Research Projects" },
              { value: profile.stats.publications, label: "Publications" },
              { value: profile.stats.skills,      label: "Technical Skills" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-serif text-2xl text-white">{value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© {year} {profile.name}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>{profile.location}</span>
            <span>·</span>
            <a href={`mailto:${profile.email}`} className="hover:text-slate-400 transition-colors">{profile.email}</a>
            <span>·</span>
            <Link href="/admin" className="hover:text-slate-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
