"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Globe, User, Award, FolderOpen, FileText,
  Settings, Menu, ChevronDown, ChevronRight,
  Library, Image,
  Search, LogOut, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { logout } from "@/lib/auth/actions";

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

/** Label of the page being edited, shown in the mobile top bar. */
function currentLabel(pathname: string) {
  for (const item of nav) {
    if (item.to === pathname) return item.label;
    const child = item.children?.find((c) => c.to === pathname);
    if (child) return child.label;
  }
  return "CMS Dashboard";
}

/**
 * One sidebar entry.
 * - Expanded (desktop sidebar or the mobile drawer): links, and groups that
 *   open in place to show their pages.
 * - Collapsed icon rail (desktop): links get a hover label, and a group icon
 *   opens a flyout menu with its pages (the icon alone has no room to expand).
 */
function NavGroup({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const isChildActive = item.children?.some((c) => pathname === c.to);
  const [open, setOpen] = useState(isChildActive || false);

  if (item.to) {
    const active = pathname === item.to;
    const link = (
      <Link
        href={item.to}
        onClick={onNavigate}
        aria-label={collapsed ? item.label : undefined}
        aria-current={active ? "page" : undefined}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
          active ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
        }`}
      >
        <item.icon size={16} className="flex-shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
    if (!collapsed) return link;
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="unstyled"
            aria-label={`${item.label} pages`}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500 data-[state=open]:bg-slate-800 data-[state=open]:text-white ${
              isChildActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <item.icon size={16} className="flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={12}
          className="w-52 bg-slate-900 text-slate-300 border border-slate-800 ring-0 rounded-xl p-1.5 shadow-xl shadow-black/40">
          <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {item.label}
          </DropdownMenuLabel>
          {item.children?.map((child) => {
            const active = pathname === child.to;
            return (
              <DropdownMenuItem key={child.to} asChild
                className={`px-2.5 py-2 rounded-lg text-sm cursor-pointer ${
                  active ? "text-blue-400 bg-blue-950/50 focus:bg-blue-950/70 focus:text-blue-300" : "text-slate-400 focus:bg-slate-800 focus:text-white"
                }`}>
                <Link href={child.to} aria-current={active ? "page" : undefined}>{child.label}</Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div>
      <Button variant="unstyled"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
          isChildActive ? "text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
        }`}
      >
        <item.icon size={16} className="flex-shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </Button>
      {open && (
        <div className="ml-8 mt-1 space-y-1">
          {item.children?.map((child) => {
            const active = pathname === child.to;
            return (
              <Link
                key={child.to}
                href={child.to}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
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

/** Logo, navigation and footer links; shared by the desktop sidebar and the mobile drawer. */
function SidebarBody({ collapsed, onNavigate, headerAction }: { collapsed: boolean; onNavigate?: () => void; headerAction?: React.ReactNode }) {
  return (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800 gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <LayoutDashboard size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="flex-1 font-serif text-white text-sm font-medium truncate">CMS Dashboard</span>
        )}
        {headerAction}
      </div>

      {/* Nav */}
      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {nav.map((item) => (
          <NavGroup key={item.label} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 px-2 py-3">
        <Link href="/" onClick={onNavigate} aria-label={collapsed ? "View Website" : undefined} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <Globe size={16} />
          {!collapsed && <span>View Website</span>}
        </Link>
        <form action={logout}>
          <Button variant="unstyled" type="submit" aria-label={collapsed ? "Sign Out" : undefined} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all">
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </form>
      </div>
    </>
  );
}

export default function AdminLayout({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  // Desktop: full sidebar or icon rail. Phones: the sidebar is replaced by a drawer.
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="flex h-dvh bg-slate-950 overflow-hidden">
      {/* Sidebar (tablet and desktop) */}
      <aside
        className={`hidden md:flex flex-shrink-0 bg-slate-900 border-r border-slate-800 flex-col transition-all duration-300 ${
          sidebarOpen ? "w-60" : "w-16"
        }`}
      >
        <SidebarBody collapsed={!sidebarOpen} />
      </aside>

      {/* Drawer (phones). Closes on navigation, backdrop tap or Escape. */}
      <Sheet open={drawerOpen && isMobile} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" showCloseButton={false} overlayClassName="bg-black/60"
          className="w-72 max-w-[85vw] gap-0 p-0 bg-slate-900 text-slate-200 border-r border-slate-800">
          <SheetTitle className="sr-only">Admin menu</SheetTitle>
          <SheetDescription className="sr-only">Pages you can edit</SheetDescription>
          <SidebarBody collapsed={false} onNavigate={closeDrawer} headerAction={
            <Button variant="unstyled" onClick={closeDrawer} aria-label="Close menu"
              className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              <X size={18} />
            </Button>
          } />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Button variant="unstyled"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <Menu size={20} />
            </Button>
            <Button variant="unstyled"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((v) => !v)}
              className="hidden md:inline-flex p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <Menu size={18} />
            </Button>
            <span className="md:hidden text-white text-sm font-medium truncate">{currentLabel(pathname)}</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div title={email} className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium uppercase">
              {email.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-950 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
