import Icon from "@/components/ui/Icon";
import MobileNav from "./MobileNav";

type HeaderProps = {
  /** Penanda halaman di samping judul, contoh: "Beranda Panduan". */
  pageLabel: string;
};

export default function Header({ pageLabel }: HeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 shadow-sm backdrop-blur-md sm:px-8 lg:left-72">
      <div className="flex min-w-0 items-center gap-3">
        <MobileNav />
        <span className="truncate text-base font-semibold text-slate-800 sm:text-lg">
          Guidebook: PLAVON ke SIAK
        </span>
        <Icon name="chevron_right" className="hidden text-[18px] text-slate-400 sm:inline" />
        <span className="hidden rounded-full border border-blue-200/60 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#0056B3] sm:inline">
          {pageLabel}
        </span>
      </div>

      {/* Kontrol visual saja (belum ada fungsi) sesuai referensi desain */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          title="Notifikasi"
          aria-label="Notifikasi"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
        >
          <Icon name="notifications" className="text-[20px]" />
        </button>
        <button
          type="button"
          title="Pengaturan"
          aria-label="Pengaturan"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
        >
          <Icon name="settings" className="text-[20px]" />
        </button>
        <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#003F87] text-white shadow-sm">
          <Icon name="person" className="text-[18px]" />
        </div>
      </div>
    </header>
  );
}
