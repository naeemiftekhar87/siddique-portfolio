"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { enrollAuthenticator, confirmAuthenticator, disableAuthenticator } from "@/lib/auth/mfa-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthenticatorSettings({ enabled: initialEnabled }: { enabled: boolean }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [setup, setSetup] = useState<{ id: string; qrCode: string; secret: string } | null>(null);
  const [removing, setRemoving] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();

  function run(operation: "enroll" | "confirm" | "disable") {
    setError(""); setNotice("");
    startTransition(async () => {
      try {
        if (operation === "enroll") {
          const result = await enrollAuthenticator();
          if (!result.ok) { setError(result.error); return; }
          setSetup(result.data); setCode(""); return;
        }
        const result = operation === "confirm" && setup
          ? await confirmAuthenticator({ id: setup.id, code })
          : await disableAuthenticator({ code, confirm: removing });
        if (!result.ok) { setError(result.error); return; }
        setSetup(null); setCode(""); setRemoving(false);
        if (operation === "disable") { router.replace("/admin/login"); router.refresh(); return; }
        setEnabled(true); setNotice("Authenticator enabled. Future sign-ins and password resets require its code."); router.refresh();
      } catch { setError("Could not reach the server. Please try again."); }
    });
  }

  return <Card variant="admin-panel" className="p-6 space-y-4">
    <h2 className="font-serif text-lg text-white flex items-center gap-2"><ShieldCheck size={18} className="text-teal-400" /> Google Authenticator</h2>
    <p className="text-slate-400 text-sm">{enabled ? "Two-step verification is enabled." : "Protect your admin account with a password and a code from Google Authenticator."}</p>
    <p className="text-slate-400 text-xs">Keep access to your authenticator or its secure backup. If your phone is lost, account recovery requires the project owner to reset the factor in Supabase; a password reset does not remove it.</p>
    {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
    {notice && <p role="status" className="text-green-400 text-sm">{notice}</p>}
    {setup && <div className="space-y-4">
      <p className="text-slate-300 text-sm">In Google Authenticator, tap +, then scan this QR code or enter the setup key. Keep the key private.</p>
      <Image unoptimized src={setup.qrCode} width={200} height={200} alt="Scan this private QR code with Google Authenticator" className="rounded-xl bg-white p-2" />
      <div><Label variant="admin-label" htmlFor="totp-secret" className="mb-2">Setup key</Label><Input id="totp-secret" variant="admin-field" readOnly value={setup.secret} className="w-full font-mono" /></div>
    </div>}
    {(setup || removing) && <form onSubmit={(e) => { e.preventDefault(); run(setup ? "confirm" : "disable"); }} className="space-y-4">
      {removing && <p className="text-amber-400 text-sm">Remove two-step verification? Confirm with a fresh authenticator code. You will be signed out.</p>}
      <div><Label variant="admin-label" htmlFor="totp-code" className="mb-2">Authenticator code</Label><Input variant="admin-field" id="totp-code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" placeholder="6-digit code" required className="w-full" /></div>
      <div className="flex flex-wrap gap-3"><Button variant="admin-primary" type="submit" disabled={pending} className="px-4 py-2.5 disabled:opacity-50">{pending ? "Verifying…" : setup ? "Verify and enable" : "Confirm removal"}</Button><Button variant="admin-secondary" type="button" disabled={pending} className="px-4 py-2.5 disabled:opacity-50" onClick={() => { setSetup(null); setRemoving(false); setCode(""); setError(""); }}>Cancel</Button></div>
    </form>}
    {!setup && !removing && <Button variant="admin-secondary" disabled={pending} className="px-4 py-2.5 disabled:opacity-50" onClick={() => enabled ? setRemoving(true) : run("enroll")}>{pending ? "Starting setup…" : enabled ? "Remove authenticator" : "Set up authenticator"}</Button>}
  </Card>;
}
