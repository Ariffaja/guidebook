"use client";

import { useCallback, useState, type ReactNode } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Icon from "@/components/ui/Icon";
import Toast from "@/components/ui/Toast";
import BirthVerificationCard from "./BirthVerificationCard";
import BirthVerificationResultPanel from "./BirthVerificationResultPanel";
import { birthVerificationDocuments, type DocumentSelection } from "./birthVerificationData";
import { TOTAL_DOCUMENTS, evaluateAll } from "./birthVerificationLogic";

type BirthVerificationStepProps = {
  onBackToService: () => void;
  onBackToCategory: () => void;
};

type ToastState = { id: number; icon: string; message: ReactNode };

const emptySelections = (): DocumentSelection[] =>
  birthVerificationDocuments.map(() => ({ input: "", image: "" }));

/**
 * Simulasi panduan verifikasi berkas NIK Bayi Kecil untuk operator.
 * Tidak menyimpan, mengunggah, atau mengirim data apa pun.
 */
export default function BirthVerificationStep({
  onBackToService,
  onBackToCategory,
}: BirthVerificationStepProps) {
  const [selections, setSelections] = useState<DocumentSelection[]>(emptySelections);
  const [toast, setToast] = useState<ToastState | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  const evaluation = evaluateAll(birthVerificationDocuments, selections);

  function updateSelection(index: number, next: DocumentSelection) {
    setSelections((current) => current.map((item, i) => (i === index ? next : item)));
  }

  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ id: Date.now(), icon: "check_circle", message: "Template arahan berhasil disalin ke clipboard!" });
    } catch {
      setToast({ id: Date.now(), icon: "warning", message: "Template arahan gagal disalin. Salin manual dari kotak template." });
    }
  }

  function handleContinueToSiak() {
    // Placeholder: HTML sumber tidak mendefinisikan aksi untuk tombol ini.
    setToast({ id: Date.now(), icon: "info", message: "Tahap Lanjutkan ke SIAK belum tersedia pada panduan ini." });
  }

  return (
    <div className="flex w-full flex-col pb-16">
      <Breadcrumb
        items={[
          { label: "Pencatatan Sipil", onClick: onBackToService },
          { label: "Kelahiran", onClick: onBackToCategory },
          { label: "NIK Bayi Kecil", onClick: onBackToCategory },
          { label: "Verifikasi Berkas" },
        ]}
      />

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px] sm:leading-10">
              Verifikasi Berkas Kelahiran
            </h1>
            <span className="rounded-full bg-[#d7e2ff] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#001a40]">
              Bayi Baru Lahir (NIK Baru)
            </span>
          </div>
          <p className="max-w-3xl text-base text-[#424752]">
            Periksa kesesuaian data dan lampiran pada setiap dokumen untuk menentukan status pemeriksaan
            secara valid sebelum sinkronisasi SIAK.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 self-start rounded-lg border-l-4 border-[#003F87] bg-white p-4 shadow-sm md:self-auto">
          <div
            role="progressbar"
            aria-label="Progres verifikasi"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={evaluation.percent}
            className="relative flex h-12 w-12 items-center justify-center"
          >
            <svg className="h-12 w-12 -rotate-90 transform" viewBox="0 0 36 36" aria-hidden="true">
              <path
                className="text-[#e6e8ea]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-[#006a6a] transition-all duration-500 ease-out"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${evaluation.percent}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-[#191c1e]">{evaluation.percent}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#424752]">
              Progres Verifikasi
            </span>
            <span className="text-base font-bold leading-tight text-[#191c1e]">
              {evaluation.completedCount} dari {TOTAL_DOCUMENTS} dokumen diperiksa
            </span>
            <span className="mt-0.5 text-xs text-[#727784]">Seluruh berkas wajib dievaluasi</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
        <div className="flex flex-col gap-4 xl:col-span-7">
          {birthVerificationDocuments.map((doc, index) => (
            <BirthVerificationCard
              key={doc.id}
              document={doc}
              selection={selections[index]}
              result={evaluation.results[index]}
              onChange={(next) => updateSelection(index, next)}
            />
          ))}
        </div>

        <div className="xl:col-span-5">
          <BirthVerificationResultPanel
            documents={birthVerificationDocuments}
            evaluation={evaluation}
            onCopy={handleCopy}
          />
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-lg bg-white p-5 shadow-sm sm:flex-row">
        <button
          type="button"
          onClick={onBackToCategory}
          className="flex items-center gap-2 rounded bg-[#eceef0] px-4 py-2.5 text-sm font-semibold text-[#191c1e] transition-colors hover:bg-[#e6e8ea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          <span>Kembali ke Kategori Kelahiran</span>
        </button>

        <div className="flex items-center gap-2 text-center text-sm text-[#424752]">
          <Icon name="shield" className="text-[18px] text-[#006a6a]" />
          <span>Pastikan seluruh berkas telah ditelaah dengan teliti sebelum finalisasi</span>
        </div>

        <button
          type="button"
          onClick={handleContinueToSiak}
          className="flex items-center gap-2 rounded bg-[#0056B3] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#003F87] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
        >
          <span>Lanjutkan ke SIAK</span>
          <Icon name="arrow_forward" className="text-[18px]" />
        </button>
      </div>

      {toast && (
        <Toast key={toast.id} icon={toast.icon} onClose={closeToast}>
          {toast.message}
        </Toast>
      )}
    </div>
  );
}
