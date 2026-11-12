import { sopClassifications } from "./sopTypes";
import type { ClassificationFilter } from "./sopFilter";

type SopFilterBarProps = {
  classification: ClassificationFilter;
  onChange: (value: ClassificationFilter) => void;
  counts: Record<ClassificationFilter, number>;
  shown: number;
  total: number;
};

const chipBase =
  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3] disabled:cursor-not-allowed disabled:opacity-40";

/** Chip filter klasifikasi dan penghitung hasil. */
export default function SopFilterBar({
  classification,
  onChange,
  counts,
  shown,
  total,
}: SopFilterBarProps) {
  const options: { value: ClassificationFilter; label: string; hint?: string }[] = [
    { value: "all", label: "Semua Klasifikasi" },
    ...sopClassifications.map((item) => ({ value: item.value, label: item.value, hint: item.hint })),
  ];

  return (
    <div className="mb-5 flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-[#727784]">
          Klasifikasi
        </span>
        {options.map((option) => {
          const active = classification === option.value;
          return (
            <button
              key={option.value}
              type="button"
              title={option.hint}
              aria-pressed={active}
              disabled={counts[option.value] === 0 && !active}
              onClick={() => onChange(active && option.value !== "all" ? "all" : option.value)}
              className={`${chipBase} ${
                active
                  ? "bg-[#003F87] text-white"
                  : "bg-[#f2f4f6] text-[#424752] hover:bg-[#e6e8ea]"
              }`}
            >
              {option.label} ({counts[option.value]})
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[#424752]" aria-live="polite">
        Menampilkan <span className="font-semibold text-[#191c1e]">{shown}</span> dari {total} catatan
      </p>
    </div>
  );
}
