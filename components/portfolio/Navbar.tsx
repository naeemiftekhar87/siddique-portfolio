"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap, GitFork, Link2 } from "lucide-react";
import { profile } from "@/lib/data";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Certificates", to: "/certificates" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Research", to: "/research" },
  { label: "eBooks", to: "/ebooks" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#040d1f]/95 backdrop-blur-xl shadow-lg border-b border-white/10" : "bg-[#040d1f]/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-serif text-lg font-medium tracking-tight text-white">
              {profile.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
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
            <a
              href={profile.scholar}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white/50 hover:text-cyan-400 transition-colors"
              title="Google Scholar"
            >
              <GraduationCap size={18} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white/50 hover:text-cyan-400 transition-colors"
              title="LinkedIn"
            >
              <Link2 size={18} />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white/50 hover:text-cyan-400 transition-colors"
              title="GitHub"
            >
              <GitFork size={18} />
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#040d1f]/97 backdrop-blur-xl border-t border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
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
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-cyan-400 transition-colors">
                <Link2 size={20} />
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-cyan-400 transition-colors">
                <GitFork size={20} />
              </a>
              <a href={profile.scholar} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-cyan-400 transition-colors">
                <GraduationCap size={20} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
