"use client";

import { useState } from "react";
import { Plus, Pencil, Search } from "lucide-react";
import type { EBook } from "@/lib/data";
import { deleteEbook, saveEbook } from "@/lib/actions/content";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PdfUploadField } from "@/components/admin/pdf-upload-field";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ImageSourceField } from "@/components/admin/image-source-field";

type Book = EBook;
type BookInput = Omit<Book, "id" | "downloads"> & { id?: number };

const emptyBook: BookInput = {
  title: "", subtitle: "", author: "", category: "", year: new Date().getFullYear(), pages: 0,
  description: "", isbn: "", image: "", fileUrl: "",
};

function BookForm({ initial, categories, onSave, onCancel, pending }: { initial?: Book; categories: string[]; onSave: (d: BookInput) => void; onCancel: () => void; pending: boolean }) {
  const [f, setF] = useState<BookInput>(initial ?? emptyBook);
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  return (
    <Card variant="admin-panel" className="p-6 mb-6 space-y-4">
      <h3 className="font-serif text-lg text-white">{initial?.title ? "Edit Book" : "Add Book"}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {([["title", "Title *"], ["subtitle", "Subtitle"], ["author", "Author"], ["isbn", "ISBN"]] as [keyof BookInput, string][]).map(([key, label]) => (
          <div key={key}>
            <Label variant="admin-label" className="mb-1">{label}</Label>
            <Input variant="admin-field" value={(f[key] as string) ?? ""} onChange={(e) => set(key, e.target.value)}
              className="w-full" />
          </div>
        ))}
        <div>
          <Label variant="admin-label" className="mb-1">Category</Label>
          <Input variant="admin-field" value={f.category} onChange={(e) => set("category", e.target.value)}
            list="ebook-categories" className="w-full" />
          <datalist id="ebook-categories">
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div>
          <Label variant="admin-label" className="mb-1">Pages</Label>
          <Input variant="admin-field" type="number" min={0} value={f.pages} onChange={(e) => set("pages", Number(e.target.value))}
            className="w-full" />
        </div>
        <div>
          <Label variant="admin-label" className="mb-1">Year</Label>
          <Input variant="admin-field" type="number" value={f.year ?? ""} onChange={(e) => set("year", e.target.value ? Number(e.target.value) : null)}
            className="w-full" />
        </div>
      </div>
      <div>
        <Label variant="admin-label" className="mb-1">Description</Label>
        <Textarea variant="admin-field" rows={4} value={f.description ?? ""} onChange={(e) => set("description", e.target.value)}
          className="w-full resize-none" />
      </div>
      <div>
        <Label variant="admin-label" className="mb-1">Cover Image</Label>
        <ImageSourceField value={f.image ?? ""} onChange={(v) => set("image", v)} showPreview />
      </div>
      <div>
        <Label variant="admin-label" className="mb-1">eBook PDF (Read online &amp; Download)</Label>
        <PdfUploadField value={f.fileUrl} onChange={(v) => set("fileUrl", v)} />
      </div>
      <div className="flex gap-3">
        <Button variant="admin-primary" type="button" onClick={() => onSave(f)} disabled={pending} className="px-5 py-2.5 disabled:opacity-50">{pending ? "Saving…" : "Save Book"}</Button>
        <Button variant="admin-secondary" type="button" onClick={onCancel} className="px-5 py-2.5">Cancel</Button>
      </div>
    </Card>
  );
}

export default function AdminEBooks({ initial }: { initial: Book[] }) {
  const [books, setBooks] = useState<Book[]>(initial);
  const { pending, run } = useAction();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(books.map((b) => b.category).filter(Boolean)));

  const handleAdd = (data: BookInput) => {
    run(() => saveEbook(data), {
      success: "eBook added.",
      onSuccess: (saved) => {
        setBooks((prev) => [saved, ...prev]);
        setShowAdd(false);
      },
    });
  };

  const handleEdit = (book: Book, data: BookInput) => {
    run(() => saveEbook({ ...data, id: book.id }), {
      success: "eBook updated.",
      onSuccess: (saved) => {
        setBooks((prev) => prev.map((b) => (b.id === book.id ? { ...saved, downloads: book.downloads } : b)));
        setEditing(null);
      },
    });
  };

  const handleDelete = (id: number) => {
    run(() => deleteEbook(id), {
      success: "eBook deleted.",
      onSuccess: () => setBooks((prev) => prev.filter((b) => b.id !== id)),
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">eBook Library</h1>
          <p className="text-slate-400 text-sm">{books.length} books</p>
        </div>
        <Button variant="admin-primary" onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5">
          <Plus size={16} /> Add Book
        </Button>
      </div>

      {showAdd && <BookForm categories={categories} onSave={handleAdd} onCancel={() => setShowAdd(false)} pending={pending} />}

      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <Input variant="admin-field-dark" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..."
          className="w-full pl-9 pr-4 py-2.5" />
      </div>

      <Card variant="admin-panel" className="overflow-hidden">
        <Table variant="unstyled" className="w-full">
          <TableHeader variant="unstyled">
            <TableRow variant="unstyled" className="border-b border-slate-800">
              <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Book</TableHead>
              <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider hidden md:table-cell">Category</TableHead>
              <TableHead variant="unstyled" className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Downloads</TableHead>
              <TableHead variant="unstyled" className="text-right px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody variant="unstyled" className="divide-y divide-slate-800">
            {filtered.length === 0 && (
              <TableRow variant="unstyled">
                <TableCell variant="unstyled" colSpan={5} className="text-center py-16 text-slate-500 text-sm">
                  {books.length === 0 ? "No eBooks yet." : "No eBooks match your filters."}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((book) => (
              <TableRow variant="unstyled" key={book.id} className="hover:bg-slate-800/50 transition-colors">
                <TableCell variant="unstyled" className="px-5 py-4">
                  {editing === book.id ? (
                    <BookForm initial={book} categories={categories} onSave={(d) => handleEdit(book, d)} onCancel={() => setEditing(null)} pending={pending} />
                  ) : (
                    <div className="flex items-center gap-3">
                      {book.image ? (
                        <img src={book.image} alt={book.title} className="w-8 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-10 rounded-lg bg-slate-800 border border-slate-700 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-slate-200 text-sm font-medium">{book.title}</p>
                        <p className="text-slate-500 text-xs">{book.subtitle}</p>
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell variant="unstyled" className="px-5 py-4 hidden md:table-cell">
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg">{book.category}</span>
                </TableCell>
                <TableCell variant="unstyled" className="px-5 py-4 hidden lg:table-cell">
                  <span className="text-xs font-medium font-mono text-slate-300">{book.downloads}</span>
                  {!book.fileUrl && <span className="block text-amber-400 text-xs">No PDF yet</span>}
                </TableCell>
                <TableCell variant="unstyled" className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="admin-icon-edit" aria-label={`Edit ${book.title}`} onClick={() => setEditing(book.id)}>
                      <Pencil size={14} />
                    </Button>
                    <ConfirmDelete label={book.title} pending={pending} onConfirm={() => handleDelete(book.id)} />
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
