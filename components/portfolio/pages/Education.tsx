import { Calendar, Star, BookOpen, GraduationCap } from "lucide-react";
import { education, profile } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function Education() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
              <GraduationCap size={18} className="text-teal-400" />
            </div>
            <span className="text-teal-400 text-sm font-medium tracking-wide uppercase">Academic History</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Education &<br /><span className="italic text-teal-300">Degrees</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed mb-10">
            Placeholder introduction to your academic background. Replace it with a sentence about your degrees and how they shape your work.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: education.length, label: "Degrees" },
              { value: education.filter((e) => e.status === "In Progress").length, label: "In Progress" },
              { value: education.filter((e) => e.status === "Completed").length, label: "Completed" },
              { value: profile.stats.certificates, label: "Certificates" },
            ].map(({ value, label }) => (
              <Card variant="site-glass-dark" key={label} className="p-4">
                <div className="font-serif text-3xl text-white">{value}</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {education.map((edu) => (
            <Card variant="site-white-card" key={edu.id} className="overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all">
              {/* Header gradient bar */}
              <div className={`h-1.5 ${edu.status === "In Progress" ? "bg-gradient-to-r from-blue-500 to-teal-500" : "bg-gradient-to-r from-slate-400 to-slate-500"}`} />

              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                      <img src={edu.logo} alt={edu.university} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-serif text-xl text-slate-900">{edu.university}</h3>
                        <p className="text-blue-600 font-medium mt-1">{edu.degree}</p>
                        <p className="text-slate-600 text-sm mt-0.5">{edu.major}</p>
                      </div>
                      <Badge variant="unstyled" className={`px-3 py-1 rounded-full text-xs font-medium font-mono ${
                        edu.status === "In Progress"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "bg-green-50 text-green-600 border border-green-100"
                      }`}>
                        {edu.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-slate-400 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> {edu.startDate} – {edu.endDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Star size={14} /> GPA: {edu.gpa}
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-6">{edu.description}</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-slate-900 font-semibold text-sm mb-3 flex items-center gap-2">
                          <BookOpen size={14} className="text-blue-600" /> Coursework
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {edu.coursework.map((c) => (
                            <Badge variant="unstyled" key={c} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-100">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-slate-900 font-semibold text-sm mb-3 flex items-center gap-2">
                          <GraduationCap size={14} className="text-teal-600" /> Skills Gained
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {edu.skills.map((s) => (
                            <Badge variant="unstyled" key={s} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-xs rounded-lg border border-teal-100">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
