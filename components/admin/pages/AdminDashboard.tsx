import Link from "next/link";
import {
  Briefcase, GraduationCap, Award, FolderOpen, BookOpen, FileText,
  BarChart2, MessageSquare, TrendingUp, ArrowUpRight, Clock,
  Plus, CheckCircle, Eye
} from "lucide-react";

function StatCard({ label, value, icon: Icon, color, to }: {
  label: string; value: string | number; icon: React.ElementType; color: string; to: string;
}) {
  return (
    <Link href={to} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        <ArrowUpRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
      </div>
      <div className="font-serif text-3xl text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </Link>
  );
}

// The admin starts empty: counts and activity come from the database in
// Phase 5, so nothing sample-based is shown here.
const counts = {
  experiences: 0, education: 0, skills: 0, certificates: 0, projects: 0,
  researchPapers: 0, publications: 0, ebooks: 0, unreadMessages: 0,
};

const recentActivity: { action: string; detail: string; time: string; type: string }[] = [];

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-white mb-1">Dashboard</h1>
        <p className="text-slate-400 text-sm">Welcome back. Here&apos;s an overview of your platform.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Experience" value={counts.experiences} icon={Briefcase} color="bg-blue-600" to="/admin/experience" />
        <StatCard label="Degrees" value={counts.education} icon={GraduationCap} color="bg-teal-600" to="/admin/education" />
        <StatCard label="Skills" value={counts.skills} icon={BarChart2} color="bg-violet-600" to="/admin/skills" />
        <StatCard label="Certificates" value={counts.certificates} icon={Award} color="bg-amber-500" to="/admin/certificates/professional" />
        <StatCard label="Projects" value={counts.projects} icon={FolderOpen} color="bg-pink-600" to="/admin/projects" />
        <StatCard label="Research Papers" value={counts.researchPapers} icon={FileText} color="bg-indigo-600" to="/admin/research/papers" />
        <StatCard label="Publications" value={counts.publications} icon={BookOpen} color="bg-emerald-600" to="/admin/publications" />
        <StatCard label="eBooks" value={counts.ebooks} icon={BookOpen} color="bg-orange-500" to="/admin/ebooks" />
        <StatCard label="Messages" value={counts.unreadMessages} icon={MessageSquare} color="bg-rose-600" to="/admin/messages" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-lg text-white">Recent Activity</h2>
            <span className="text-xs text-slate-500">Last 7 days</span>
          </div>
          <div className="space-y-4">
            {recentActivity.length === 0 && (
              <p className="text-slate-500 text-sm py-8 text-center">No activity yet. Changes you make will appear here.</p>
            )}
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.type === "add" ? "bg-green-950 text-green-400" :
                  item.type === "publish" ? "bg-blue-950 text-blue-400" :
                  item.type === "message" ? "bg-violet-950 text-violet-400" :
                  "bg-slate-800 text-slate-400"
                }`}>
                  {item.type === "add" ? <Plus size={14} /> :
                   item.type === "publish" ? <Eye size={14} /> :
                   item.type === "message" ? <MessageSquare size={14} /> :
                   <CheckCircle size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-sm">{item.action}</p>
                  <p className="text-slate-500 text-xs truncate mt-0.5">{item.detail}</p>
                </div>
                <span className="text-slate-600 text-xs flex-shrink-0 flex items-center gap-1">
                  <Clock size={11} /> {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <h2 className="font-serif text-lg text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: "Add Certificate", to: "/admin/certificates/professional", icon: Award, color: "text-amber-400" },
              { label: "Add Project", to: "/admin/projects", icon: FolderOpen, color: "text-pink-400" },
              { label: "Add Research Paper", to: "/admin/research/papers", icon: FileText, color: "text-indigo-400" },
              { label: "Add eBook", to: "/admin/ebooks", icon: BookOpen, color: "text-orange-400" },
              { label: "View Messages", to: "/admin/messages", icon: MessageSquare, color: "text-rose-400" },
              { label: "Edit Resume", to: "/admin/resume/professional", icon: TrendingUp, color: "text-cyan-400" },
            ].map(({ label, to, icon: Icon, color }) => (
              <Link
                key={to}
                href={to}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-sm transition-all"
              >
                <Icon size={15} className={color} />
                {label}
                <ArrowUpRight size={13} className="ml-auto text-slate-600" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
