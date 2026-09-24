"use client";

import { useState } from "react";
import { Save, Plus, X, Tag } from "lucide-react";
import { saveSettings } from "@/lib/actions/settings";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminResearchInterests({ initial }: { initial: string[] }) {
  const [interests, setInterests] = useState<string[]>(initial);
  const [newInterest, setNewInterest] = useState("");
  const [saved, setSaved] = useState(false);
  const { pending, run } = useAction();

  const add = () => {
    const trimmed = newInterest.trim();
    if (!trimmed || interests.includes(trimmed)) return;
    setInterests(prev => [...prev, trimmed]);
    setNewInterest("");
  };

  const remove = (interest: string) => setInterests(prev => prev.filter(i => i !== interest));

  const handleSave = () => {
    run(() => saveSettings("research_interests", { items: interests }), {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); add(); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white mb-1">Research Interests</h1>
        <p className="text-slate-400 text-sm">
          Manage the research interest tags displayed on the Research page and About page
        </p>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-950/40 border border-green-800/50 rounded-xl text-green-400 text-sm">
          Research interests saved successfully.
        </div>
      )}

      {/* Add new */}
      <Card variant="admin-panel" className="p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <Tag size={16} className="text-blue-400" /> Add Interest
        </h2>
        <div className="flex gap-3">
          <Input variant="admin-field"
            value={newInterest}
            onChange={e => setNewInterest(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Research Interest"
            aria-label="New research interest"
            className="flex-1"
          />
          <Button variant="admin-primary"
            onClick={add}
            className="flex items-center gap-2 px-4 py-2.5"
          >
            <Plus size={14} /> Add
          </Button>
        </div>
        <p className="text-slate-600 text-xs">Press Enter or click Add. Duplicates are ignored.</p>
      </Card>

      {/* Current interests */}
      <Card variant="admin-panel" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg text-white">Current Interests</h2>
          <span className="text-slate-500 text-xs font-mono">{interests.length} items</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {interests.map(interest => (
            <div
              key={interest}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl group hover:border-slate-600 transition-all"
            >
              <span className="text-slate-300 text-sm">{interest}</span>
              <Button variant="unstyled"
                onClick={() => remove(interest)}
                className="text-slate-600 hover:text-red-400 transition-colors"
                title="Remove"
                aria-label={`Remove ${interest}`}
              >
                <X size={13} />
              </Button>
            </div>
          ))}
        </div>

        {interests.length === 0 && (
          <p className="text-slate-600 text-sm text-center py-6">No interests added yet.</p>
        )}
      </Card>

      {/* Preview */}
      <Card variant="admin-panel" className="p-6 space-y-3">
        <h2 className="font-serif text-lg text-white">Preview (as shown on site)</h2>
        <div className="flex flex-wrap gap-2">
          {interests.map(interest => (
            <span
              key={interest}
              className="px-3 py-1.5 bg-white text-blue-700 text-xs rounded-xl border border-blue-100 font-medium"
            >
              {interest}
            </span>
          ))}
        </div>
      </Card>

      <p className="text-slate-500 text-xs">These interests are also the Research Area options for papers and upcoming topics.</p>

      <Button variant="unstyled"
        onClick={handleSave}
        disabled={pending}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all disabled:opacity-50 ${
          saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        <Save size={15} /> {pending ? "Saving…" : saved ? "Saved!" : "Save Interests"}
      </Button>
    </div>
  );
}
