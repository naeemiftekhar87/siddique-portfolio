"use client";

import { useState } from "react";
import { Save, GraduationCap, BarChart2, RefreshCw } from "lucide-react";
import { emptyProfile as profile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SharedFieldsNote } from "@/components/admin/shared-fields-note";

export default function AdminResearchProfile() {
  const [metrics, setMetrics] = useState({ ...profile.scholarMetrics });
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white mb-1">Research Profile</h1>
        <p className="text-slate-400 text-sm">Manage your scholar metrics and research bio</p>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Research profile saved successfully.
        </div>
      )}

      {/* Scholar Metrics */}
      <Card variant="admin-panel" className="p-6 space-y-5">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <BarChart2 size={17} className="text-blue-400" /> Google Scholar Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: "citations",    label: "Citations" },
            { key: "hIndex",       label: "h-Index" },
            { key: "i10Index",     label: "i10-Index" },
            { key: "publications", label: "Publications" },
          ].map(({ key, label }) => (
            <div key={key}>
              <Label variant="admin-label" className="mb-1.5">{label}</Label>
              <Input variant="admin-field"
                type="number"
                value={metrics[key as keyof typeof metrics]}
                onChange={e => setMetrics({ ...metrics, [key]: Number(e.target.value) })}
                className="w-full font-mono text-center"
              />
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-xs flex items-center gap-1.5">
          <RefreshCw size={11} /> These values appear in the Research page hero and ResearchDetail pages.
        </p>
      </Card>

      {/* Academic Bio */}
      <Card variant="admin-panel" className="p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <GraduationCap size={17} className="text-violet-400" /> Research Bio
        </h2>
        <div>
          <Label variant="admin-label" className="mb-1.5">Short Bio (shown on Research page)</Label>
          <Textarea variant="admin-field"
            rows={4}
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full resize-none leading-relaxed"
          />
          <p className="text-slate-600 text-xs mt-1 text-right font-mono">{bio.length} chars</p>
        </div>
      </Card>

      <SharedFieldsNote fields="Google Scholar, ORCID, and ResearchGate links" href="/admin/settings" screen="Settings" />

      <Button variant="unstyled"
        onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${
          saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        <Save size={15} /> {saved ? "Saved!" : "Save Research Profile"}
      </Button>
    </div>
  );
}
