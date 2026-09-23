"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, Search, CheckCircle } from "lucide-react";
import type { certificates as initialCerts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export default function AdminCertificates() {
  const [certs, setCerts] = useState<(typeof initialCerts)[number][]>([]);
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
        <Button variant="admin-primary"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5"
        >
          <Plus size={16} /> Add Certificate
        </Button>
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
                <Label variant="unstyled" className="block text-sm text-slate-400 mb-1">{label}</Label>
                <Input variant="admin-field"
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <div>
            <Label variant="unstyled" className="block text-sm text-slate-400 mb-1">Category</Label>
            <NativeSelect variant="admin-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full"
            >
              {["Academic Certificates", "Professional Certificates", "Training", "Awards"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </NativeSelect>
          </div>
          <div>
            <Label variant="unstyled" className="block text-sm text-slate-400 mb-1">Skills (comma-separated)</Label>
            <Input variant="admin-field"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full"
              placeholder="Skill 1, Skill 2, Skill 3"
            />
          </div>
          <div>
            <Label variant="unstyled" className="block text-sm text-slate-400 mb-1">Description</Label>
            <Textarea variant="admin-field"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="admin-primary" type="submit" className="px-5 py-2.5">Save Certificate</Button>
            <Button variant="admin-secondary" type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5">Cancel</Button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <Input variant="admin-field-dark"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search certificates..."
          className="w-full pl-9 pr-4 py-2.5"
        />
      </div>

      {/* Table */}
      <Card variant="admin-panel" className="overflow-hidden">
        <Table variant="unstyled" className="w-full">
          <TableHeader variant="unstyled">
            <TableRow variant="unstyled" className="border-b border-slate-800">
              <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Certificate</TableHead>
              <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Issuer</TableHead>
              <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider hidden md:table-cell">Category</TableHead>
              <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Date</TableHead>
              <TableHead variant="unstyled" className="text-right px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody variant="unstyled" className="divide-y divide-slate-800">
            {filtered.length === 0 && (
              <TableRow variant="unstyled">
                <TableCell variant="unstyled" colSpan={6} className="text-center py-16 text-slate-500 text-sm">
                  {certs.length === 0 ? "No certificates yet." : "No certificates match your filters."}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((cert) => (
              <TableRow variant="unstyled" key={cert.id} className="hover:bg-slate-800/50 transition-colors">
                <TableCell variant="unstyled" className="px-5 py-4">
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
                </TableCell>
                <TableCell variant="unstyled" className="px-5 py-4 text-slate-400 text-sm">{cert.issuer}</TableCell>
                <TableCell variant="unstyled" className="px-5 py-4 text-slate-500 text-xs hidden md:table-cell">{cert.category}</TableCell>
                <TableCell variant="unstyled" className="px-5 py-4 text-slate-500 text-xs font-mono hidden lg:table-cell">{cert.completionDate}</TableCell>
                <TableCell variant="unstyled" className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="admin-icon-info">
                      <Eye size={14} />
                    </Button>
                    <Button variant="admin-icon-edit">
                      <Pencil size={14} />
                    </Button>
                    <Button variant="admin-icon-danger"
                      onClick={() => setCerts((prev) => prev.filter((c) => c.id !== cert.id))}
                      
>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
