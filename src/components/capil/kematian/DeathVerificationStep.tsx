"use client";

import { useCallback, useState, type ReactNode } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Icon from "@/components/ui/Icon";
import Toast from "@/components/ui/Toast";
import DeathVerificationCard from "./DeathVerificationCard";
import DeathVerificationResultPanel from "./DeathVerificationResultPanel";
import {
  deathVerificationDocuments,
  type DeathDocumentSelection,
} from "./deathVerificationData";
import { evaluateAll } from "./deathVerificationLogic";

type DeathVerificationStepProps = {
  /** Judul kategori terpilih untuk breadcrumb (contoh: "KTP-el"). */
  categoryTitle: string;
  onBackToService: () => void;
  onBackToCategory: () => void;
};

type ToastState = { id: number; icon: string; message: ReactNode };

const emptySelections = (): DeathDocumentSelection[] =>
  deathVerificationDocuments.map(() => ({ input: "", image: "" }));

/**
 * Simulasi panduan verifikasi berkas kematian untuk operator.
 * Tidak menyimpan, mengunggah, atau mengirim data apa pun.
 */
export default function DeathVerificationStep({
  categoryTitle,
  onBackToService,
  onBackToCategory,
}: DeathVerificationStepProps) {
  const [selections, setSelections] = useState<DeathDocumentSelection[]>(emptySelections);
  const [toast, setToast] = useState<ToastState | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  const evaluation = evaluateAll(deathVerificationDocuments, selections);

  function updateSelection(index: number, next: DeathDocumentSelection) {
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

  return (
    <div className="flex w-full flex-col pb-16">
      <Breadcrumb
        items={[
          { label: "Pencatatan Sipil", onClick: onBackToService },
          { label: "Kematian", onClick: onBackToCategory },
          { label: categoryTitle, onClick: onBackToCategory },
          { label: "Verifikasi Berkas" },
        ]}
      />

      <div className="mb-5 flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px] sm:leading-10">
          Verifikasi Berkas: {categoryTitle}
        </h1>
        <p className="max-w-3xl text-sm text-[#424752]">
          Pilih kondisi data dan lampiran untuk setiap dokumen. Status serta arahan operator akan diperbarui otomatis.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
        <div className="flex flex-col gap-4 xl:col-span-7">
          {deathVerificationDocuments.map((doc, index) => (
            <DeathVerificationCard
              key={doc.id}
              document={doc}
              selection={selections[index]}
              result={evaluation.results[index]}
              onChange={(next) => updateSelection(index, next)}
            />
          ))}
        </div>

        <div className="xl:col-span-5">
          <DeathVerificationResultPanel
            documents={deathVerificationDocuments}
            evaluation={evaluation}
            onCopy={handleCopy}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-[#e0e3e5] pt-4">
        <button
          type="button"
          onClick={onBackToCategory}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-[#424752] transition-colors hover:bg-[#e6e8ea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          <span>Kembali ke Kategori KTP-el</span>
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
