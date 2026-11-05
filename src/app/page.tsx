import AppLayout from "@/components/layout/AppLayout";
import ServiceCard from "@/components/home/ServiceCard";

const services = [
  {
    href: "/dafduk",
    icon: "badge",
    tone: "blue",
    badge: "Bidang 01",
    label: "Layanan Dafduk",
    title: "Pendaftaran Kependudukan",

    features: [
      "Verifikasi Berkas KK & Surat Pindah",
      "Klasifikasi Kepindahan Sidoarjo & Antar Wilayah",
      "Sinkronisasi Status PLAVON ke SIAK",
    ],
  },
  {
    href: "/capil",
    icon: "assignment",
    tone: "teal",
    badge: "Bidang 02",
    label: "Layanan Capil",
    title: "Pencatatan Sipil",

    features: [
      "Verifikasi Berkas Kelahiran (6 Dokumen Wajib)",
      "Verifikasi Pelaporan Kematian & Saksi",
      "Hasil Pemeriksaan Otomatis (BTL, TDP, Siap)",
    ],
  },
] as const;

export default function HomePage() {
  return (
    <AppLayout pageLabel="Beranda Panduan">
      <div className="mx-auto mb-10 max-w-2xl pt-4 text-center sm:mb-12">
        <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
          Panduan Kerja Administrasi Kependudukan
        </h1>
        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
          Pilih bidang layanan untuk meninjau standar operasional, verifikasi kelengkapan berkas,
          dan tata cara sinkronisasi data pemohon.
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 sm:gap-8 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.href} {...service} features={[...service.features]} />
        ))}
      </div>
    </AppLayout>
  );
}
