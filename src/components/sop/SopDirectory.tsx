"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import Toast from "@/components/ui/Toast";
import SopCaseDetail from "./SopCaseDetail";
import SopCaseList from "./SopCaseList";
import SopFilterBar from "./SopFilterBar";
import { sopCases } from "./sopCases";
import {
  countByCategory,
  countClassifications,
  filterCases,
  tokenize,
  type CategoryFilter,
  type ClassificationFilter,
} from "./sopFilter";
import { sopCategories, type SopCase } from "./sopTypes";

type ToastState = { id: number; icon: string; message: ReactNode };

/** Jumlah per kategori dihitung dari data yang benar-benar dimuat. */
const categoryCounts = countByCategory(sopCases);

/** Lebar layar (px) mulai dari mana daftar dan detail tampil berdampingan (breakpoint xl). */
const SPLIT_LAYOUT_MIN_WIDTH = 1280;

export default function SopDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [classification, setClassification] = useState<ClassificationFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const closeToast = useCallback(() => setToast(null), []);
  const detailRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<number | null>(null);

  const tokens = useMemo(() => tokenize(query), [query]);
  const filtered = useMemo(
    () => filterCases(sopCases, { query, category, classification }),
    [query, category, classification],
  );
  const classificationCounts = useMemo(
    () => countClassifications(sopCases, { query, category }),
    [query, category],
  );
  // Detail hanya tampil bila kasus terpilih masih termasuk hasil filter.
  const selectedCase = filtered.find((c) => c.id === selectedId) ?? null;

  function handleSelect(id: string) {
    setSelectedId(id);
    setCopiedId(null);
    // Pada layar sempit detail berada di bawah daftar, jadi gulir ke panel detail.
    if (window.innerWidth < SPLIT_LAYOUT_MIN_WIDTH) {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleReset() {
    setQuery("");
    setCategory("all");
    setClassification("all");
  }

  async function handleCopy(sopCase: SopCase) {
    if (!sopCase.template) return;
    try {
      await navigator.clipboard.writeText(sopCase.template);
      setCopiedId(sopCase.id);
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => {
        setCopiedId((current) => (current === sopCase.id ? null : current));
        copyTimer.current = null;
      }, 1800);
      setToast({
        id: Date.now(),
        icon: "check_circle",
        message: (
          <>
            Templat <strong>{sopCase.title}</strong> berhasil disalin.
          </>
        ),
      });
    } catch {
      setToast({
        id: Date.now(),
        icon: "warning",
        message: "Templat gagal disalin. Blok teks pada kotak templat lalu salin secara manual.",
      });
    }
  }

  return (
    <div className="flex w-full flex-col pb-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px] sm:leading-10">
          SOP Directory
        </h1>
        <p className="max-w-3xl text-base text-[#424752]">
          Pusat informasi kasus dan templat respons operasional pelayanan administrasi kependudukan.
        </p>
      </div>

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
                <span className="text-xs text-[#424752]">
                  {categoryCounts[meta.key]} catatan terdokumentasi
                </span>
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
        total={sopCases.length}
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <SopCaseList
            cases={filtered}
            tokens={tokens}
            selectedId={selectedCase?.id ?? null}
            onSelect={handleSelect}
            onReset={handleReset}
          />
        </div>
        <div ref={detailRef} className="scroll-mt-20 xl:sticky xl:top-20 xl:col-span-5">
          <SopCaseDetail
            sopCase={selectedCase}
            onCopy={handleCopy}
            copied={selectedCase?.id === copiedId}
          />
        </div>
      </div>

      {toast && (
        <Toast key={toast.id} icon={toast.icon} onClose={closeToast}>
          {toast.message}
        </Toast>
      )}
    </div>
  );
}
