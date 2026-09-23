"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import type { ebooks as initialBooks } from "@/lib/data";

type Book = typeof initialBooks[0];

const categories = ["Sample Category A", "Sample Category B", "Sample Category C", "Sample Category D", "Sample Category E"];

function BookForm({ initial, onSave, onCancel }: { initial?: Partial<Book>; onSave: (d: Partial<Book>) => void; onCancel: () => void }) {
  const [f, setF] = useState<Partial<Book>>(
    initial ?? { title: "", subtitle: "", author: "Your Name", category: "Sample Category A", year: 2026, pages: 0, description: "", price: "Free", isbn: "" }
  );
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6 space-y-4">
      <h3 className="font-serif text-lg text-white">{initial?.title ? "Edit Book" : "Add Book"}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {([["title", "Title *"], ["subtitle", "Subtitle"], ["author", "Author"], ["isbn", "ISBN"], ["price", "Price"]] as [keyof Book, string][]).map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs text-slate-400 mb-1">{label}</label>
            <input value={(f[key] as string) ?? ""} onChange={(e) => set(key, e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" />
          </div>
        ))}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Category</label>
          <select value={f.category ?? "Sample Category A"} onChange={(e) => set("category", e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Pages</label>
          <input type="number" value={f.pages ?? 0} onChange={(e) => set("pages", Number(e.target.value))}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Year</label>
          <input type="number" value={f.year ?? 2026} onChange={(e) => set("year", Number(e.target.value))}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Description</label>
        <textarea rows={4} value={f.description ?? ""} onChange={(e) => set("description", e.target.value)}
          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none" />
      </div>
      {/* Upload area placeholder */}
      <div>
        <label className="block text-xs text-slate-400 mb-1">Cover Image</label>
        <div className="w-full border-2 border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-500 text-sm hover:border-blue-600 hover:text-blue-400 transition-colors cursor-pointer">
          Drag & drop or click to upload
        </div>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={() => onSave(f)} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">Save Book</button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

export default function AdminEBooks() {
  const [books, setBooks] = useState<(typeof initialBooks)[number][]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: Partial<Book>) => {
    setBooks((prev) => [{ id: Date.now(), image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=560&fit=crop", ...data } as (typeof prev)[number], ...prev]);
    setShowAdd(false);
  };

  const handleEdit = (id: number, data: Partial<Book>) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
    setEditing(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">eBook Library</h1>
          <p className="text-slate-400 text-sm">{books.length} books</p>
        </div>
        <button onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Add Book
        </button>
      </div>

      {showAdd && <BookForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />}

      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..."
          className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500" />
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Book</th>
              <th className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="text-left px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Price</th>
              <th className="text-right px-5 py-3.5 text-slate-400 text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-16 text-slate-500 text-sm">
                  {books.length === 0 ? "No eBooks yet." : "No eBooks match your filters."}
                </td>
              </tr>
            )}
            {filtered.map((book) => (
              <tr key={book.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-5 py-4">
                  {editing === book.id ? (
                    <BookForm initial={book} onSave={(d) => handleEdit(book.id, d)} onCancel={() => setEditing(null)} />
                  ) : (
                    <div className="flex items-center gap-3">
                      <img src={book.image} alt={book.title} className="w-8 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <p className="text-slate-200 text-sm font-medium">{book.title}</p>
                        <p className="text-slate-500 text-xs">{book.subtitle}</p>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg">{book.category}</span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className={`text-xs font-medium ${book.price === "Free" ? "text-green-400" : "text-slate-300"}`}>{book.price}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditing(book.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-950/30 transition-all">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setBooks((prev) => prev.filter((b) => b.id !== book.id))}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-all">
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
