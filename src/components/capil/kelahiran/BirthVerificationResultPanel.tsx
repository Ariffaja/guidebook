import Icon from "@/components/ui/Icon";
import type { VerificationDocument } from "./birthVerificationData";
import {
  TOTAL_DOCUMENTS,
  buildDirective,
  type DocumentResult,
  type Evaluation,
  type OverallStatus,
} from "./birthVerificationLogic";

const statusConfig: Record<
  OverallStatus,
  { box: string; icon: string; iconClass: string; headline: string; headlineClass: string; desc: string }
> = {
  menunggu: {
    box: "bg-[#f2f4f6]",
    icon: "more_horiz",
    iconClass: "text-[#727784]",
    headline: "Menunggu Kelengkapan Berkas",
    headlineClass: "font-semibold text-[#191c1e]",
    desc: "",
  },
  siap: {
    box: "bg-[#90efef] text-[#006e6e]",
    icon: "check_circle",
    iconClass: "text-[#006a6a]",
    headline: "SIAP DIVERIFIKASI (VALID)",
    headlineClass: "font-bold text-[#006a6a]",
    desc: "Seluruh enam dokumen telah memenuhi kriteria pemeriksaan awal dan dapat ditindaklanjuti operator sesuai prosedur yang berlaku.",
  },
  btl: {
    box: "bg-[#ffdbcc] text-[#351000]",
    icon: "pending_actions",
    iconClass: "text-[#722b00]",
    headline: "BERKAS TIDAK LENGKAP (BTL)",
    headlineClass: "font-bold text-[#722b00]",
    desc: "Beberapa dokumen memerlukan perbaikan foto atau penyesuaian penulisan teks sebelum dapat dimasukkan ke SIAK.",
  },
  tdp: {
    box: "bg-[#ffdad6] text-[#93000a]",
    icon: "cancel",
    iconClass: "text-[#ba1a1a]",
    headline: "TIDAK DAPAT DIPROSES (TDP)",
    headlineClass: "font-bold text-[#ba1a1a]",
    desc: "Ditemukan dokumen dengan data esensial kosong atau dokumen yang salah unggah.",
  },
};

const categories: { status: Exclude<OverallStatus, "menunggu">; icon: string; iconClass: string; label: string; activeBg: string }[] = [
  { status: "siap", icon: "check_circle", iconClass: "text-[#006a6a]", label: "Siap Diverifikasi", activeBg: "bg-[#90efef]" },
  { status: "btl", icon: "pending_actions", iconClass: "text-[#722b00]", label: "BTL (Perbaikan)", activeBg: "bg-[#ffdbcc]" },
  { status: "tdp", icon: "cancel", iconClass: "text-[#ba1a1a]", label: "TDP (Tolak)", activeBg: "bg-[#ffdad6]" },
];

const checklistConfig: Record<
  DocumentResult,
  { icon: string; iconClass: string; label: string; labelClass: string; item: string }
> = {
  pending: { icon: "radio_button_unchecked", iconClass: "text-[#727784]", label: "Menunggu", labelClass: "text-[#424752]", item: "bg-[#f2f4f6]" },
  valid: { icon: "check_circle", iconClass: "text-[#006a6a]", label: "Sesuai", labelClass: "font-bold text-[#006a6a]", item: "bg-[#eceef0]" },
  tolak: { icon: "cancel", iconClass: "text-[#ba1a1a]", label: "Tolak", labelClass: "font-bold text-[#ba1a1a]", item: "bg-[#e6e8ea]" },
  perbaikan: { icon: "pending", iconClass: "text-[#722b00]", label: "Perbaikan (BTL)", labelClass: "font-bold text-[#722b00]", item: "bg-[#e6e8ea]" },
};

const sectionLabel = "text-[11px] font-bold uppercase tracking-wider text-[#424752]";

type BirthVerificationResultPanelProps = {
  documents: VerificationDocument[];
  evaluation: Evaluation;
  onCopy: (text: string) => void;
};

