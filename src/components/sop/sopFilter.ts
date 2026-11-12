import type { SopCase, SopCategory, SopClassification } from "./sopTypes";
import { sopClassifications } from "./sopTypes";

/**
 * Fungsi murni untuk pencarian dan filter SOP Directory (tanpa React/DOM).
 * Pencarian: tidak peka huruf besar/kecil, semua kata kunci harus ditemukan (AND),
 * dan mencakup judul, nomor catatan, deskripsi, keywords, serta isi templat.
 */

export type CategoryFilter = "all" | SopCategory;
export type ClassificationFilter = "all" | SopClassification;

export type SopFilters = {
  query: string;
  category: CategoryFilter;
  classification: ClassificationFilter;
};

export function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export function tokenize(query: string): string[] {
  return normalize(query).split(" ").filter(Boolean);
}

function headText(c: SopCase): string {
  return normalize([c.title, c.ref ?? "", c.description ?? "", ...(c.keywords ?? [])].join(" "));
}

function fullText(c: SopCase): string {
  return normalize(`${headText(c)} ${c.template ?? ""}`);
}

export function matchesQuery(c: SopCase, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const haystack = fullText(c);
  return tokens.every((token) => haystack.includes(token));
}

export function filterCases(cases: SopCase[], filters: SopFilters): SopCase[] {
  const tokens = tokenize(filters.query);
  return cases.filter(
    (c) =>
      (filters.category === "all" || c.category === filters.category) &&
      (filters.classification === "all" || c.classification === filters.classification) &&
      matchesQuery(c, tokens),
  );
}

export function countByCategory(cases: SopCase[]): Record<SopCategory, number> {
  const counts: Record<SopCategory, number> = { dafduk: 0, capil: 0 };
  cases.forEach((c) => {
    counts[c.category] += 1;
  });
  return counts;
}

/** Jumlah per klasifikasi pada kategori dan kata kunci yang sedang aktif. */
export function countClassifications(
  cases: SopCase[],
  filters: Pick<SopFilters, "query" | "category">,
): Record<ClassificationFilter, number> {
  const base = filterCases(cases, { ...filters, classification: "all" });
  const counts = { all: base.length } as Record<ClassificationFilter, number>;
  sopClassifications.forEach(({ value }) => {
    counts[value] = base.filter((c) => c.classification === value).length;
  });
  return counts;
}

/**
 * Potongan isi templat di sekitar kata yang cocok. Hanya dikembalikan bila
 * pencarian tidak sepenuhnya dijelaskan oleh judul/deskripsi/keywords,
 * supaya operator tahu mengapa kasus itu muncul.
 */
export function getTemplateSnippet(c: SopCase, tokens: string[]): string | null {
  if (tokens.length === 0 || !c.template) return null;
  const head = headText(c);
  if (tokens.every((token) => head.includes(token))) return null;

  const flat = c.template.replace(/\s+/g, " ").trim();
  const lower = flat.toLowerCase();
  let index = -1;
  tokens.forEach((token) => {
    const found = lower.indexOf(token);
    if (found >= 0 && (index === -1 || found < index)) index = found;
  });
  if (index === -1) return null;

  const start = Math.max(0, index - 50);
  const end = Math.min(flat.length, index + 110);
  return `${start > 0 ? "… " : ""}${flat.slice(start, end).trim()}${end < flat.length ? " …" : ""}`;
}

export type TextSegment = { text: string; match: boolean };

/** Memecah teks menjadi bagian yang cocok dan tidak cocok dengan kata kunci (untuk sorotan). */
export function splitByTokens(text: string, tokens: string[]): TextSegment[] {
  if (tokens.length === 0) return [{ text, match: false }];
  const pattern = [...tokens]
    .sort((a, b) => b.length - a.length)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  // Dengan grup penangkap, bagian pada indeks ganjil hasil split adalah kecocokan.
  return text
    .split(new RegExp(`(${pattern})`, "gi"))
    .map((part, index) => ({ text: part, match: index % 2 === 1 }))
    .filter((segment) => segment.text !== "");
}
