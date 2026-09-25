"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Eye, Search, CheckCircle, Award } from "lucide-react";
import { certificateCategories, type Certificate } from "@/lib/data";
import { deleteCertificate, saveCertificate } from "@/lib/actions/content";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { ImageSourceField } from "@/components/admin/image-source-field";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type Form = {
  id?: number;
  title: string; issuer: string; category: Certificate["category"]; completionDate: string;
  grade: string; duration: string; credentialId: string; skills: string; description: string;
  image: string; verified: boolean; verifyUrl: string;
};

const emptyForm: Form = {
  title: "", issuer: "", category: "Professional Certificates", completionDate: "",
  grade: "", duration: "", credentialId: "", skills: "", description: "",
  image: "", verified: false, verifyUrl: "",
};

const toForm = (c: Certificate): Form => ({ ...c, skills: c.skills.join(", ") });

export default function AdminCertificates({ initial }: { initial: Certificate[] }) {
  const [certs, setCerts] = useState<Certificate[]>(initial);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Form>(emptyForm);
  const { pending, run } = useAction();

  const filtered = certs.filter((c) =>
    (categoryFilter === "All" || c.category === categoryFilter) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.issuer.toLowerCase().includes(search.toLowerCase()))
  );

  const closeForm = () => { setShowForm(false); setForm(emptyForm); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) };
    run(() => saveCertificate(payload), {
      success: form.id ? "Certificate updated." : "Certificate added.",
      onSuccess: (saved) => {
        setCerts((prev) => (form.id ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev]));
        closeForm();
      },
    });
  };

  const startEdit = (cert: Certificate) => {
    setForm(toForm(cert));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    run(() => deleteCertificate(id), {
      success: "Certificate deleted.",
      onSuccess: () => setCerts((prev) => prev.filter((c) => c.id !== id)),
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Certificates</h1>
          <p className="text-slate-400 text-sm">{certs.length} total certificates</p>
        </div>
        <Button variant="admin-primary"
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className="flex items-center gap-2 px-4 py-2.5"
        >
          <Plus size={16} /> Add Certificate
        </Button>
      </div>

      {/* Add / edit form */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6 space-y-4">
          <h3 className="font-serif text-lg text-white mb-2">{form.id ? "Edit Certificate" : "Add Certificate"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {([
              ["title", "Certificate Title *"],
              ["issuer", "Issuer / Institution *"],
              ["completionDate", "Completion Date"],
              ["grade", "Grade / Score"],
              ["duration", "Duration"],
              ["credentialId", "Credential ID"],
            ] as const).map(([key, label]) => (
              <div key={key}>
                <Label variant="unstyled" htmlFor={`cert-${key}`} className="block text-sm text-slate-400 mb-1">{label}</Label>
                <Input variant="admin-field"
                  id={`cert-${key}`}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <div>
            <Label variant="unstyled" htmlFor="cert-category" className="block text-sm text-slate-400 mb-1">Category</Label>
            <NativeSelect variant="admin-field"
              id="cert-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Form["category"] })}
              className="w-full"
            >
              {certificateCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </NativeSelect>
          </div>
          <div>
            <Label variant="unstyled" htmlFor="cert-skills" className="block text-sm text-slate-400 mb-1">Skills (comma-separated)</Label>
            <Input variant="admin-field"
              id="cert-skills"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full"
              placeholder="Skill 1, Skill 2, Skill 3"
            />
          </div>
          <div>
            <Label variant="unstyled" htmlFor="cert-description" className="block text-sm text-slate-400 mb-1">Description</Label>
            <Textarea variant="admin-field"
              id="cert-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full resize-none"
            />
          </div>
          <div>
            <Label variant="unstyled" className="block text-sm text-slate-400 mb-1">Certificate Image</Label>
            <ImageSourceField value={form.image} onChange={(v) => setForm({ ...form, image: v })} showPreview />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <Label variant="unstyled" htmlFor="cert-verify" className="block text-sm text-slate-400 mb-1">Verification URL</Label>
              <Input variant="admin-field"
                id="cert-verify"
                type="url"
                value={form.verifyUrl}
                onChange={(e) => setForm({ ...form, verifyUrl: e.target.value })}
                className="w-full font-mono"
                placeholder="https://..."
              />
            </div>
            <Label variant="unstyled" className="flex items-center gap-2 text-sm text-slate-300 py-2.5 cursor-pointer">
              <Input variant="unstyled" type="checkbox" checked={form.verified}
                onChange={(e) => setForm({ ...form, verified: e.target.checked })}
                className="w-4 h-4 accent-blue-600" />
              Verified credential
            </Label>
          </div>
          <div className="flex gap-3">
            <Button variant="admin-primary" type="submit" disabled={pending} className="px-5 py-2.5 disabled:opacity-50">
              {pending ? "Saving…" : "Save Certificate"}
            </Button>
            <Button variant="admin-secondary" type="button" onClick={closeForm} className="px-5 py-2.5">Cancel</Button>
          </div>
        </form>
      )}

      {/* Search + category filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input variant="admin-field-dark"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificates..."
            aria-label="Search certificates"
            className="w-full pl-9 pr-4 py-2.5"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...certificateCategories].map((c) => (
            <Button variant="unstyled" key={c} onClick={() => setCategoryFilter(c)} aria-pressed={categoryFilter === c}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${categoryFilter === c ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"}`}>
              {c}
            </Button>
          ))}
        </div>
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
                <TableCell variant="unstyled" colSpan={5} className="text-center py-16 text-slate-500 text-sm">
                  {certs.length === 0 ? "No certificates yet." : "No certificates match your filters."}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((cert) => (
              <TableRow variant="unstyled" key={cert.id} className="hover:bg-slate-800/50 transition-colors">
                <TableCell variant="unstyled" className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {cert.image ? (
                      <img loading="lazy" decoding="async" src={cert.image} alt={cert.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0"><Award size={14} className="text-slate-600" /></div>
                    )}
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
                    <Button asChild variant="admin-icon-info">
                      <Link href={`/certificates/${cert.id}`} target="_blank" aria-label={`View ${cert.title} on the site`}>
                        <Eye size={14} />
                      </Link>
                    </Button>
                    <Button variant="admin-icon-edit" aria-label={`Edit ${cert.title}`} onClick={() => startEdit(cert)}>
                      <Pencil size={14} />
                    </Button>
                    <ConfirmDelete label={cert.title} pending={pending} onConfirm={() => handleDelete(cert.id)} />
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
