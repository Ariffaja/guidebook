import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { dafdukServices } from "@/components/dafduk/services";
import PindahKeluarClassification from "@/components/dafduk/PindahKeluarClassification";

type DafdukServicePageProps = {
  params: Promise<{ service: string }>;
};

export async function generateMetadata({ params }: DafdukServicePageProps): Promise<Metadata> {
  const { service: serviceKey } = await params;
  const service = dafdukServices.find((item) => item.key === serviceKey);
  return { title: service ? `${service.title} - GUIDEBOOK ADMINDUK` : "Layanan tidak ditemukan" };
}

export default async function DafdukServicePage({ params }: DafdukServicePageProps) {
  const { service: serviceKey } = await params;
  const service = dafdukServices.find((item) => item.key === serviceKey);
  if (!service) notFound();

  if (service.key === "pindah-keluar") {
    return (
      <AppLayout pageLabel="Pendaftaran Kependudukan">
        <PindahKeluarClassification />
      </AppLayout>
    );
  }

  return (
    <AppLayout pageLabel="Pendaftaran Kependudukan">
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb
          items={[
            { label: "Pendaftaran Kependudukan" },
            { label: service.title },
          ]}
        />
        <section className="mx-auto mt-12 max-w-2xl rounded-xl border border-[#e0e3e5] bg-white p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#e6e8ea] text-[#003F87]">
            <span className="text-[28px]" aria-hidden="true">→</span>
          </span>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0056B3]">
            {service.tag}
          </p>
          <h1 className="mb-3 text-2xl font-bold tracking-tight text-[#191c1e] sm:text-[30px]">
            {service.title}
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-[#59616d]">
            Tahap berikutnya untuk layanan ini belum tersedia. Pilihan layanan Anda sudah tercatat.
          </p>
          <Link
            href="/dafduk"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#003F87] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0056B3]"
          >
            <span aria-hidden="true">←</span> Kembali ke Pilih Layanan
          </Link>
        </section>
      </div>
    </AppLayout>
  );
}
