"use client";

import { useCallback, useState, type ReactNode } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Icon from "@/components/ui/Icon";
import Toast from "@/components/ui/Toast";
import BirthVerificationCard from "./BirthVerificationCard";
import BirthVerificationResultPanel from "./BirthVerificationResultPanel";
import { birthVerificationDocuments, type DocumentSelection } from "./birthVerificationData";
import { evaluateAll } from "./birthVerificationLogic";

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
    <div className="mx-auto w-full max-w-[1080px] pb-8">
      <Breadcrumb
        items={[
          { label: "Pencatatan Sipil", onClick: onBackToService },
          { label: "Kelahiran", onClick: onBackToCategory },
          { label: "NIK Bayi Kecil", onClick: onBackToCategory },
          { label: "Verifikasi Berkas" },
        ]}
      />

      <div className="mb-6 rounded-xl border border-[#e4e8ed] bg-[#f1f3f5] px-5 py-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#657181]">
          Pencatatan Sipil / Kelahiran / NIK Bayi Kecil / Verifikasi Berkas
        </p>
        <h1 className="text-[22px] font-bold tracking-tight text-[#191c1e]">
          Verifikasi Berkas Kelahiran
        </h1>
        <p className="mt-1 max-w-3xl text-[12px] text-[#424752]">
          Periksa kesesuaian data dan lampiran pada setiap dokumen untuk menentukan status pemeriksaan
          secara valid sebelum sinkronisasi SIAK.
        </p>
        <span className="mt-2 inline-flex rounded-full bg-[#d7e2ff] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#001a40]">
          Bayi Baru Lahir (NIK Baru)
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.9fr)]">
        <div className="flex flex-col gap-4">
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

        <aside className="lg:sticky lg:top-20">
          <BirthVerificationResultPanel
            documents={birthVerificationDocuments}
            selections={selections}
            evaluation={evaluation}
            onCopy={handleCopy}
          />
        </aside>
      </div>

      <div className="mt-7 flex flex-col items-center justify-between gap-4 border-t border-[#e0e3e5] pt-5 sm:flex-row">
        <button
          type="button"
          onClick={onBackToCategory}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-[#424752] transition-colors hover:bg-[#e6e8ea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          <span>Kembali ke Kategori Kelahiran</span>
        </button>

        <div className="flex items-center gap-2 text-center text-[10px] text-[#657181]">
          <Icon name="shield" className="text-[16px] text-[#006a6a]" />
          <span>Pastikan seluruh berkas telah ditelaah dengan teliti sebelum finalisasi</span>
        </div>

        <button
          type="button"
          onClick={handleContinueToSiak}
          className="inline-flex items-center gap-2 rounded-lg bg-[#003F87] px-5 py-3 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-[#0056B3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
        >
          <span>Lanjutkan ke SIAK</span>
          <Icon name="arrow_forward" className="text-[15px]" />
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
