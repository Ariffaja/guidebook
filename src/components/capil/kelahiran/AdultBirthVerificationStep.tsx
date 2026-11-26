"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Icon from "@/components/ui/Icon";
import Toast from "@/components/ui/Toast";
import BirthVerificationCard from "./BirthVerificationCard";
import BirthParentClassificationCard from "./BirthParentClassificationCard";
import BirthVerificationResultPanel from "./BirthVerificationResultPanel";
import {
  adultBirthMarriageDocument,
  adultBirthRequiredDocuments,
} from "./adultBirthVerificationData";
import type { DocumentSelection, VerificationDocument } from "./birthVerificationData";
import { evaluateAll, type BirthParentClassification } from "./birthVerificationLogic";

type AdultBirthVerificationStepProps = {
  onBackToService: () => void;
  onBackToCategory: () => void;
};

type ToastState = { id: number; icon: string; message: ReactNode };
type MarriageDocumentAnswer = "ya" | "tidak" | null;

const emptySelection = (): DocumentSelection => ({ image: "" });

function MarriageDocumentQuestion({
  value,
  onChange,
}: {
  value: MarriageDocumentAnswer;
  onChange: (answer: Exclude<MarriageDocumentAnswer, null>) => void;
}) {
  return (
    <fieldset className="mb-5 rounded-xl border border-[#c7d8ee] bg-white p-4 shadow-sm sm:p-5">
      <legend className="px-1 text-sm font-bold text-[#191c1e]">
        Apakah pemohon melampirkan akta nikah?
      </legend>
      <p className="mb-3 text-xs leading-relaxed text-[#59616d]">
        Enam berkas utama tetap wajib. Pilih “Ya” bila akta/kutipan nikah dilampirkan agar kotak pemeriksaannya dan klasifikasi tanggal ditampilkan.
      </p>
      <div className="flex flex-wrap gap-3">
        {([
          ["ya", "Ya, ada akta/kutipan nikah"],
          ["tidak", "Tidak ada"],
        ] as const).map(([answer, label]) => (
          <label
            key={answer}
            className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
              value === answer
                ? "border-[#0056B3] bg-[#edf4ff] text-[#003F87]"
                : "border-[#e0e3e5] bg-white text-[#424752] hover:border-[#9db6d4]"
            }`}
          >
            <input
              type="radio"
              name="adult-marriage-document"
              value={answer}
              checked={value === answer}
              onChange={() => onChange(answer)}
              className="h-4 w-4 accent-[#0056B3]"
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Panduan berkas kelahiran terlambat untuk penduduk dewasa / NIK Bayi Dewasa. */
export default function AdultBirthVerificationStep({
  onBackToService,
  onBackToCategory,
}: AdultBirthVerificationStepProps) {
  const [marriageAnswer, setMarriageAnswer] = useState<MarriageDocumentAnswer>(null);
  const [selections, setSelections] = useState<Record<number, DocumentSelection>>({
    1: emptySelection(),
    2: emptySelection(),
    3: emptySelection(),
    4: emptySelection(),
    5: emptySelection(),
    6: emptySelection(),
    7: emptySelection(),
  });
  const [parentClassification, setParentClassification] = useState<BirthParentClassification | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  const documents = useMemo<VerificationDocument[]>(
    () => marriageAnswer === "ya"
      ? [...adultBirthRequiredDocuments, adultBirthMarriageDocument]
      : adultBirthRequiredDocuments,
    [marriageAnswer],
  );
  const evaluation = evaluateAll(documents, documents.map((doc) => selections[doc.id]));

  function updateSelection(id: number, next: DocumentSelection) {
    setSelections((current) => ({ ...current, [id]: next }));
  }

  function updateMarriageAnswer(answer: Exclude<MarriageDocumentAnswer, null>) {
    setMarriageAnswer(answer);
    setParentClassification(null);
    if (answer === "tidak") {
      setSelections((current) => ({ ...current, [adultBirthMarriageDocument.id]: emptySelection() }));
    }
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
    <div className="mx-auto w-full max-w-[1080px] pb-8">
      <Breadcrumb
        items={[
          { label: "Pencatatan Sipil", onClick: onBackToService },
          { label: "Kelahiran", onClick: onBackToCategory },
          { label: "NIK Bayi Dewasa", onClick: onBackToCategory },
          { label: "Verifikasi Berkas" },
        ]}
      />

      <div className="mb-6 rounded-xl border border-[#e4e8ed] bg-[#f1f3f5] px-5 py-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#657181]">
          Pencatatan Sipil / Kelahiran / NIK Bayi Dewasa / Verifikasi Berkas
        </p>
        <h1 className="text-[22px] font-bold tracking-tight text-[#191c1e]">Verifikasi Berkas Kelahiran Dewasa</h1>
        <p className="mt-1 max-w-3xl text-[12px] text-[#424752]">
          Periksa enam berkas wajib. Kotak akta nikah dan klasifikasi status anak hanya muncul bila pemohon melampirkan akta/kutipan nikah.
        </p>
        <span className="mt-2 inline-flex rounded-full bg-[#ffdbcc] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#351000]">
          Kelahiran Terlambat · NIK Bayi Dewasa
        </span>
      </div>

      <MarriageDocumentQuestion value={marriageAnswer} onChange={updateMarriageAnswer} />

      {marriageAnswer === "ya" && (
        <BirthParentClassificationCard
          subjectLabel="pemohon"
          onClassificationChange={setParentClassification}
        />
      )}

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.9fr)]">
        <div className="flex flex-col gap-4">
          {adultBirthRequiredDocuments.map((doc, index) => (
            <BirthVerificationCard
              key={doc.id}
              document={doc}
              selection={selections[doc.id]}
              result={evaluation.results[index]}
              onChange={(next) => updateSelection(doc.id, next)}
            />
          ))}
          {marriageAnswer === "ya" && (
            <>
              <BirthVerificationCard
                document={adultBirthMarriageDocument}
                selection={selections[adultBirthMarriageDocument.id]}
                result={evaluation.results[adultBirthRequiredDocuments.length]}
                onChange={(next) => updateSelection(adultBirthMarriageDocument.id, next)}
              />
            </>
          )}
        </div>
        <aside className="lg:sticky lg:top-20">
          <BirthVerificationResultPanel
            documents={documents}
            evaluation={evaluation}
            parentClassification={parentClassification}
            requireParentClassification={marriageAnswer !== "tidak"}
            serviceName="NIK Bayi Dewasa"
            pendingRequirementMessage={marriageAnswer === "ya"
              ? "Lengkapi klasifikasi status anak pada kotak di atas sebelum menyatakan berkas siap."
              : "Tentukan terlebih dahulu apakah pemohon melampirkan akta nikah."}
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
      </div>

      {toast && (
        <Toast key={toast.id} icon={toast.icon} onClose={closeToast}>
          {toast.message}
        </Toast>
      )}
    </div>
  );
}