/** Panel kanan: status sistem, kategori, template arahan, checklist, dan petunjuk operator. */
export default function BirthVerificationResultPanel({
  documents,
  evaluation,
  onCopy,
}: BirthVerificationResultPanelProps) {
  const config = statusConfig[evaluation.status];
  const remaining = TOTAL_DOCUMENTS - evaluation.completedCount;
  const description =
    evaluation.status === "menunggu"
      ? evaluation.completedCount === 0
        ? "Lengkapi kondisi pemeriksaan dokumen untuk melihat hasil."
        : `Lengkapi ${remaining} berkas tersisa untuk menentukan status validasi akhir.`
      : config.desc;
  const directive = buildDirective(evaluation);

  return (
    <div className="flex flex-col gap-5 xl:sticky xl:top-20">
      <div className="flex flex-col gap-5 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Icon name="verified" className="text-[24px] text-[#003F87]" />
              <h2 className="text-2xl font-semibold text-[#191c1e]">Hasil Pemeriksaan</h2>
            </div>
            <span className="rounded bg-[#eceef0] px-2 py-0.5 font-mono text-[11px] text-[#424752]">
              AUTO-DETECTION
            </span>
          </div>
          <span className="text-[13px] text-[#424752]">
            Deteksi sistem otomatis sesuai kombinasi berkas. Sistem mendeteksi status berdasarkan kombinasi
            kondisi input dan gambar pada keenam berkas.
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className={sectionLabel}>STATUS SISTEM TERDETEKSI</span>
          <div
            role="status"
            aria-live="polite"
            className={`flex items-start gap-3 rounded-lg p-4 transition-all duration-300 ${config.box}`}
          >
            <Icon name={config.icon} className={`mt-0.5 text-[24px] ${config.iconClass}`} />
            <div className="flex flex-col gap-0.5">
              <span className={`text-[15px] ${config.headlineClass}`}>{config.headline}</span>
              <span className="text-[13px] text-[#424752]">{description}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className={sectionLabel}>Kategori Status SIAK</span>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((category) => {
              const active = evaluation.status === category.status;
              return (
                <div
                  key={category.status}
                  className={`rounded p-2.5 text-center transition-all ${
                    active ? `${category.activeBg} font-bold` : "bg-[#eceef0] opacity-40"
                  }`}
                >
                  <Icon
                    name={category.icon}
                    className={`mx-auto mb-1 block text-[18px] ${category.iconClass}`}
                  />
                  <span className="block text-[11px] font-semibold leading-tight text-[#191c1e]">
                    {category.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={sectionLabel}>Template Arahan Pesan Operator</span>
            <button
              type="button"
              onClick={() => onCopy(directive)}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#003F87] hover:text-[#0056B3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
            >
              <Icon name="content_copy" className="text-[14px]" /> Salin
            </button>
          </div>
          <div className="min-h-[96px] select-all whitespace-pre-wrap rounded bg-[#f2f4f6] p-3.5 font-mono text-xs leading-relaxed text-[#424752]">
            {directive}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <div className="mb-1 flex items-center justify-between">
            <span className={sectionLabel}>Checklist Verifikasi 6 Dokumen</span>
            <span className="font-mono text-[11px] font-bold text-[#003F87]">
              {evaluation.completedCount} / {TOTAL_DOCUMENTS} DIPERIKSA
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            {documents.map((doc, index) => {
              const item = checklistConfig[evaluation.results[index]];
              return (
                <li
                  key={doc.id}
                  className={`flex items-center justify-between rounded p-2 transition-colors ${item.item}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name={item.icon} className={`text-[18px] ${item.iconClass}`} />
                    <span className="text-[13px] text-[#191c1e]">
                      {doc.id}. {doc.checklistLabel}
                    </span>
                  </div>
                  <span className={`text-[11px] font-semibold ${item.labelClass}`}>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg bg-[#f2f4f6] p-4">
        <Icon name="help_center" className="mt-0.5 shrink-0 text-[20px] text-[#003F87]" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold text-[#191c1e]">Petunjuk Operasional NIK Bayi Kecil</span>
          <span className="text-xs leading-relaxed text-[#424752]">
            Data NIK baru akan dibuat otomatis oleh subsistem SIAK Terpusat setelah Surat Keterangan
            Kelahiran dan status pernikahan orang tua terverifikasi sah.
          </span>
        </div>
      </div>
    </div>
  );
}
