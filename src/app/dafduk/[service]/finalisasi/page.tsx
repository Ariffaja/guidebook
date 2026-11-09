import Link from "next/link";
import { notFound } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default async function FinalisasiPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  if (service !== "pindah-keluar") notFound();

  return (
    <AppLayout pageLabel="Pendaftaran Kependudukan">
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb
          items={[
            { label: "Pendaftaran Kependudukan" },
            { label: "Pindah Keluar" },
            { label: "Finalisasi SIAK" },
          ]}
        />
        <section className="mx-auto mt-12 max-w-2xl rounded-xl border border-[#e0e3e5] bg-white p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#e6e8ea] text-[#003F87]">
            <span className="text-[26px]" aria-hidden="true">✓</span>
          </span>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#006a6a]">
            Verifikasi Berkas Valid
          </p>
          <h1 className="mb-3 text-2xl font-bold tracking-tight text-[#191c1e] sm:text-[28px]">
            Finalisasi SIAK
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-[#59616d]">
            Tahap finalisasi SIAK Terpusat belum tersedia.
          </p>
          <Link
            href="/dafduk/pindah-keluar/klasifikasi/dalam-desa-kelurahan"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#003F87] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0056B3]"
          >
            <span aria-hidden="true">←</span> Kembali ke Verifikasi Berkas
          </Link>
        </section>
      </div>
    </AppLayout>
  );
}
