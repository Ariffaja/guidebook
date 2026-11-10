"use client";

import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Icon from "@/components/ui/Icon";
import PageIntro from "@/components/ui/PageIntro";
import StepNavigation from "@/components/ui/StepNavigation";

const classifications = [
  {
    key: "dalam-desa-kelurahan",
    icon: "person_pin_circle",
    title: "Dalam Satu Desa / Kelurahan",
    tag: "Tingkat Desa / RT/RW",
    description:
      "Perpindahan alamat antar RT/RW dalam satu desa atau kelurahan yang sama. Tidak memerlukan penerbitan SKPWNI, cukup pembaruan elemen KK.",
  },
  {
    key: "antar-desa-kelurahan",
    icon: "alt_route",
    title: "Antar Desa / Kelurahan",
    tag: "Dalam Satu Kecamatan",
    description:
      "Perpindahan penduduk dari satu desa/kelurahan ke desa/kelurahan lain yang masih dalam lingkup satu kecamatan yang sama.",
  },
  {
    key: "antar-kecamatan",
    icon: "location_city",
    title: "Antar Kecamatan",
    tag: "Dalam Satu Kab / Kota",
    description:
      "Perpindahan domisili dari satu kecamatan ke kecamatan lain di wilayah kabupaten/kota yang sama.",
  },
  {
    key: "antar-kabupaten-kota",
    icon: "location_on",
    title: "Antar Kabupaten / Kota",
    tag: "Dalam Satu Provinsi",
    description:
      "Perpindahan domisili antar kabupaten atau kota yang masih berada dalam satu wilayah provinsi yang sama.",
  },
  {
    key: "antar-provinsi",
    icon: "public",
    title: "Antar Provinsi",
    tag: "Lintas Provinsi Nasional",
    description:
      "Perpindahan penduduk lintas batas provinsi di seluruh wilayah NKRI. Memerlukan penyesuaian database kependudukan nasional.",
  },
];

export default function PindahKeluarClassification() {
  const router = useRouter();

  return (
    <div className="mx-auto flex w-full max-w-[1080px] flex-col pb-12">
      <Breadcrumb
        items={[
          { label: "Pendaftaran Kependudukan", onClick: () => router.push("/dafduk") },
          { label: "Pindah Keluar" },
          { label: "Pilih Klasifikasi Pindah" },
        ]}
      />

      <PageIntro
        icon="holiday_village"
        pill="Klasifikasi Perpindahan Penduduk"
        title="Pilih Klasifikasi Pindah"
        description="Tentukan cakupan wilayah tujuan perpindahan penduduk untuk menentukan persyaratan berkas, formulir, dan alur penerbitan SKPWNI di SIAK Terpusat."
      />

      <div className="mx-auto mb-8 flex w-full max-w-[900px] flex-col gap-2.5" aria-label="Pilihan klasifikasi perpindahan">
        {classifications.map((item) => (
          <button
            key={item.key}
            type="button"
            data-route-href={`/dafduk/pindah-keluar/klasifikasi/${item.key}`}
            onClick={() => router.push(`/dafduk/pindah-keluar/klasifikasi/${item.key}`)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 border-[#dfe3e8] bg-white px-3 py-2.5 text-left shadow-sm transition-all duration-200 hover:z-10 hover:scale-[1.01] hover:border-[#0056B3] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3] sm:px-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e6e8ea] text-[#424752] transition-colors group-hover:bg-[#d7e2ff] group-hover:text-[#003F87]">
              <Icon name={item.icon} className="text-[21px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-[14px] font-bold text-[#191c1e]">{item.title}</span>
                <span className="rounded bg-[#e6e8ea] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#424752]">
                  {item.tag}
                </span>
              </span>
              <span className="block text-[11px] leading-relaxed text-[#424752]">{item.description}</span>
            </span>
            <Icon
              name="arrow_forward"
              className="shrink-0 text-[17px] text-[#424752] transition-transform group-hover:translate-x-1 group-hover:text-[#003F87]"
            />
          </button>
        ))}
      </div>

      <StepNavigation back={{ label: "Kembali ke Pilih Layanan", href: "/dafduk" }} />
    </div>
  );
}
