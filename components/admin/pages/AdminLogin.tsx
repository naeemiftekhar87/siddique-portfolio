"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, BarChart2, AlertCircle } from "lucide-react";
import { profile } from "@/lib/data";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Demo auth — accept any non-empty credentials
    setTimeout(() => {
      if (form.email && form.password) {
        router.push("/admin");
      } else {
        setError("Please enter your email and password.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:flex-col lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-12 relative overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Blobs */}
        <div className="absolute top-32 left-16 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <BarChart2 size={20} className="text-white" />
            </div>
            <span className="font-serif text-white text-lg">{profile.name}</span>
          </Link>

          <div>
            <h1 className="font-serif text-5xl text-white leading-tight mb-6">
              Content<br />Management<br />System
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Manage your professional profile, research papers, certificates, portfolio, publications, and more — all from one unified dashboard.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-10">
              {[["18+", "Public Pages"], ["6", "CMS Modules"], ["∞", "Content Items"]].map(([v, l]) => (
                <div key={l} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="font-serif text-2xl text-blue-400 mb-1">{v}</div>
                  <div className="text-slate-500 text-xs">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <BarChart2 size={16} className="text-white" />
            </div>
            <span className="font-serif text-white text-base">Admin CMS</span>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-3xl text-white mb-2">Sign in</h2>
            <p className="text-slate-400 text-sm">Access your CMS dashboard</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-950/50 border border-red-800/60 rounded-xl px-4 py-3 mb-6">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-slate-500 text-xs mb-2 font-mono">Demo credentials</p>
            <p className="text-slate-400 text-xs">Email: <span className="text-slate-200">admin@example.com</span></p>
            <p className="text-slate-400 text-xs">Password: <span className="text-slate-200">any value</span></p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
              ← Back to public website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
