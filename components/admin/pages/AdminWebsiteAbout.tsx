"use client";

import { useState } from "react";
import { Save, User } from "lucide-react";
import { emptyProfile as profile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageSourceField } from "@/components/admin/image-source-field";

export default function AdminWebsiteAbout() {
  const [form, setForm] = useState({
    name: profile.name,
    headline: profile.headline,
    location: profile.location,
    email: profile.email,
    summary: profile.summary,
    careerFocus: "",
    academicBio: "",
    profileImage: "",
    domainExpertise: "",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass = "w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white mb-1 flex items-center gap-2">
          <User size={22} className="text-blue-400" /> About Page
        </h1>
        <p className="text-slate-400 text-sm">Edit the content displayed on the About page</p>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          About page content saved.
        </div>
      )}

      {/* Identity */}
      <Card variant="admin-panel" className="p-6 space-y-4">
        <h2 className="font-serif text-lg text-white">Identity & Contact</h2>
        <div className="flex items-center gap-5 mb-2">
          {form.profileImage ? (
          <img src={form.profileImage} alt="Profile" className="w-16 h-16 rounded-2xl object-cover border border-slate-700 flex-shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-2xl border border-slate-700 bg-slate-800 flex items-center justify-center flex-shrink-0"><User size={20} className="text-slate-600" /></div>
        )}
          <div className="flex-1">
            <Label variant="admin-label" className="mb-1.5">Profile Photo</Label>
            <ImageSourceField value={form.profileImage} onChange={(v) => setForm({ ...form, profileImage: v })} />
          </div>
        </div>
        {[
          { key: "name",     label: "Full Name" },
          { key: "headline", label: "Professional Headline" },
          { key: "location", label: "Location" },
          { key: "email",    label: "Email" },
        ].map(({ key, label }) => (
          <div key={key}>
            <Label variant="admin-label" className="mb-1.5">{label}</Label>
            <Input variant="unstyled" value={form[key as keyof typeof form]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className={inputClass} />
          </div>
        ))}
      </Card>

      {/* Bio sections */}
      <Card variant="admin-panel" className="p-6 space-y-4">
        <h2 className="font-serif text-lg text-white">Bio Sections</h2>
        {[
          { key: "summary",      label: "Professional Summary", rows: 4 },
          { key: "careerFocus",  label: "Career Focus",         rows: 4 },
          { key: "academicBio",  label: "Academic Journey Bio",  rows: 4 },
        ].map(({ key, label, rows }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <Label variant="unstyled" className="text-xs text-slate-400">{label}</Label>
              <span className="text-xs font-mono text-slate-600">{(form[key as keyof typeof form] as string).length}</span>
            </div>
            <Textarea variant="unstyled" rows={rows} value={form[key as keyof typeof form] as string}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className={`${inputClass} resize-none leading-relaxed`} />
          </div>
        ))}
      </Card>

      {/* Domain expertise */}
      <Card variant="admin-panel" className="p-6 space-y-3">
        <h2 className="font-serif text-lg text-white">Domain Expertise</h2>
        <p className="text-slate-500 text-xs">Comma-separated list shown in the sidebar dark card</p>
        <Textarea variant="unstyled" rows={3} value={form.domainExpertise}
          onChange={e => setForm({ ...form, domainExpertise: e.target.value })}
          className={`${inputClass} resize-none`} />
        <div className="flex flex-wrap gap-2 pt-1">
          {form.domainExpertise.split(",").map(d => d.trim()).filter(Boolean).map(d => (
            <span key={d} className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg border border-slate-700">{d}</span>
          ))}
        </div>
      </Card>

      <Button variant="unstyled" onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
        <Save size={15} /> {saved ? "Saved!" : "Save About Page"}
      </Button>
    </div>
  );
}
