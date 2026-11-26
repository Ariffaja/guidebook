import Icon from "@/components/ui/Icon";
import type { VerificationDocument } from "./birthVerificationData";
import {
  buildDirective,
  type BirthParentClassification,
  type DocumentResult,
  type Evaluation,
  type OverallStatus,
} from "./birthVerificationLogic";

type StatusConfig = {
  box: string;
  frame: string;
  icon: string;
  iconClass: string;
  headline: string;
  headlineClass: string;
  desc: string;
};

const statusConfig: Record<OverallStatus, StatusConfig> = {
  menunggu: {
    box: "bg-[#e6e8ea] text-[#424752]",
    frame: "border-[#dfe3e8] bg-[#f5f6f7] text-[#59616d]",
    icon: "info",
    iconClass: "text-[#59616d]",
    headline: "Menunggu Kelengkapan Berkas",
    headlineClass: "font-semibold text-[#191c1e]",
    desc: "Pilih kondisi lampiran fisik untuk melihat hasil pemeriksaan berkas.",
  },
  siap: {
    box: "bg-[#86e8e2] text-[#004f4f]",
    frame: "border-[#b7e9e5] bg-[#e8faf8] text-[#075c58]",
    icon: "check_circle",
    iconClass: "text-[#006a6a]",
    headline: "SIAP DIVERIFIKASI (VALID)",
    headlineClass: "font-bold text-[#006a6a]",
    desc: "Seluruh tujuh dokumen telah memenuhi kriteria pemeriksaan awal dan dapat ditindaklanjuti operator sesuai prosedur yang berlaku.",
  },
  btl: {
    box: "bg-[#ffdbcc] text-[#7b2f00]",
    frame: "border-[#f2c2a8] bg-[#fff5ef] text-[#833b13]",
    icon: "pending_actions",
    iconClass: "text-[#9a3f0b]",
    headline: "BERKAS TIDAK LENGKAP (BTL)",
    headlineClass: "font-bold text-[#722b00]",
    desc: "Beberapa lampiran fisik perlu diperbaiki karena buram, terpotong, atau belum terbaca jelas.",
  },
  tdp: {
    box: "bg-[#ffdad6] text-[#93000a]",
    frame: "border-[#f2b8b5] bg-[#fff1f0] text-[#93000a]",
    icon: "cancel",
    iconClass: "text-[#ba1a1a]",
    headline: "TIDAK DAPAT DIPROSES (TDP)",
    headlineClass: "font-bold text-[#ba1a1a]",
    desc: "Ditemukan lampiran fisik yang salah unggah, rusak, atau tidak valid.",
  },
};

const checklistConfig: Record<DocumentResult, { iconClass: string; label: string; labelClass: string }> = {
  pending: { iconClass: "text-[#727784]", label: "Belum dipilih", labelClass: "bg-[#e6e8ea] text-[#59616d]" },
  valid: { iconClass: "text-[#006a6a]", label: "✓ Sesuai", labelClass: "bg-[#90efef] text-[#006a6a]" },
  tolak: { iconClass: "text-[#ba1a1a]", label: "Tidak memenuhi (TDP)", labelClass: "bg-[#ffdad6] text-[#93000a]" },
  perbaikan: { iconClass: "text-[#722b00]", label: "Perlu perbaikan (BTL)", labelClass: "bg-[#ffdbcc] text-[#722b00]" },
};

const sectionLabel = "text-[9px] font-bold uppercase tracking-[1.3px] text-[#657181]";

type BirthVerificationResultPanelProps = {
  documents: VerificationDocument[];
  evaluation: Evaluation;
  parentClassification: BirthParentClassification | null;
  requireParentClassification?: boolean;
  serviceName?: string;
  pendingRequirementMessage?: string;
  onCopy: (text: string) => void;
};

/** Ringkasan status, lampiran, dan template arahan operator. */
export default function BirthVerificationResultPanel({
  documents,
  evaluation,
  parentClassification,
  requireParentClassification = true,
  serviceName = "NIK Bayi Kecil",
  pendingRequirementMessage = "Lengkapi klasifikasi status anak pada kotak di atas sebelum menyatakan berkas siap.",
  onCopy,
}: BirthVerificationResultPanelProps) {
  const needsClassification = requireParentClassification && !parentClassification;
  const status = evaluation.status === "siap" && needsClassification ? "menunggu" : evaluation.status;
  const baseConfig = statusConfig[status];
  const config = status === "siap"
    ? { ...baseConfig, desc: `Seluruh ${evaluation.totalCount} dokumen telah memenuhi kriteria pemeriksaan awal dan dapat ditindaklanjuti operator sesuai prosedur yang berlaku.` }
    : baseConfig;
  const directive = status === "menunggu" && evaluation.status === "siap" && needsClassification
    ? pendingRequirementMessage
    : buildDirective(evaluation, serviceName);
  const remaining = evaluation.totalCount - evaluation.completedCount;
  const description =
    status === "menunggu" && evaluation.status === "siap" && needsClassification
      ? pendingRequirementMessage
      : status === "menunggu" && evaluation.completedCount > 0
        ? `Lengkapi ${remaining} berkas tersisa untuk menentukan status validasi akhir.`
      : config.desc;

  return (
    <section className="rounded-xl border border-[#e4e8ed] bg-white p-4 shadow-sm sm:p-5" aria-live="polite">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[1.5px] text-[#657181]">
            Status Verifikasi SIAK
          </p>
          <span className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold ${config.box}`}>
            {config.headline}
          </span>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.box}`}>
          <Icon name={config.icon} className={`text-[23px] ${config.iconClass}`} />
        </span>
      </div>
      <div className={`rounded-lg border p-3 text-[11px] leading-relaxed ${config.frame}`}>
        {description}
      </div>

      <div className="mt-5">
        <h3 className={`mb-2 ${sectionLabel}`}>Pemeriksaan Lampiran</h3>
        <div className="flex flex-col gap-2">
          {documents.map((doc, index) => {
            const result = evaluation.results[index];
            const item = checklistConfig[result];
            const value = item.label;
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between gap-2 rounded-md bg-[#f5f6f7] px-2.5 py-2"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Icon name={doc.icon} className={`shrink-0 text-[15px] ${item.iconClass}`} />
                  <span className="truncate text-[11px] text-[#191c1e]">{doc.checklistLabel}</span>
                </span>
                <span className={`shrink-0 rounded px-1.5 py-1 text-[9px] font-semibold ${item.labelClass}`}>
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 border-t border-[#e4e8ed] pt-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className={sectionLabel}>Template Arahan Pesan Operator (PLAVON)</h3>
          <button
            type="button"
            onClick={() => onCopy(directive)}
            className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-[#0056B3] transition-colors hover:text-[#003F87] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
          >
            <Icon name="content_copy" className="text-[13px]" /> Salin Pesan
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border border-[#e7eaee] bg-[#f8f9fa] p-3 text-[10px] leading-relaxed text-[#424752]">
          {directive}
        </div>
      </div>


    </section>
  );
}
