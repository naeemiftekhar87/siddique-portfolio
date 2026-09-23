"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, Search, CheckCircle } from "lucide-react";
import { certificates as initialCerts } from "@/lib/data";

export default function AdminCertificates() {
  const [certs, setCerts] = useState(initialCerts);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", issuer: "", category: "Professional Certificates", completionDate: "",
    grade: "", duration: "", credentialId: "", skills: "", description: "",
  });

  const filtered = certs.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.issuer.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert = {
      id: Date.now(),
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=280&fit=crop",
      verified: true,
    };
    setCerts((prev) => [newCert, ...prev]);
    setShowForm(false);
    setForm({ title: "", issuer: "", category: "Professional Certificates", completionDate: "", grade: "", duration: "", credentialId: "", skills: "", description: "" });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Certificates</h1>
          <p className="text-slate-400 text-sm">{certs.length} total certificates</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add Certificate
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6 space-y-4">
          <h3 className="font-serif text-lg text-white mb-2">Add Certificate</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["title", "Certificate Title *", "text"],
              ["issuer", "Issuer / Institution *", "text"],
              ["completionDate", "Completion Date", "text"],
              ["grade", "Grade / Score", "text"],
              ["duration", "Duration", "text"],
              ["credentialId", "Credential ID", "text"],
            ].map(([key, label, type]) => (
              <div key={key}>
                <label className="block text-sm text-slate-400 mb-1">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
            >
              {["Academic Certificates", "Professional Certificates", "Training", "Awards"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Skills (comma-separated)</label>
            <input
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Skill 1, Skill 2, Skill 3"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">Save Certificate</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors">Cancel</button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search certificates..."
          className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Certificate</th>
              <th className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Issuer</th>
              <th className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Date</th>
              <th className="text-right px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((cert) => (
              <tr key={cert.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={cert.image} alt={cert.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                    <div>
                      <p className="text-slate-200 text-sm font-medium">{cert.title}</p>
                      {cert.verified && (
                        <span className="flex items-center gap-1 text-green-400 text-xs">
                          <CheckCircle size={10} /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-400 text-sm">{cert.issuer}</td>
                <td className="px-5 py-4 text-slate-500 text-xs hidden md:table-cell">{cert.category}</td>
                <td className="px-5 py-4 text-slate-500 text-xs font-mono hidden lg:table-cell">{cert.completionDate}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-950/30 transition-all">
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-950/30 transition-all">
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setCerts((prev) => prev.filter((c) => c.id !== cert.id))}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
