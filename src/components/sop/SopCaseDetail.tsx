import Icon from "@/components/ui/Icon";
import { ClassificationBadge, CategoryBadge } from "./SopBadges";
import type { SopCase } from "./sopTypes";

const sectionLabel =
  "mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#424752]";

type SopCaseDetailProps = {
  sopCase: SopCase | null;
  onCopy: (sopCase: SopCase) => void;
};

/** Panel detail: judul, deskripsi (jika ada), templat asli, dan tombol Salin Templat. */
export default function SopCaseDetail({ sopCase, onCopy }: SopCaseDetailProps) {
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
        {sopCase.ref && <span className="text-xs font-medium text-[#727784]">{sopCase.ref}</span>}
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
        <h3 className={sectionLabel}>
          <Icon name="chat" className="text-[16px] text-[#003F87]" />
          Templat Respons Operator
        </h3>
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

      <button
        type="button"
        disabled={!sopCase.template}
        onClick={() => onCopy(sopCase)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#0056B3] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#003F87] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon name="content_copy" className="text-[18px]" />
        Salin Templat
      </button>
      <p className="mt-2 text-[11px] leading-relaxed text-[#727784]">
        Periksa bagian seperti nama, tanggal, atau isian kosong (____) pada templat sebelum digunakan.
      </p>
    </article>
  );
}
