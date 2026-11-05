import Icon from "./Icon";

type SelectableCardProps = {
  icon: string;
  title: string;
  description: string;
  /** Tag kecil di samping judul (contoh: "SKPWNI"). */
  tag?: string;
  /** Baris ringkasan di bagian bawah kartu (opsional). */
  footer?: { icon: string; label: string };
  /** Teks badge saat kartu tidak terpilih (contoh: "Pilih Layanan"). */
  idleLabel: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
};

/**
 * Kartu pilihan tunggal. Terpilih = biru solid; tidak terpilih = putih netral.
 * Memakai <button aria-pressed> agar bisa difokus dan dioperasikan dengan keyboard.
 */
export default function SelectableCard({
  icon,
  title,
  description,
  tag,
  footer,
  idleLabel,
  selected,
  onSelect,
  className = "",
}: SelectableCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`group relative flex h-full w-full flex-col justify-between rounded-lg border-2 p-8 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3] ${
        selected
          ? "border-[#003F87] bg-[#003F87] text-white shadow-md hover:shadow-xl"
          : "border-[#c2c6d4]/40 bg-white text-[#191c1e] shadow-sm hover:shadow-md"
      } ${className}`}
    >
      <span className="flex w-full flex-col items-start">
        <span className="mb-6 flex w-full items-center justify-between">
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-lg transition-colors ${
              selected ? "bg-white/15 text-white" : "bg-[#e6e8ea] text-[#424752]"
            }`}
          >
            <Icon name={icon} className="text-[32px]" />
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium shadow-sm transition-colors ${
              selected ? "bg-white text-[#003F87]" : "bg-[#e6e8ea] text-[#424752]"
            }`}
          >
            {selected ? (
              <>
                <Icon name="check_circle" className="text-[16px] [font-variation-settings:'FILL'_1]" />
                ✓ Terpilih
              </>
            ) : (
              <>
                <Icon name="touch_app" className="text-[16px]" />
                {idleLabel}
              </>
            )}
          </span>
        </span>

        <span className="mb-2 flex items-center gap-2.5">
          <span className="text-[22px] font-bold tracking-tight">{title}</span>
          {tag && (
            <span
              className={`rounded px-2 py-0.5 text-[11px] font-semibold uppercase transition-colors ${
                selected ? "bg-white/20 text-white" : "bg-[#e6e8ea] text-[#424752]"
              }`}
            >
              {tag}
            </span>
          )}
        </span>

        <span
          className={`block text-sm leading-relaxed transition-colors ${
            selected ? "text-white/80" : "text-[#424752]"
          }`}
        >
          {description}
        </span>
      </span>

      {footer && (
        <span
          className={`mt-4 flex w-full items-center justify-between border-t pt-5 text-xs ${
            selected ? "border-white/20 text-white/90" : "border-[#eceef0] text-[#424752]"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Icon name={footer.icon} className="text-[16px]" />
            {footer.label}
          </span>
          <Icon name="arrow_forward" className="text-[18px]" />
        </span>
      )}
    </button>
  );
}
