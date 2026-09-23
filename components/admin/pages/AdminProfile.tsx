"use client";

import { useState } from "react";
import { Save, User, MapPin, Tag, Plus, X } from "lucide-react";
import { emptyProfile as initialProfile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageSourceField } from "@/components/admin/image-source-field";

export default function AdminProfile() {
  const [p, setP] = useState({ ...initialProfile });
  const [newInterest, setNewInterest] = useState("");
  const [showPhoto, setShowPhoto] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: string, v: unknown) => setP((prev) => ({ ...prev, [k]: v }));

  const addInterest = () => {
    if (newInterest.trim() && !p.researchInterests.includes(newInterest.trim())) {
      set("researchInterests", [...p.researchInterests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    set("researchInterests", p.researchInterests.filter((r) => r !== interest));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-white mb-1">Personal Information</h1>
        <p className="text-slate-400 text-sm">Manage your public profile content</p>
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
                <img src={p.photo} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border border-slate-700" />
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
                <Label variant="admin-label" className="mb-1">Full Name</Label>
                <Input variant="admin-field" value={p.name} onChange={(e) => set("name", e.target.value)}
                  className="w-full" />
              </div>
              <div>
                <Label variant="admin-label" className="mb-1">Badge Label</Label>
                <Input variant="admin-field" value={p.badge} onChange={(e) => set("badge", e.target.value)}
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
              <Label variant="admin-label" className="mb-1">Headline</Label>
              <Input variant="admin-field" value={p.headline} onChange={(e) => set("headline", e.target.value)}
                className="w-full" />
            </div>
            <div>
              <Label variant="admin-label" className="mb-1">Professional Summary</Label>
              <Textarea variant="admin-field"
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
              <Label variant="admin-label" className="mb-1">Location</Label>
              <Input variant="admin-field" value={p.location} onChange={(e) => set("location", e.target.value)}
                className="w-full" />
            </div>
            <div>
              <Label variant="admin-label" className="mb-1">Email</Label>
              <Input variant="admin-field" type="email" value={p.email} onChange={(e) => set("email", e.target.value)}
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
                <Label variant="admin-label" className="mb-1 capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                <Input variant="admin-field"
                  value={value}
                  onChange={(e) => set("stats", { ...p.stats, [key]: e.target.value })}
                  className="w-full font-mono"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Research interests */}
        <Card variant="admin-panel" className="p-6">
          <h2 className="font-serif text-lg text-white mb-5 flex items-center gap-2">
            <Tag size={18} className="text-violet-400" /> Research Interests
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {p.researchInterests.map((interest) => (
              <span
                key={interest}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-700 group"
              >
                {interest}
                <Button variant="unstyled"
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="text-slate-600 hover:text-red-400 transition-colors"
                >
                  <X size={11} />
                </Button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input variant="admin-field"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInterest(); } }}
              placeholder="Add research interest..."
              className="flex-1"
            />
            <Button variant="unstyled"
              type="button"
              onClick={addInterest}
              className="px-4 py-2.5 bg-slate-700 text-slate-200 text-sm rounded-xl hover:bg-slate-600 transition-colors"
            >
              <Plus size={16} />
            </Button>
          </div>
        </Card>

        {/* Scholar metrics */}
        <Card variant="admin-panel" className="p-6">
          <h2 className="font-serif text-lg text-white mb-5">Google Scholar Metrics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(Object.entries(p.scholarMetrics) as [string, number][]).map(([key, value]) => (
              <div key={key}>
                <Label variant="admin-label" className="mb-1 capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                <Input variant="admin-field"
                  type="number"
                  value={value}
                  onChange={(e) => set("scholarMetrics", { ...p.scholarMetrics, [key]: Number(e.target.value) })}
                  className="w-full font-mono"
                />
              </div>
            ))}
          </div>
        </Card>

        <Button variant="unstyled"
          type="submit"
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          <Save size={16} /> {saved ? "Saved!" : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
