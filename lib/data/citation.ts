import type { Paper } from "./schemas";

type CitablePaper = Pick<Paper, "title" | "authors" | "year" | "journal" | "doi">;

const cleanDoi = (doi: string) => doi.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");

/** APA-style reference built only from the paper's own fields. */
export function apaCitation(p: CitablePaper) {
  const authors = p.authors.join(", ");
  const year = p.year ? `(${p.year})` : "(n.d.)";
  const parts = [authors ? `${authors} ${year}.` : `${year}.`, `${p.title}.`];
  if (p.journal) parts.push(`${p.journal}.`);
  if (p.doi) parts.push(`https://doi.org/${cleanDoi(p.doi)}`);
  return parts.join(" ");
}

/** BibTeX entry; the key is the first author's surname plus the year. */
export function bibtexCitation(p: CitablePaper) {
  const surname = (p.authors[0] ?? "paper").split(/\s+/).pop()!.toLowerCase().replace(/[^a-z0-9]/g, "") || "paper";
  const esc = (v: string) => v.replace(/[{}]/g, "");
  const fields = [
    ["title", p.title],
    ["author", p.authors.join(" and ")],
    ["journal", p.journal],
    ["year", p.year ? String(p.year) : ""],
    ["doi", p.doi ? cleanDoi(p.doi) : ""],
  ].filter(([, v]) => v);
  return `@article{${surname}${p.year ?? ""},\n${fields.map(([k, v]) => `  ${k} = {${esc(v)}}`).join(",\n")}\n}`;
}
