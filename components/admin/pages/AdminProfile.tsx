"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Save, User, MapPin, Plus } from "lucide-react";
import type { Language, ProfileSettings } from "@/lib/data";
import { saveSettings } from "@/lib/actions/settings";
import { LanguagesCard } from "@/components/admin/languages-card";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageSourceField } from "@/components/admin/image-source-field";

export default function AdminProfile({ initial, languages }: { initial: ProfileSettings; languages: Language[] }) {
  const uid = useId();
  const [p, setP] = useState<ProfileSettings>(initial);
  const [showPhoto, setShowPhoto] = useState(false);
  const [saved, setSaved] = useState(false);
  const { pending, run } = useAction();

  const set = (k: string, v: unknown) => setP((prev) => ({ ...prev, [k]: v }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveSettings("profile", p), {
      onSuccess: (value) => {
        setP(value);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-white mb-1">Personal Information</h1>
        <p className="text-slate-400 text-sm">
          Your name, photo, headline, and contact details, used across the whole site. Research interests and
          Scholar metrics are under <Link href="/admin/research/interests" className="text-blue-400 hover:underline">Research Interests</Link> and{" "}
          <Link href="/admin/research/profile" className="text-blue-400 hover:underline">Research Profile</Link>; social links are in{" "}
          <Link href="/admin/settings" className="text-blue-400 hover:underline">Settings</Link>.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile photo */}
        <Card variant="admin-panel" className="p-6">
          <h2 className="font-serif text-lg text-white mb-5 flex items-center gap-2">
            <User size={18} className="text-blue-400" /> Profile
          </h2>
          <div className="flex items-start gap-6">
            <div className="relative flex-shrink-0">
              {p.photo ? (
                <img loading="lazy" decoding="async" src={p.photo} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border border-slate-700" />
              ) : (
                <div className="w-24 h-24 rounded-2xl border border-slate-700 bg-slate-800 flex items-center justify-center flex-shrink-0"><User size={20} className="text-slate-600" /></div>
              )}
              <Button variant="unstyled"
                type="button"
                onClick={() => setShowPhoto((v) => !v)}
                aria-label={showPhoto ? "Hide photo options" : "Change photo"}
                aria-expanded={showPhoto}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Plus size={14} />
              </Button>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <Label htmlFor={`${uid}-full-name`} variant="admin-label" className="mb-1">Full Name</Label>
                <Input id={`${uid}-full-name`} variant="admin-field" value={p.name} onChange={(e) => set("name", e.target.value)}
                  className="w-full" />
              </div>
              <div>
                <Label htmlFor={`${uid}-badge-label`} variant="admin-label" className="mb-1">Badge Label</Label>
                <Input id={`${uid}-badge-label`} variant="admin-field" value={p.badge} onChange={(e) => set("badge", e.target.value)}
                  className="w-full font-mono" />
              </div>
            </div>
          </div>
          {showPhoto && (
            <div className="mt-5">
              <Label variant="admin-label" className="mb-1.5">Profile Photo</Label>
              <ImageSourceField value={p.photo} onChange={(v) => set("photo", v)} />
            </div>
          )}
        </Card>

        {/* Professional identity */}
        <Card variant="admin-panel" className="p-6">
          <h2 className="font-serif text-lg text-white mb-5">Professional Identity</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor={`${uid}-headline`} variant="admin-label" className="mb-1">Headline</Label>
              <Input id={`${uid}-headline`} variant="admin-field" value={p.headline} onChange={(e) => set("headline", e.target.value)}
                className="w-full" />
            </div>
            <div>
              <Label htmlFor={`${uid}-professional-summary`} variant="admin-label" className="mb-1">Professional Summary</Label>
              <Textarea id={`${uid}-professional-summary`} variant="admin-field"
                rows={5}
                value={p.summary}
                onChange={(e) => set("summary", e.target.value)}
                className="w-full resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Contact */}
        <Card variant="admin-panel" className="p-6">
          <h2 className="font-serif text-lg text-white mb-5 flex items-center gap-2">
            <MapPin size={18} className="text-teal-400" /> Location & Contact
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${uid}-location`} variant="admin-label" className="mb-1">Location</Label>
              <Input id={`${uid}-location`} variant="admin-field" value={p.location} onChange={(e) => set("location", e.target.value)}
                className="w-full" />
            </div>
            <div>
              <Label htmlFor={`${uid}-email`} variant="admin-label" className="mb-1">Email</Label>
              <Input id={`${uid}-email`} variant="admin-field" type="email" value={p.email} onChange={(e) => set("email", e.target.value)}
                className="w-full" />
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card variant="admin-panel" className="p-6">
          <h2 className="font-serif text-lg text-white mb-5">Hero Statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(Object.entries(p.stats) as [string, string][]).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={`${uid}-${key}`} variant="admin-label" className="mb-1 capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                <Input id={`${uid}-${key}`} variant="admin-field"
                  value={value}
                  onChange={(e) => set("stats", { ...p.stats, [key]: e.target.value })}
                  className="w-full font-mono"
                />
              </div>
            ))}
          </div>
        </Card>

        <Button variant="unstyled"
          type="submit"
          disabled={pending}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all disabled:opacity-50 ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          <Save size={16} /> {pending ? "Saving…" : saved ? "Saved!" : "Save Profile"}
        </Button>
      </form>

      <div className="mt-6">
        <LanguagesCard initial={languages} />
      </div>
    </div>
  );
}
