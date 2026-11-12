import Icon from "@/components/ui/Icon";
import { ClassificationBadge, CategoryBadge } from "./SopBadges";
import type { SopCase } from "./sopTypes";

const sectionLabel =
  "mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#424752]";

type SopCaseDetailProps = {
  sopCase: SopCase | null;
  onCopy: (sopCase: SopCase) => void;
  copied: boolean;
};

/** Panel detail: judul, deskripsi (jika ada), templat asli, dan tombol salin pesan. */
export default function SopCaseDetail({ sopCase, onCopy, copied }: SopCaseDetailProps) {
  if (!sopCase) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg bg-white p-10 text-center shadow-sm">
        <Icon name="touch_app" className="text-[32px] text-[#727784]" />
        <p className="text-sm text-[#424752]">
          Pilih salah satu catatan di daftar untuk melihat templat responsnya.
        </p>
      </div>
    );
  }

  return (
    <article className="flex flex-col rounded-lg bg-white p-6 shadow-md">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#eceef0] pb-4">
        <CategoryBadge category={sopCase.category} />
        <ClassificationBadge classification={sopCase.classification} />
        {sopCase.ref && sopCase.category !== "capil" && (
          <span className="text-xs font-medium text-[#727784]">{sopCase.ref}</span>
        )}
      </div>

      <h2 className="mt-4 text-xl font-semibold leading-snug text-[#191c1e]">{sopCase.title}</h2>

      {sopCase.description && (
        <section className="mt-5">
          <h3 className={sectionLabel}>
            <Icon name="flag" className="text-[16px] text-[#003F87]" />
            Deskripsi Kasus
          </h3>
          <p className="rounded bg-[#f2f4f6] p-3.5 text-[13px] leading-relaxed text-[#424752]">
            {sopCase.description}
          </p>
        </section>
      )}

      <section className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className={`${sectionLabel} mb-0`}>
            <Icon name="chat" className="text-[16px] text-[#003F87]" />
            Templat Respons Operator
          </h3>
          <button
            type="button"
            disabled={!sopCase.template}
            onClick={() => onCopy(sopCase)}
            className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-[#0056B3] transition-colors hover:text-[#003F87] disabled:cursor-not-allowed disabled:text-[#9aa3ad]"
          >
            <Icon name={copied ? "check" : "content_copy"} className="text-[13px]" />
            {copied ? "Tersalin" : "Salin Pesan"}
          </button>
        </div>
        {sopCase.template ? (
          <div className="select-all whitespace-pre-wrap rounded bg-[#f2f4f6] p-4 text-[13px] leading-relaxed text-[#191c1e]">
            {sopCase.template}
          </div>
        ) : (
          <p className="rounded bg-[#f2f4f6] p-4 text-[13px] text-[#424752]">
            Templat belum tersedia untuk catatan ini.
          </p>
        )}
      </section>

      <p className="mt-2 text-[11px] leading-relaxed text-[#727784]">
        Periksa bagian seperti nama, tanggal, atau isian kosong (____) pada templat sebelum digunakan.
      </p>
    </article>
  );
}
