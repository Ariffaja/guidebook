"use client";

import { useCallback, useState, type ReactNode } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Icon from "@/components/ui/Icon";
import PageIntro from "@/components/ui/PageIntro";
import SelectableCard from "@/components/ui/SelectableCard";
import StepNavigation from "@/components/ui/StepNavigation";
import Toast from "@/components/ui/Toast";
import { dafdukServices, type DafdukServiceKey } from "./services";

type ToastState = { id: number; message: ReactNode };

export default function DafdukServiceSelection() {
  const [selected, setSelected] = useState<DafdukServiceKey>("pindah-keluar");
  const [toast, setToast] = useState<ToastState | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  function handleContinue() {
    const service = dafdukServices.find((item) => item.key === selected);
    if (!service) return;
    // Placeholder sesuai HTML sumber: halaman verifikasi berkas belum tersedia.
    setToast({
      id: Date.now(),
      message: (
        <>
          Layanan <strong>{service.toastName}</strong> dipilih. Membuka tahap verifikasi berkas...
        </>
      ),
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-[1080px] flex-col pb-12">
      <Breadcrumb items={[{ label: "Pendaftaran Kependudukan" }, { label: "Pilih Layanan" }]} />

      <PageIntro
        icon="move_up"
        pill="Layanan Mutasi Penduduk"
        title="Pilih Layanan Pendaftaran Penduduk"
      />

      <div className="mb-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        {dafdukServices.map((service) => (
          <SelectableCard
            key={service.key}
            icon={service.icon}
            title={service.title}
            tag={service.tag}
            description={service.description}
            footer={service.footer}
            idleLabel="Pilih Layanan"
            selected={selected === service.key}
            onSelect={() => setSelected(service.key)}
            className="min-h-[300px]"
          />
        ))}
      </div>

      <div className="mb-8 flex items-start gap-3.5 rounded-lg border border-[#eceef0] bg-[#f2f4f6] p-4">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#003F87]/10 text-[#003F87]">
          <Icon name="info" className="text-[20px]" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold text-[#191c1e]">
            Petunjuk Integrasi SIAK Terpusat
          </span>
          <span className="text-[13px] leading-relaxed text-[#424752]">
            Sesuai Permendagri No. 108 Tahun 2019, pemohon perpindahan penduduk wajib memiliki status
            kependudukan yang aktif dan bebas sangkutan data ganda sebelum SKPWNI diterbitkan di SIAK
            Terpusat.
          </span>
        </div>
      </div>

      <StepNavigation
        back={{ label: "Kembali ke Beranda", href: "/" }}
        next={{ label: "Lanjutkan", onClick: handleContinue }}
      />

      {toast && (
        <Toast key={toast.id} icon="check_circle" onClose={closeToast}>
          {toast.message}
        </Toast>
      )}
    </div>
  );
}
