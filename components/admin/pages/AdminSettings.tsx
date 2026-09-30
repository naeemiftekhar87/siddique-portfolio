"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Globe, Lock, Eye, EyeOff, Link2, GitFork, GraduationCap, Mail } from "lucide-react";
import type { LinksSettings } from "@/lib/data";
import { changeEmail, changePassword } from "@/lib/auth/actions";
import { saveSettings } from "@/lib/actions/settings";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UrlInput } from "@/components/admin/url-input";
import { Label } from "@/components/ui/label";

export default function AdminSettings({ initial, email: initialEmail }: { initial: LinksSettings; email: string }) {
  // Personal information is edited on the Profile page. Every social and
  // academic link is edited only here (footer, navbar, Research page use them).
  const [profile_, setProfile] = useState<LinksSettings>(initial);
  const links = useAction();
  const pass = useAction();

  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const uid = useId();
  const router = useRouter();
  const mail = useAction();
  const currentEmail = initialEmail;
  const [emailForm, setEmailForm] = useState({ newEmail: "", confirmEmail: "", password: "" });
  const [showEmailPass, setShowEmailPass] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [profileSaved, setProfileSaved] = useState(false);
  const [passSaved, setPassSaved] = useState(false);
  const [passError, setPassError] = useState("");

  const handleProfileSave = (e: React.SyntheticEvent) => {
    e.preventDefault();
    links.run(() => saveSettings("links", profile_), {
      onSuccess: (value) => {
        setProfile(value);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      },
    });
  };

  const handleEmailSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    const next = emailForm.newEmail.trim().toLowerCase();
    if (!next) { setEmailError("Enter the new email address."); return; }
    if (next !== emailForm.confirmEmail.trim().toLowerCase()) { setEmailError("The email addresses do not match."); return; }
    if (!emailForm.password) { setEmailError("Enter your current password."); return; }
    mail.run(async () => {
      const result = await changeEmail(emailForm);
      if (!result.ok) setEmailError(result.error);
      return result;
    }, {
      // The session was ended; sign in again with the new address.
      onSuccess: ({ email }) => router.replace(`/admin/login?emailChanged=${encodeURIComponent(email)}`),
    });
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    if (!password.current) { setPassError("Enter your current password."); return; }
    if (password.next.length < 12) { setPassError("New password must be at least 12 characters."); return; }
    if (password.next !== password.confirm) { setPassError("Passwords do not match."); return; }
    pass.run(async () => {
      const result = await changePassword(password);
      if (!result.ok) setPassError(result.error);
      return result;
    }, {
      onSuccess: () => {
        setPassSaved(true);
        setPassword({ current: "", next: "", confirm: "" });
        setTimeout(() => setPassSaved(false), 3000);
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white mb-1">Settings</h1>
        <p className="text-slate-400 text-sm">Manage your links, sign-in email and password</p>
      </div>

      {/* ─── Social Links ─────────────────────────────────────────── */}
      <Card variant="admin-panel" className="p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <Globe size={18} className="text-teal-400" /> Social & Academic Links
        </h2>
        {[
          { key: "linkedin", label: "LinkedIn", Icon: Link2, placeholder: "https://www.linkedin.com/in/your-profile" },
          { key: "github", label: "GitHub", Icon: GitFork, placeholder: "https://github.com/your-username" },
          { key: "scholar", label: "Google Scholar", Icon: GraduationCap, placeholder: "https://scholar.google.com/citations?user=…" },
          { key: "researchgate", label: "ResearchGate", Icon: GraduationCap, placeholder: "https://www.researchgate.net/profile/Your-Name" },
          { key: "orcid", label: "ORCID", Icon: GraduationCap, placeholder: "https://orcid.org/0000-0000-0000-0000" },
        ].map(({ key, label, Icon, placeholder }) => (
          <div key={key}>
            <Label variant="unstyled" htmlFor={`link-${key}`} className="block text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Icon size={12} /> {label} URL
            </Label>
            <UrlInput
              id={`link-${key}`}
              placeholder={placeholder}
              value={profile_[key as keyof typeof profile_]}
              onChange={(v) => setProfile((prev) => ({ ...prev, [key]: v }))}
              className="w-full font-mono"
            />
          </div>
        ))}
        <Button variant="unstyled"
          onClick={handleProfileSave}
          disabled={links.pending}
          className="disabled:opacity-50 flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 border border-slate-700 transition-all"
        >
          <Save size={15} /> {links.pending ? "Saving…" : profileSaved ? "Saved!" : "Save Links"}
        </Button>
      </Card>

      {/* ─── Change Sign-in Email ──────────────────────────────────── */}
      <form onSubmit={handleEmailSave} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <Mail size={18} className="text-blue-400" /> Change Sign-in Email
        </h2>
        <p className="text-slate-400 text-sm">
          Current sign-in email: <span className="text-slate-200 font-mono">{currentEmail}</span>
        </p>
        {emailError && (
          <p role="alert" className="text-red-400 text-xs bg-red-950/30 border border-red-800/50 rounded-xl px-4 py-2.5">{emailError}</p>
        )}
        <p className="text-slate-500 text-xs">After the change you&apos;ll be signed out and can sign in with the new email.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label variant="admin-label" htmlFor={`${uid}-new-email`} className="mb-1.5">New Email</Label>
            <Input variant="admin-field" id={`${uid}-new-email`} type="email" autoComplete="email" placeholder="e.g. new-address@example.com"
              value={emailForm.newEmail} onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
              className="w-full" />
          </div>
          <div>
            <Label variant="admin-label" htmlFor={`${uid}-confirm-email`} className="mb-1.5">Confirm New Email</Label>
            <Input variant="admin-field" id={`${uid}-confirm-email`} type="email" autoComplete="off" placeholder="Type the new email again"
              value={emailForm.confirmEmail} onChange={(e) => setEmailForm({ ...emailForm, confirmEmail: e.target.value })}
              className="w-full" />
          </div>
        </div>
        <div>
          <Label variant="admin-label" htmlFor={`${uid}-email-password`} className="mb-1.5">Current Password</Label>
          <div className="relative">
            <Input variant="admin-field" id={`${uid}-email-password`} autoComplete="current-password" placeholder="Your current password"
              type={showEmailPass ? "text" : "password"}
              value={emailForm.password} onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
              className="w-full pr-10" />
            <Button variant="unstyled" type="button" onClick={() => setShowEmailPass((v) => !v)} aria-label={showEmailPass ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showEmailPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </Button>
          </div>
        </div>
        <Button variant="unstyled"
          type="submit"
          disabled={mail.pending}
          className="disabled:opacity-50 flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all bg-blue-600 text-white hover:bg-blue-700"
        >
          <Mail size={15} /> {mail.pending ? "Updating…" : "Update Email"}
        </Button>
      </form>

      {/* ─── Change Password ──────────────────────────────────────── */}
      <form onSubmit={handlePasswordSave} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <Lock size={18} className="text-amber-400" /> Change Password
        </h2>
        {passError && (
          <p role="alert" className="text-red-400 text-xs bg-red-950/30 border border-red-800/50 rounded-xl px-4 py-2.5">{passError}</p>
        )}
        <div>
          <Label variant="admin-label" htmlFor="pw-current" className="mb-1.5">Current Password</Label>
          <div className="relative">
            <Input variant="admin-field"
              type={showCurrent ? "text" : "password"}
              id="pw-current"
              placeholder="Your current password"
              autoComplete="current-password"
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
              className="w-full pr-10"
            />
            <Button variant="unstyled" type="button" onClick={() => setShowCurrent((v) => !v)} aria-label={showCurrent ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label variant="admin-label" htmlFor="pw-new" className="mb-1.5">New Password</Label>
            <div className="relative">
              <Input variant="admin-field"
                type={showNew ? "text" : "password"}
                id="pw-new"
                placeholder="At least 12 characters"
              autoComplete="new-password"
              value={password.next}
                onChange={(e) => setPassword({ ...password, next: e.target.value })}
                className="w-full pr-10"
              />
              <Button variant="unstyled" type="button" onClick={() => setShowNew((v) => !v)} aria-label={showNew ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </Button>
            </div>
          </div>
          <div>
            <Label variant="admin-label" htmlFor="pw-confirm" className="mb-1.5">Confirm New Password</Label>
            <Input variant="admin-field"
              type="password"
              id="pw-confirm"
              placeholder="Type the new password again"
              autoComplete="new-password"
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
          disabled={pass.pending}
          className={`disabled:opacity-50 flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${passSaved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          <Lock size={15} /> {pass.pending ? "Updating…" : passSaved ? "Password Updated!" : "Update Password"}
        </Button>
      </form>

    </div>
  );
}
