import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import DafdukWithinVillageVerification from "@/components/dafduk/DafdukWithinVillageVerification";

const regionLabels: Record<string, string> = {
  "dalam-desa-kelurahan": "Dalam Satu Desa / Kelurahan",
  "antar-desa-kelurahan": "Antar Desa / Kelurahan",
  "antar-kecamatan": "Antar Kecamatan",
  "antar-kabupaten-kota": "Antar Kabupaten / Kota",
  "antar-provinsi": "Antar Provinsi",
};

type ClassificationPageProps = {
  params: Promise<{ service: string; region: string }>;
};

export async function generateMetadata({ params }: ClassificationPageProps): Promise<Metadata> {
  const { service, region } = await params;
  const label = service === "pindah-keluar" ? regionLabels[region] : undefined;
  return { title: label ? `${label} - Pindah Keluar` : "Klasifikasi tidak ditemukan" };
}

export default async function ClassificationPage({ params }: ClassificationPageProps) {
  const { service, region } = await params;
  const label = service === "pindah-keluar" ? regionLabels[region] : undefined;
  if (!label) notFound();

  if (
    service === "pindah-keluar" &&
    [
      "dalam-desa-kelurahan",
      "antar-desa-kelurahan",
      "antar-kecamatan",
      "antar-kabupaten-kota",
      "antar-provinsi",
    ].includes(region)
  ) {
    const requiresHouseProof =
      region === "dalam-desa-kelurahan" ||
      region === "antar-desa-kelurahan" ||
      region === "antar-kecamatan";
    return (
      <AppLayout pageLabel="Pendaftaran Kependudukan">
        <DafdukWithinVillageVerification
          classificationTitle={label}
          requiresHouseProof={requiresHouseProof}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout pageLabel="Pendaftaran Kependudukan">
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb
          items={[
            { label: "Pendaftaran Kependudukan" },
            { label: "Pindah Keluar" },
            { label },
          ]}
        />
        <section className="mx-auto mt-12 max-w-2xl rounded-xl border border-[#e0e3e5] bg-white p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#e6e8ea] text-[#003F87]">
            <span className="text-[26px]" aria-hidden="true">✓</span>
          </span>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0056B3]">
            Klasifikasi Perpindahan Dipilih
          </p>
          <h1 className="mb-3 text-2xl font-bold tracking-tight text-[#191c1e] sm:text-[28px]">{label}</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-[#59616d]">
            Tahap verifikasi berkas untuk klasifikasi ini belum tersedia.
          </p>
          <Link
            href="/dafduk/pindah-keluar"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#003F87] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0056B3]"
          >
            <span aria-hidden="true">←</span> Kembali ke Klasifikasi Pindah
          </Link>
        </section>
      </div>
    </AppLayout>
  );
}
