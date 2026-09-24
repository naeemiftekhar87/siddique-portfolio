import type { Achievement } from "@/lib/data";
import { Trophy, Calendar, Building, Star, Award, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const categoryConfig: Record<string, { color: string; bg: string; dot: string; icon: React.ReactNode }> = {
  Academic:     { color: "text-blue-700",   bg: "bg-blue-50 border-blue-100",    dot: "bg-blue-500",    icon: <Star size={14} className="text-blue-500" /> },
  Professional: { color: "text-teal-700",   bg: "bg-teal-50 border-teal-100",    dot: "bg-teal-500",    icon: <Zap size={14} className="text-teal-500" /> },
  Research:     { color: "text-cyan-700",   bg: "bg-cyan-50 border-cyan-100",    dot: "bg-cyan-500",    icon: <Award size={14} className="text-cyan-600" /> },
  Competition:  { color: "text-amber-700",  bg: "bg-amber-50 border-amber-100",  dot: "bg-amber-500",   icon: <Trophy size={14} className="text-amber-500" /> },
  Community:    { color: "text-rose-700",   bg: "bg-rose-50 border-rose-100",    dot: "bg-rose-500",    icon: <Star size={14} className="text-rose-500" /> },
  Awards:       { color: "text-amber-700",  bg: "bg-amber-50 border-amber-100",  dot: "bg-amber-500",   icon: <Trophy size={14} className="text-amber-500" /> },
};

export default function Achievements({ achievements: allAchievements }: { achievements: Achievement[] }) {
  const categoryGroups = allAchievements.reduce((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const years = allAchievements.flatMap((a) => a.date.match(/\d{4}/g) ?? []).map(Number).sort((a, b) => a - b);
  const span = years.length === 0 ? "—" : years[0] === years[years.length - 1] ? String(years[0]) : `${years[0]}–${years[years.length - 1]}`;
  const statItems = [
    { value: allAchievements.length.toString(), label: "Total Achievements" },
    { value: Object.keys(categoryGroups).length.toString(), label: "Categories" },
    { value: span, label: "Time Span" },
    { value: new Set(allAchievements.map((a) => a.organization).filter(Boolean)).size.toString(), label: "Institutions" },
  ];

  const byDateDesc = [...allAchievements].sort((a, b) => b.date.localeCompare(a.date));
  // A pinned achievement is featured; otherwise the most recent one.
  const featured = allAchievements.find((a) => a.pinned) ?? byDateDesc[0];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <Trophy size={18} className="text-amber-400" />
            </div>
            <span className="text-amber-400 text-sm font-medium tracking-wide uppercase">Recognition</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Achievements &<br /><span className="italic text-amber-300">Milestones</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            Academic honors, professional recognitions, and research milestones earned across my professional and academic career.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {statItems.map(({ value, label }) => (
              <Card variant="site-glass-dark" key={label} className="p-4">
                <div className="font-serif text-3xl text-white">{value}</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {allAchievements.length === 0 && (
        <p className="text-center py-20 text-slate-400">No achievements yet.</p>
      )}

      {/* Featured / pinned achievement */}
      {featured && (
      <section className="max-w-5xl mx-auto px-6 -mt-8">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 shadow-xl">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Trophy size={28} className="text-white" />
            </div>
            <div>
              <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">{featured.pinned ? "Featured" : "Most Recent"}</span>
              <h2 className="font-serif text-2xl text-white mt-1 mb-2">{featured.title}</h2>
              <p className="text-white/80 text-sm leading-relaxed mb-3">{featured.description}</p>
              <div className="flex flex-wrap gap-4 text-white/70 text-xs">
                {featured.organization && <span className="flex items-center gap-1.5"><Building size={12} /> {featured.organization}</span>}
                {featured.date && <span className="flex items-center gap-1.5"><Calendar size={12} /> {featured.date}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* All achievements by category */}
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        {Object.entries(categoryGroups).map(([category, items]) => {
          const cfg = categoryConfig[category] ?? { color: "text-slate-600", bg: "bg-slate-50 border-slate-100", icon: <Star size={14} /> };
          return (
            <div key={category}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${cfg.bg}`}>
                  {cfg.icon}
                </div>
                <h2 className="font-serif text-2xl text-[#040d1f]">{category}</h2>
                <span className="ml-1 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-medium">{items.length}</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {items.map((ach) => (
                  <Card variant="site-glass-card"
                    key={ach.id}
                    className="p-6 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${cfg.bg}`}>
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg text-[#040d1f] mb-1 leading-snug group-hover:text-blue-600 transition-colors">
                          {ach.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-3">
                          {ach.organization && <span className="flex items-center gap-1"><Building size={11} /> {ach.organization}</span>}
                          {ach.date && <span className="flex items-center gap-1"><Calendar size={11} /> {ach.date}</span>}
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">{ach.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Timeline strip */}
      {allAchievements.length > 0 && (
      <section className="bg-blue-50/30 border-t border-blue-100/40 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl text-[#040d1f] mb-10 text-center">Achievement Timeline</h2>
          <div className="relative">
            {/* Line */}
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-slate-200 hidden sm:block" />
            <div className="space-y-6">
              {byDateDesc.map((ach, idx) => {
                const cfg = categoryConfig[ach.category] ?? { color: "text-slate-600", bg: "bg-slate-50 border-slate-100", dot: "bg-slate-400", icon: <Star size={14} /> };
                const isLeft = idx % 2 === 0;
                return (
                  <div key={ach.id} className={`sm:flex items-center gap-8 ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                    <div className="flex-1 hidden sm:block" />
                    {/* Dot */}
                    <div className="hidden sm:flex w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border-2 border-blue-200/60 items-center justify-center flex-shrink-0 z-10 shadow-md">
                      <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                    </div>
                    <div className={`flex-1 glass-card rounded-2xl p-4 shadow-sm`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs text-slate-400">{ach.date}</span>
                        <Badge variant="unstyled" className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>{ach.category}</Badge>
                      </div>
                      <p className="text-[#040d1f] font-medium text-sm">{ach.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{ach.organization}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
