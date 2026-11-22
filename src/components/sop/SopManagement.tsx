"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import SopCaseDetail from "./SopCaseDetail";
import SopCaseList from "./SopCaseList";
import SopFilterBar from "./SopFilterBar";
import {
  countByCategory,
  countClassifications,
  filterCases,
  tokenize,
  type CategoryFilter,
  type ClassificationFilter,
} from "./sopFilter";
import { sopCategories, type SopCase } from "./sopTypes";
import { deleteSopCase } from "@/app/sop-management/actions";
import { renderSopTemplate } from "./sopDeadline";

const SPLIT_LAYOUT_MIN_WIDTH = 1280;

export default function SopManagement({ cases, status, holidays, completeYears }: { cases: SopCase[]; status?: string; holidays: string[]; completeYears: number[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [classification, setClassification] = useState<ClassificationFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(cases[0]?.id ?? null);
  const [deleteTarget, setDeleteTarget] = useState<SopCase | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const tokens = useMemo(() => tokenize(query), [query]);
  const categoryCounts = useMemo(() => countByCategory(cases), [cases]);
  const filtered = useMemo(
    () => filterCases(cases, { query, category, classification }),
    [cases, query, category, classification],
  );
  const classificationCounts = useMemo(
    () => countClassifications(cases, { query, category }),
    [cases, query, category],
  );
  const selectedCase = filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null;
  const statusMessages: Record<string, string> = {
    created: "Kasus baru berhasil ditambahkan.",
    updated: "Perubahan kasus berhasil disimpan.",
    deleted: "Kasus berhasil dihapus permanen.",
    error: "Aksi gagal dilakukan. Muat ulang halaman lalu coba lagi.",
  };
  const statusMessage = statusMessages[status ?? ""];

  function selectCase(id: string) {
    setSelectedId(id);
    setCopiedId(null);
    if (window.innerWidth < SPLIT_LAYOUT_MIN_WIDTH) {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setClassification("all");
  }

  async function copyTemplate(sopCase: SopCase) {
    const template = renderSopTemplate(sopCase.template, sopCase.deadlineBusinessDays, holidays, completeYears);
    if (!template) return;
    try {
      await navigator.clipboard.writeText(template);
      setCopiedId(sopCase.id);
      window.setTimeout(() => setCopiedId((current) => (current === sopCase.id ? null : current)), 1800);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <div className="flex w-full flex-col pb-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px] sm:leading-10">
            SOP Management
          </h1>
          <p className="max-w-3xl text-base text-[#424752]">
            Kelola kasus dan templat respons yang ditampilkan di SOP Directory.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/sop-management/new")}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0056B3] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#003F87] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
        >
          <Icon name="add" className="text-[20px]" />
          Tambah Kasus
        </button>
      </div>

      {statusMessage && (
        <p
          role="status"
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            status === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-900"
          }`}
        >
          {statusMessage}
        </p>
      )}

      <div className="mb-4 flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm focus-within:ring-2 focus-within:ring-[#0056B3]/40">
        <Icon name="search" className="ml-2 text-[22px] text-[#727784]" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Cari kasus, persyaratan, atau permasalahan"
          placeholder="Cari kasus, persyaratan, atau permasalahan..."
          className="w-full bg-transparent text-base text-[#191c1e] placeholder:text-[#727784] focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Hapus pencarian"
            className="rounded p-1 text-[#727784] transition-colors hover:bg-[#eceef0] hover:text-[#191c1e] focus-visible:outline-2 focus-visible:outline-[#0056B3]"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sopCategories.map((meta) => {
          const active = category === meta.key;
          return (
            <button
              key={meta.key}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(active ? "all" : meta.key)}
              className={`flex items-center gap-3 rounded-lg border p-3.5 text-left shadow-sm transition-all hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3] ${
                active ? "border-[#0056B3] bg-[#d7e2ff]/40" : "border-[#c2c6d4]/40 bg-white"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  active ? "bg-[#003F87] text-white" : "bg-[#d7e2ff] text-[#001a40]"
                }`}
              >
                <Icon name={meta.icon} className="text-[20px]" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-[#191c1e]">
                  {meta.label} — {meta.subtitle}
                </span>
                <span className="text-xs text-[#424752]">{categoryCounts[meta.key]} catatan terdokumentasi</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="mb-5 mt-2 text-xs text-[#727784]">
        Jumlah menunjukkan catatan yang saat ini terkumpul, bukan keseluruhan kasus operasional.
      </p>

      <SopFilterBar
        classification={classification}
        onChange={setClassification}
        counts={classificationCounts}
        shown={filtered.length}
        total={cases.length}
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <SopCaseList
            cases={filtered}
            tokens={tokens}
            selectedId={selectedCase?.id ?? null}
            onSelect={selectCase}
            onReset={resetFilters}
            onEdit={(item) => router.push(`/sop-management/${encodeURIComponent(item.id)}/edit`)}
            onDelete={setDeleteTarget}
          />
        </div>
        <div ref={detailRef} className="scroll-mt-20 xl:sticky xl:top-20 xl:col-span-5">
          <SopCaseDetail
            sopCase={selectedCase}
            onCopy={copyTemplate}
            copied={selectedCase?.id === copiedId}
            holidays={holidays}
            completeYears={completeYears}
          />
        </div>
      </div>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDeleteTarget(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-case-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#ba1a1a]">
                <Icon name="delete" className="text-[20px]" />
              </span>
              <div>
                <h2 id="delete-case-title" className="text-lg font-semibold text-[#191c1e]">
                  Hapus kasus ini?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#424752]">
                  “{deleteTarget.title}” akan dihapus permanen dari SOP Directory.
                </p>
              </div>
            </div>
            <form action={deleteSopCase} className="mt-6 flex justify-end gap-2">
              <input type="hidden" name="id" value={deleteTarget.id} />
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-[#c2c6d4] px-4 py-2 text-sm font-medium text-[#424752] hover:bg-[#f2f4f6] focus-visible:outline-2 focus-visible:outline-[#0056B3]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#ba1a1a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#93000a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ba1a1a]"
              >
                Hapus Permanen
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
