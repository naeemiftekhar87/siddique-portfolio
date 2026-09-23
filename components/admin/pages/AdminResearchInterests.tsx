"use client";

import { useState } from "react";
import { Save, Plus, X, GripVertical, Tag } from "lucide-react";
import { emptyProfile as profile } from "@/lib/data";

export default function AdminResearchInterests() {
  const [interests, setInterests] = useState<string[]>([...profile.researchInterests]);
  const [newInterest, setNewInterest] = useState("");
  const [saved, setSaved] = useState(false);

  const add = () => {
    const trimmed = newInterest.trim();
    if (!trimmed || interests.includes(trimmed)) return;
    setInterests(prev => [...prev, trimmed]);
    setNewInterest("");
  };

  const remove = (interest: string) => setInterests(prev => prev.filter(i => i !== interest));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="font-serif text-lg text-white flex items-center gap-2">
          <Tag size={16} className="text-blue-400" /> Add Interest
        </h2>
        <div className="flex gap-3">
          <input
            value={newInterest}
            onChange={e => setNewInterest(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Research Interest"
            className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={add}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <p className="text-slate-600 text-xs">Press Enter or click Add. Duplicates are ignored.</p>
      </div>

      {/* Current interests */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
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
              <GripVertical size={12} className="text-slate-600 cursor-grab" />
              <span className="text-slate-300 text-sm">{interest}</span>
              <button
                onClick={() => remove(interest)}
                className="text-slate-600 hover:text-red-400 transition-colors"
                title="Remove"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>

        {interests.length === 0 && (
          <p className="text-slate-600 text-sm text-center py-6">No interests added yet.</p>
        )}
      </div>

      {/* Preview */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3">
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
      </div>

      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${
          saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        <Save size={15} /> {saved ? "Saved!" : "Save Interests"}
      </button>
    </div>
  );
}
