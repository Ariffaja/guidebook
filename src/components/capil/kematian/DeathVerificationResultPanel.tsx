import Icon from "@/components/ui/Icon";
import type { DeathVerificationDocument } from "./deathVerificationData";
import {
  TOTAL_DEATH_DOCUMENTS,
  buildDirective,
  type DeathDocumentResult,
  type DeathEvaluation,
  type DeathOverallStatus,
} from "./deathVerificationLogic";

const statusConfig: Record<
  DeathOverallStatus,
  { icon: string; badge: string; box: string; headline: string; description: string }
> = {
  menunggu: {
    icon: "info",
    badge: "bg-[#eceef0] text-[#424752]",
    box: "bg-[#f2f4f6]",
    headline: "MENUNGGU PILIHAN",
    description: "Pilih kondisi data dan lampiran untuk menentukan hasil pemeriksaan.",
  },
  siap: {
    icon: "check_circle",
    badge: "bg-[#90efef] text-[#006e6e]",
    box: "bg-[#e4f8f6]",
    headline: "SIAP DIVERIFIKASI",
    description: "Seluruh berkas memenuhi kriteria pemeriksaan awal.",
  },
  btl: {
    icon: "pending_actions",
    badge: "bg-[#ffdbcc] text-[#722b00]",
    box: "bg-[#fff5ef]",
    headline: "BERKAS TIDAK LENGKAP (BTL)",
    description: "Terdapat berkas yang perlu diperbaiki atau dilengkapi.",
  },
  tdp: {
    icon: "cancel",
    badge: "bg-[#ffdad6] text-[#93000a]",
    box: "bg-[#fff1f0]",
    headline: "TIDAK DAPAT DIPROSES (TDP)",
    description: "Ditemukan data yang tidak sesuai SIAK atau berkas salah unggah.",
  },
};

const checklistConfig: Record<
  DeathDocumentResult,
  { icon: string; iconClass: string; label: string; labelClass: string }
> = {
  pending: { icon: "radio_button_unchecked", iconClass: "text-[#727784]", label: "Menunggu", labelClass: "text-[#424752]" },
  valid: { icon: "check_circle", iconClass: "text-[#006a6a]", label: "Sesuai", labelClass: "font-semibold text-[#006a6a]" },
  tolak: { icon: "cancel", iconClass: "text-[#ba1a1a]", label: "Tolak", labelClass: "font-semibold text-[#ba1a1a]" },
  perbaikan: { icon: "pending", iconClass: "text-[#722b00]", label: "BTL", labelClass: "font-semibold text-[#722b00]" },
};

const sectionLabel = "text-[10px] font-bold uppercase tracking-wider text-[#657181]";

type DeathVerificationResultPanelProps = {
  documents: DeathVerificationDocument[];
  evaluation: DeathEvaluation;
  onCopy: (text: string) => void;
};

/** Ringkasan pemeriksaan, status otomatis, checklist, dan template arahan operator. */
export default function DeathVerificationResultPanel({
  documents,
  evaluation,
  onCopy,
}: DeathVerificationResultPanelProps) {
  const config = statusConfig[evaluation.status];
  const directive = buildDirective(evaluation);

  return (
    <aside className="xl:sticky xl:top-20">
      <section className="flex flex-col gap-4 rounded-xl border border-[#e4e8ed] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className={sectionLabel}>Status Verifikasi</span>
          <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold ${config.badge}`}>
            <Icon name={config.icon} className="text-[13px]" />
            {config.headline}
          </span>
        </div>

        <div role="status" aria-live="polite" className={`rounded-lg p-3 text-[12px] leading-relaxed text-[#424752] ${config.box}`}>
          {config.description}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className={sectionLabel}>Pemeriksaan Lampiran</span>
            <span className="text-[10px] font-semibold text-[#424752]">
              {evaluation.completedCount} / {TOTAL_DEATH_DOCUMENTS} diperiksa
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Progres pemeriksaan dokumen"
            aria-valuemin={0}
            aria-valuemax={TOTAL_DEATH_DOCUMENTS}
            aria-valuenow={evaluation.completedCount}
            className="h-1.5 overflow-hidden rounded-full bg-[#eceef0]"
          >
            <div
              className="h-full rounded-full bg-[#0056B3] transition-all duration-300"
              style={{ width: `${evaluation.percent}%` }}
            />
          </div>
          <ul className="flex flex-col gap-1.5">
            {documents.map((doc, index) => {
              const item = checklistConfig[evaluation.results[index]];
              return (
                <li key={doc.id} className="flex items-center justify-between gap-2 rounded-md bg-[#f2f4f6] px-2.5 py-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon name={item.icon} className={`shrink-0 text-[15px] ${item.iconClass}`} />
                    <span className="truncate text-[11px] text-[#191c1e]">{doc.checklistLabel}</span>
                  </span>
                  <span className={`shrink-0 text-[10px] ${item.labelClass}`}>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-[#e4e8ed] pt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className={sectionLabel}>Template Arahan Operator</span>
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
    </aside>
  );
}
