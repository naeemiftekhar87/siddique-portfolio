"use client";

import { useState } from "react";
import { Save, Globe, Lock, Eye, EyeOff, Link2, GitFork, GraduationCap } from "lucide-react";
import { emptyProfile as profile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettings() {
  // Personal information is edited on the Profile page. Every social and
  // academic link is edited only here (footer, navbar, Research page use them).
  const [profile_, setProfile] = useState({
    linkedin: profile.linkedin,
    github: profile.github,
    scholar: profile.scholar,
    researchgate: profile.researchgate,
    orcid: "",
  });

  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [profileSaved, setProfileSaved] = useState(false);
  const [passSaved, setPassSaved] = useState(false);
  const [passError, setPassError] = useState("");

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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white mb-1">Settings</h1>
        <p className="text-slate-400 text-sm">Manage your links and password</p>
      </div>

      {/* ─── Social Links ─────────────────────────────────────────── */}
      <Card variant="admin-panel" className="p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <Globe size={18} className="text-teal-400" /> Social & Academic Links
        </h2>
        {[
          { key: "linkedin", label: "LinkedIn", Icon: Link2 },
          { key: "github", label: "GitHub", Icon: GitFork },
          { key: "scholar", label: "Google Scholar", Icon: GraduationCap },
          { key: "researchgate", label: "ResearchGate", Icon: GraduationCap },
          { key: "orcid", label: "ORCID", Icon: GraduationCap },
        ].map(({ key, label, Icon }) => (
          <div key={key}>
            <Label variant="unstyled" className="block text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Icon size={12} /> {label} URL
            </Label>
            <Input variant="admin-field"
              value={profile_[key as keyof typeof profile_]}
              onChange={(e) => setProfile({ ...profile_, [key]: e.target.value })}
              className="w-full font-mono"
            />
          </div>
        ))}
        <Button variant="unstyled"
          onClick={handleProfileSave}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 border border-slate-700 transition-all"
        >
          <Save size={15} /> {profileSaved ? "Saved!" : "Save Links"}
        </Button>
      </Card>

      {/* ─── Change Password ──────────────────────────────────────── */}
      <form onSubmit={handlePasswordSave} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <Lock size={18} className="text-amber-400" /> Change Password
        </h2>
        {passError && (
          <p className="text-red-400 text-xs bg-red-950/30 border border-red-800/50 rounded-xl px-4 py-2.5">{passError}</p>
        )}
        <div>
          <Label variant="admin-label" className="mb-1.5">Current Password</Label>
          <div className="relative">
            <Input variant="admin-field"
              type={showCurrent ? "text" : "password"}
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
              className="w-full pr-10"
            />
            <Button variant="unstyled" type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label variant="admin-label" className="mb-1.5">New Password</Label>
            <div className="relative">
              <Input variant="admin-field"
                type={showNew ? "text" : "password"}
                value={password.next}
                onChange={(e) => setPassword({ ...password, next: e.target.value })}
                className="w-full pr-10"
              />
              <Button variant="unstyled" type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </Button>
            </div>
          </div>
          <div>
            <Label variant="admin-label" className="mb-1.5">Confirm New Password</Label>
            <Input variant="admin-field"
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
              className="w-full"
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
        <Button variant="unstyled"
          type="submit"
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${passSaved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          <Lock size={15} /> {passSaved ? "Password Updated!" : "Update Password"}
        </Button>
      </form>

    </div>
  );
}
