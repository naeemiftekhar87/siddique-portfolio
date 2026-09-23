"use client";

import { useState } from "react";
import { Save, User, Globe, Bell, Lock, Trash2, Eye, EyeOff, ToggleLeft, ToggleRight, Link2, GitFork, GraduationCap, AlertTriangle } from "lucide-react";
import { profile } from "@/lib/data";

export default function AdminSettings() {
  const [profile_, setProfile] = useState({
    name: profile.name,
    headline: profile.headline,
    email: profile.email,
    location: profile.location,
    linkedin: profile.linkedin,
    github: profile.github,
    scholar: profile.scholar,
  });

  const [notifications, setNotifications] = useState({
    newMessage: true,
    weeklyDigest: true,
    researchAlerts: false,
    securityAlerts: true,
  });

  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [profileSaved, setProfileSaved] = useState(false);
  const [passSaved, setPassSaved] = useState(false);
  const [passError, setPassError] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleProfileSave = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    if (!password.current) { setPassError("Enter your current password."); return; }
    if (password.next.length < 8) { setPassError("New password must be at least 8 characters."); return; }
    if (password.next !== password.confirm) { setPassError("Passwords do not match."); return; }
    setPassSaved(true);
    setPassword({ current: "", next: "", confirm: "" });
    setTimeout(() => setPassSaved(false), 3000);
  };

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white mb-1">Settings</h1>
        <p className="text-slate-400 text-sm">Manage your account and platform configuration</p>
      </div>

      {/* ─── Personal Information ─────────────────────────────────── */}
      <form onSubmit={handleProfileSave} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <User size={18} className="text-blue-400" /> Personal Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            ["name", "Full Name"],
            ["email", "Email Address"],
            ["headline", "Professional Headline"],
            ["location", "Location"],
          ].map(([key, label]) => (
            <div key={key} className={key === "headline" ? "sm:col-span-2" : ""}>
              <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
              <input
                value={profile_[key as keyof typeof profile_]}
                onChange={(e) => setProfile({ ...profile_, [key]: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${profileSaved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          <Save size={15} /> {profileSaved ? "Saved!" : "Save Profile"}
        </button>
      </form>

      {/* ─── Social Links ─────────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <Globe size={18} className="text-teal-400" /> Social & Academic Links
        </h2>
        {[
          { key: "linkedin", label: "LinkedIn", Icon: Link2 },
          { key: "github", label: "GitHub", Icon: GitFork },
          { key: "scholar", label: "Google Scholar", Icon: GraduationCap },
        ].map(({ key, label, Icon }) => (
          <div key={key}>
            <label className="block text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Icon size={12} /> {label} URL
            </label>
            <input
              value={profile_[key as keyof typeof profile_]}
              onChange={(e) => setProfile({ ...profile_, [key]: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        ))}
        <button
          onClick={handleProfileSave}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 border border-slate-700 transition-all"
        >
          <Save size={15} /> Save Links
        </button>
      </div>

      {/* ─── Notifications ────────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <Bell size={18} className="text-violet-400" /> Notification Preferences
        </h2>
        {[
          { key: "newMessage", label: "New Contact Messages", desc: "Email alert when someone submits the contact form" },
          { key: "weeklyDigest", label: "Weekly Analytics Digest", desc: "Summary of visitor stats every Monday" },
          { key: "researchAlerts", label: "Research Citation Alerts", desc: "Notify when a paper is cited or viewed" },
          { key: "securityAlerts", label: "Security Alerts", desc: "Alert on suspicious login attempts" },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
            <div>
              <p className="text-slate-300 text-sm font-medium">{label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleNotif(key as keyof typeof notifications)}
              className="flex-shrink-0 ml-4"
            >
              {notifications[key as keyof typeof notifications]
                ? <ToggleRight size={28} className="text-blue-500" />
                : <ToggleLeft size={28} className="text-slate-600" />}
            </button>
          </div>
        ))}
      </div>

      {/* ─── Change Password ──────────────────────────────────────── */}
      <form onSubmit={handlePasswordSave} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <Lock size={18} className="text-amber-400" /> Change Password
        </h2>
        {passError && (
          <p className="text-red-400 text-xs bg-red-950/30 border border-red-800/50 rounded-xl px-4 py-2.5">{passError}</p>
        )}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
              className="w-full px-3 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
            />
            <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={password.next}
                onChange={(e) => setPassword({ ...password, next: e.target.value })}
                className="w-full px-3 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
              <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        {password.next && (
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className={`flex-1 h-1 rounded-full ${
                password.next.length >= n * 3
                  ? n <= 2 ? "bg-amber-500" : "bg-green-500"
                  : "bg-slate-800"
              }`} />
            ))}
            <span className="text-xs text-slate-500 ml-2 self-center">
              {password.next.length < 6 ? "Weak" : password.next.length < 10 ? "Fair" : "Strong"}
            </span>
          </div>
        )}
        <button
          type="submit"
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${passSaved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          <Lock size={15} /> {passSaved ? "Password Updated!" : "Update Password"}
        </button>
      </form>

      {/* ─── Danger Zone ──────────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl border border-red-900/40 p-6 space-y-4">
        <h2 className="font-serif text-lg text-red-400 flex items-center gap-2">
          <AlertTriangle size={18} /> Danger Zone
        </h2>
        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <div>
            <p className="text-slate-300 text-sm font-medium">Export All Data</p>
            <p className="text-slate-500 text-xs mt-0.5">Download a JSON backup of all your CMS content</p>
          </div>
          <button className="px-4 py-2 text-xs font-medium bg-slate-800 text-slate-300 rounded-xl border border-slate-700 hover:border-slate-600 transition-all">
            Export JSON
          </button>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-red-300 text-sm font-medium">Delete All Content</p>
            <p className="text-slate-500 text-xs mt-0.5">Permanently remove all content. This cannot be undone.</p>
          </div>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 text-xs font-medium bg-red-950/40 text-red-400 rounded-xl border border-red-900/50 hover:bg-red-950/60 transition-all flex items-center gap-1.5"
            >
              <Trash2 size={12} /> Delete
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-2 text-xs bg-slate-800 text-slate-300 rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
              >
                Cancel
              </button>
              <button className="px-3 py-2 text-xs bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all">
                Confirm Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
