"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { requestPasswordReset, beginPasswordRecovery, resetPassword } from "@/lib/auth/recovery-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PasswordRecovery({ reset = false }: { reset?: boolean }) {
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({ next: "", confirm: "", code: "" });
  const [verified, setVerified] = useState(false);
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setNotice("");
    startTransition(async () => {
      try {
        if (!reset) {
          const result = await requestPasswordReset(email);
          if (!result.ok) { setError(result.error); return; }
          setNotice(result.data.message); return;
        }
        if (!verified) {
          const token = new URLSearchParams(window.location.hash.slice(1)).get("token_hash") ?? "";
          // Remove the secret before any server request; keep it only for this invocation.
          window.history.replaceState(null, "", window.location.pathname);
          const result = await beginPasswordRecovery(token);
          if (!result.ok) { setError(result.error); return; }
          setVerified(true); setRequiresMfa(result.data.requiresMfa); return;
        }
        const result = await resetPassword(form);
        if (!result.ok) { setError(result.error); return; }
        setForm({ next: "", confirm: "", code: "" }); setComplete(true);
        setNotice("Password reset. Sign in with your new password and authenticator if enabled.");
      } catch { setError("Could not reach the server. Please try again. If your link was already opened, request a new one."); }
    });
  }

  return <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 sm:p-8">
    <div className="w-full max-w-sm space-y-6">
      <div><h1 className="font-serif text-3xl text-white mb-2">{reset ? "Reset password" : "Forgot password?"}</h1><p className="text-slate-400 text-sm">{reset ? verified ? "Choose a new password with at least 12 characters." : "Continue to verify your one-time reset link." : "Enter your admin sign-in email to request a secure reset link."}</p></div>
      {error && <p role="alert" className="text-red-300 bg-red-950/50 border border-red-800/60 rounded-xl p-4 text-sm">{error}</p>}
      {notice && <p role="status" className="text-green-300 bg-green-950/50 border border-green-800/60 rounded-xl p-4 text-sm">{notice}</p>}
      {!complete && <form onSubmit={submit} className="space-y-5">
        {!reset && <div><Label variant="admin-label" htmlFor="recovery-email" className="mb-2">Admin email address</Label><Input variant="admin-field-dark" id="recovery-email" type="email" autoComplete="username" required maxLength={200} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" className="w-full py-3" /></div>}
        {reset && verified && <>
          <div><Label variant="admin-label" htmlFor="reset-password" className="mb-2">New password</Label><Input variant="admin-field-dark" id="reset-password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} placeholder="At least 12 characters" className="w-full py-3" /></div>
          <div><Label variant="admin-label" htmlFor="reset-confirm" className="mb-2">Confirm new password</Label><Input variant="admin-field-dark" id="reset-confirm" type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Type your new password again" className="w-full py-3" /></div>
          {requiresMfa && <div><Label variant="admin-label" htmlFor="reset-code" className="mb-2">Google Authenticator code</Label><Input variant="admin-field-dark" id="reset-code" inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{6}" maxLength={6} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.replace(/\D/g, "") })} placeholder="6-digit code" className="w-full py-3" /></div>}
        </>}
        <Button variant="admin-primary" type="submit" disabled={pending} className="w-full py-3">{pending ? "Please wait…" : !reset ? "Send reset link" : !verified ? "Continue to reset password" : "Reset password"}</Button>
      </form>}
      <div className="flex flex-wrap gap-4 text-sm"><Link href="/admin/login" className="text-blue-400 hover:text-blue-300">Back to sign in</Link>{reset && !complete && <Link href="/admin/forgot-password" className="text-slate-400 hover:text-slate-300">Request a new link</Link>}</div>
    </div>
  </div>;
}
