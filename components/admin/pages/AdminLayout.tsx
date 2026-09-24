"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Globe, User, Award, FolderOpen, FileText,
  Settings, Menu, ChevronDown, ChevronRight,
  Library, Image,
  Search, Bell, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  icon: React.ElementType;
  to?: string;
  children?: { label: string; to: string }[];
};

const nav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  {
    label: "Website",
    icon: Globe,
    children: [
      { label: "Home", to: "/admin/website/home" },
      { label: "About", to: "/admin/website/about" },
      { label: "Navigation", to: "/admin/website/navigation" },
      { label: "Footer", to: "/admin/website/footer" },
      { label: "Colours", to: "/admin/website/colours" },
    ] },
  {
    label: "Profile",
    icon: User,
    children: [
      { label: "Personal Info", to: "/admin/profile" },
      { label: "Experience", to: "/admin/experience" },
      { label: "Education", to: "/admin/education" },
      { label: "Skills", to: "/admin/skills" },
      { label: "Achievements", to: "/admin/achievements" },
    ] },
  { label: "Certificates", icon: Award, to: "/admin/certificates" },
  {
    label: "Portfolio",
    icon: FolderOpen,
    children: [
      { label: "Projects", to: "/admin/projects" },
      { label: "Gallery", to: "/admin/portfolio/gallery" },
      { label: "Categories", to: "/admin/portfolio/categories" },
    ] },
  {
    label: "Research & Publications",
    icon: Search,
    children: [
      { label: "Research Profile", to: "/admin/research/profile" },
      { label: "Research Papers", to: "/admin/research/papers" },
      { label: "Upcoming Topics", to: "/admin/research/upcoming" },
      { label: "Research Interests", to: "/admin/research/interests" },
    ] },
  { label: "eBooks", icon: Library, to: "/admin/ebooks" },
  {
    label: "Resume",
    icon: FileText,
    children: [
      { label: "Professional", to: "/admin/resume/professional" },
      { label: "Infographic", to: "/admin/resume/infographic" },
    ] },
  { label: "Media Library", icon: Image, to: "/admin/media" },
  { label: "Settings", icon: Settings, to: "/admin/settings" },
];

function NavGroup({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isChildActive = item.children?.some((c) => pathname === c.to);
  const [open, setOpen] = useState(isChildActive || false);

  if (item.to) {
    const active = pathname === item.to;
    return (
      <Link
        href={item.to}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
          active ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
        }`}
      >
        <item.icon size={16} className="flex-shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  }

  return (
    <div>
      <Button variant="unstyled"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
          isChildActive ? "text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
        }`}
      >
        <item.icon size={16} className="flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </>
        )}
      </Button>
      {open && !collapsed && (
        <div className="ml-8 mt-1 space-y-1">
          {item.children?.map((child) => {
            const active = pathname === child.to;
            return (
              <Link
                key={child.to}
                href={child.to}
                className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                  active ? "text-blue-400 bg-blue-950/50" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-60" : "w-16"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-800 gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-serif text-white text-sm font-medium truncate">CMS Dashboard</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {nav.map((item) => (
            <NavGroup key={item.label} item={item} collapsed={!sidebarOpen} />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 px-2 py-3">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <Globe size={16} />
            {sidebarOpen && <span>View Website</span>}
          </Link>
          <Button variant="unstyled" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all">
            <LogOut size={16} />
            {sidebarOpen && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
          <Button variant="unstyled"
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Menu size={18} />
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="unstyled" className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              <Bell size={18} />
            </Button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
