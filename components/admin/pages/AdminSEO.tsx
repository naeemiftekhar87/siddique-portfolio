"use client";

import { useState } from "react";
import { Save, Globe, Search, Image as ImageIcon, Tag, Hash, ToggleLeft, ToggleRight } from "lucide-react";

const pages = [
  { id: "home", label: "Home", path: "/" },
  { id: "about", label: "About", path: "/about" },
  { id: "experience", label: "Experience", path: "/experience" },
  { id: "education", label: "Education", path: "/education" },
  { id: "skills", label: "Skills", path: "/skills" },
  { id: "certificates", label: "Certificates", path: "/certificates" },
  { id: "portfolio", label: "Portfolio", path: "/portfolio" },
  { id: "research", label: "Research", path: "/research" },
  { id: "publications", label: "Publications", path: "/publications" },
  { id: "ebooks", label: "eBooks", path: "/ebooks" },
  { id: "resume", label: "Resume", path: "/resume" },
  { id: "contact", label: "Contact", path: "/contact" },
];

type SEOData = {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonical: string;
  indexed: boolean;
};

const defaultSEO: SEOData = {
  title: "",
  description: "",
  keywords: "",
  ogImage: "",
  canonical: "",
  indexed: true,
};

const sampleData: Record<string, SEOData> = {
  home: {
    title: "Your Name — Academic & Professional Portfolio",
    description: "Placeholder meta description for the home page. Replace it with a one-sentence summary of who you are and what visitors will find here.",
    keywords: "keyword one, keyword two, keyword three",
    ogImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop",
    canonical: "https://example.com/",
    indexed: true,
  },
  research: {
    title: "Research & Academic Work — Your Name",
    description: "Explore research papers, academic publications, and ongoing research projects.",
    keywords: "research, publications, keyword three",
    ogImage: "",
    canonical: "https://example.com/research",
    indexed: true,
  },
};

export default function AdminSEO() {
  const [activePageId, setActivePageId] = useState("home");
  const [seoData, setSeoData] = useState<Record<string, SEOData>>(sampleData);
  const [saved, setSaved] = useState(false);

  const current = seoData[activePageId] ?? { ...defaultSEO };
  const activePage = pages.find((p) => p.id === activePageId)!;

  const update = (k: keyof SEOData, v: SEOData[keyof SEOData]) => {
    setSeoData((prev) => ({
      ...prev,
      [activePageId]: { ...(prev[activePageId] ?? defaultSEO), [k]: v },
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const charCount = current.description.length;
  const titleCount = current.title.length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-white mb-1">SEO Management</h1>
        <p className="text-slate-400 text-sm">Manage meta tags and SEO settings for each page</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Page list */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 h-fit">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 px-1">Pages</h3>
          <div className="space-y-1">
            {pages.map((page) => {
              const hasData = !!seoData[page.id]?.title;
              return (
                <button
                  key={page.id}
                  onClick={() => setActivePageId(page.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                    activePageId === page.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <span>{page.label}</span>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${hasData ? "bg-green-500" : "bg-slate-700"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* SEO form */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl text-white">{activePage.label}</h2>
              <code className="text-slate-500 text-xs">{activePage.path}</code>
            </div>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              <Save size={15} /> {saved ? "Saved!" : "Save"}
            </button>
          </div>

          {/* Search Preview */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <h3 className="text-slate-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <Search size={13} /> Search Result Preview
            </h3>
            <div className="bg-white rounded-xl p-4">
              <p className="text-[#1a0dab] text-lg leading-snug truncate">{current.title || `${activePage.label} — Your Name`}</p>
              <p className="text-[#006621] text-xs mt-0.5">{current.canonical || `https://example.com${activePage.path}`}</p>
              <p className="text-[#545454] text-sm mt-1 line-clamp-2">{current.description || "Enter a meta description…"}</p>
            </div>
          </div>

          {/* Title */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-400 flex items-center gap-1.5"><Globe size={13} /> SEO Title</label>
                <span className={`text-xs font-mono ${titleCount > 60 ? "text-red-400" : "text-slate-500"}`}>{titleCount}/60</span>
              </div>
              <input
                value={current.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Page title for search engines…"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-400">Meta Description</label>
                <span className={`text-xs font-mono ${charCount > 160 ? "text-red-400" : charCount < 120 && charCount > 0 ? "text-amber-400" : "text-slate-500"}`}>{charCount}/160</span>
              </div>
              <textarea
                rows={3}
                value={current.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Brief description for search results…"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 flex items-center gap-1.5"><Tag size={13} /> Keywords</label>
              <input
                value={current.keywords}
                onChange={(e) => update("keywords", e.target.value)}
                placeholder="keyword one, keyword two…"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Technical */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h3 className="text-slate-400 text-xs uppercase tracking-wider flex items-center gap-2"><Hash size={13} /> Technical SEO</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Canonical URL</label>
              <input
                value={current.canonical}
                onChange={(e) => update("canonical", e.target.value)}
                placeholder="https://example.com/..."
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 flex items-center gap-1.5"><ImageIcon size={13} /> OG Image URL</label>
              <input
                value={current.ogImage}
                onChange={(e) => update("ogImage", e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-slate-300 text-sm font-medium">Search Engine Indexing</p>
                <p className="text-slate-500 text-xs">Allow search engines to index this page</p>
              </div>
              <button
                type="button"
                onClick={() => update("indexed", !current.indexed)}
                className="flex-shrink-0"
              >
                {current.indexed
                  ? <ToggleRight size={28} className="text-blue-500" />
                  : <ToggleLeft size={28} className="text-slate-600" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
