import type { Metadata } from "next";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Tentang - GUIDEBOOK ADMINDUK",
};

const modules = [
  {
    icon: "badge",
    label: "Dafduk",
    title: "Pendaftaran Kependudukan",
    description:
      "Panduan layanan pindah keluar dan pindah datang, mencakup pemeriksaan kelengkapan dokumen pada alur PLAVON ke SIAK.",
    href: "/dafduk",
  },
  {
    icon: "assignment",
    label: "Capil",
    title: "Pencatatan Sipil",
    description:
      "Panduan pelaporan peristiwa penting kependudukan, yaitu kelahiran dan kematian, beserta pemeriksaan berkas pendukungnya.",
    href: "/capil",
  },
  {
    icon: "menu_book",
    label: "SOP Directory",
    title: "Catatan Kasus dan Templat Respons",
    description:
      "Kumpulan catatan kasus beserta templat respons operasional yang dapat dicari, disaring, dan disalin.",
    href: "/sop-directory",
  },
] as const;

export default function TentangPage() {
  return (
    <AppLayout pageLabel="Tentang">
      <div className="mx-auto flex w-full max-w-4xl flex-col pb-8">
        <div className="mb-8">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#d7e2ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#001a40]">
            <Icon name="info" className="text-[14px]" />
            Tentang Aplikasi
          </span>
          <h1 className="mb-3 text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px] sm:leading-10">
            GUIDEBOOK ADMINDUK
          </h1>
          <p className="text-base leading-relaxed text-[#424752]">
            Website panduan operasional internal untuk operator Dinas Kependudukan dan Pencatatan Sipil
            Kabupaten Sidoarjo.
          </p>
        </div>

        <section className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-[#191c1e]">Tujuan</h2>
          <p className="text-sm leading-relaxed text-[#424752]">
            Aplikasi ini membantu operator memahami prosedur pelayanan administrasi kependudukan melalui
            PLAVON dan SIAK. Operator dapat mengakses panduan operasional dan templat respons dalam satu
            tempat.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-[#191c1e]">Isi Aplikasi</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {modules.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col gap-2 rounded-lg border border-[#c2c6d4]/40 bg-white p-5 shadow-sm transition-all hover:border-[#0056B3] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d7e2ff] text-[#001a40]">
                  <Icon name={item.icon} className="text-[20px]" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0056B3]">
                  {item.label}
                </span>
                <span className="text-base font-semibold text-[#191c1e]">{item.title}</span>
                <span className="text-sm leading-relaxed text-[#424752]">{item.description}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="flex items-start gap-3 rounded-lg bg-[#f2f4f6] p-5">
          <Icon name="info" className="mt-0.5 shrink-0 text-[20px] text-[#003F87]" />
          <div className="flex flex-col gap-1 text-sm leading-relaxed text-[#424752]">
            <span className="font-semibold text-[#191c1e]">Perlu diketahui</span>
            <span>
              Website ini berfungsi sebagai panduan operasional dan dokumentasi alur kerja. Website ini
              bukan sistem pemrosesan data kependudukan dan tidak terhubung langsung dengan PLAVON maupun
              SIAK.
            </span>
            <span>
              Catatan pada SOP Directory adalah catatan yang saat ini terkumpul, bukan keseluruhan kasus
              operasional.
            </span>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
