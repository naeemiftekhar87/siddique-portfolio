"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap, GitFork, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavbarProps = {
  name: string;
  /** Visible links, in order, from Website → Navigation. */
  navLinks: { label: string; to: string }[];
  /** Social links from Settings; empty ones are hidden. */
  social: { scholar: string; linkedin: string; github: string };
};

const isExternal = (to: string) => /^https?:\/\//i.test(to);

export default function Navbar({ name, navLinks, social }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation (adjust state during render rather
  // than in an effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  const socialLinks = [
    { href: social.scholar, title: "Google Scholar", Icon: GraduationCap },
    { href: social.linkedin, title: "LinkedIn", Icon: Link2 },
    { href: social.github, title: "GitHub", Icon: GitFork },
  ].filter((s) => s.href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 print:hidden ${
        scrolled ? "bg-(color:--site-navbar)/95 backdrop-blur-xl shadow-lg border-b border-white/10" : "bg-(color:--site-navbar)/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-serif text-lg font-medium tracking-tight text-white">
              {name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                {...(isExternal(link.to) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-current={isActive(link.to) ? "page" : undefined}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all ${
                  isActive(link.to)
                    ? "text-white bg-white/15 border border-white/20"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side — social icons only */}
          <div className="hidden lg:flex items-center gap-1">
            {socialLinks.map(({ href, title, Icon }) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/50 hover:text-cyan-400 transition-colors"
                title={title}
                aria-label={title}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          {/* Mobile toggle */}
          <Button variant="unstyled"
            className="lg:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-(color:--site-navbar)/97 backdrop-blur-xl border-t border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                {...(isExternal(link.to) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-current={isActive(link.to) ? "page" : undefined}
                className={`px-4 py-2.5 text-sm rounded-lg font-medium transition-all ${
                  isActive(link.to)
                    ? "text-white bg-white/15 border border-white/20"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10 px-4">
              {socialLinks.map(({ href, title, Icon }) => (
                <a key={title} href={href} target="_blank" rel="noopener noreferrer" aria-label={title} className="text-white/50 hover:text-cyan-400 transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
