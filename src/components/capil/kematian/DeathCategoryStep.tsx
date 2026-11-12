"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Icon from "@/components/ui/Icon";
import PageIntro from "@/components/ui/PageIntro";
import StepNavigation from "@/components/ui/StepNavigation";
import Toast from "@/components/ui/Toast";
import { deathCategories, type DeathCategoryKey } from "./categories";

type DeathCategoryStepProps = {
  onBack: () => void;
  /** Dipanggil saat kategori yang sudah punya halaman Verifikasi Berkas dipilih. */
  onOpenVerification: (key: DeathCategoryKey) => void;
};

type ToastState = { id: number; icon: string; message: ReactNode };

/** Kategori yang sudah memiliki halaman Verifikasi Berkas (sesuai HTML sumber). */
const verificationAvailable: DeathCategoryKey[] = ["ktp-el-modern"];

/**
 * Tahap 2 Capil: pilih kategori kematian.
 * Hanya kategori KTP-el yang membuka Verifikasi Berkas; kategori lain menampilkan Toast
 * karena desain dan prosedurnya belum tersedia di sumber.
 */
export default function DeathCategoryStep({ onBack, onOpenVerification }: DeathCategoryStepProps) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastId = useRef(0);
  const closeToast = useCallback(() => setToast(null), []);

  function handleOpen(key: DeathCategoryKey, title: string) {
    if (verificationAvailable.includes(key)) {
      onOpenVerification(key);
      return;
    }
    setToast({
      id: ++toastId.current,
      icon: "info",
      message: (
        <>
          Fitur verifikasi berkas untuk kategori <strong>{title}</strong> belum tersedia.
        </>
      ),
    });
  }

  return (
    <div className="flex w-full flex-col">
      <Breadcrumb
        items={[
          { label: "Pencatatan Sipil", onClick: onBack },
          { label: "Kematian", onClick: onBack },
          { label: "Pilih Kategori" },
        ]}
      />

      <PageIntro
        icon="shield_moon"
        pill="Pencatatan Kematian"
        title="Pilih Kategori Pencatatan Kematian"
        description="Pilih kondisi dan kriteria jenazah untuk mendapatkan panduan langkah pencatatan SIAK yang tepat."
      />

      <div className="mb-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        {deathCategories.map((category) => (
          <button
            type="button"
            key={category.key}
            onClick={() => handleOpen(category.key, category.title)}
            className="group relative flex h-full w-full cursor-pointer flex-col justify-between rounded-lg border-2 border-[#dfe3e8] bg-white p-6 text-left shadow-sm transition-all duration-200 hover:z-10 hover:-translate-y-1 hover:scale-[1.01] hover:border-[#0056B3] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
          >
            <span className="block">
              <span className="mb-4 flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded bg-[#e6e8ea] text-[#424752] transition-colors group-hover:bg-[#d7e2ff] group-hover:text-[#003F87]"
                >
                  <Icon name={category.icon} className="text-[24px]" />
                </span>
                <span
                  className="rounded-full bg-[#e6e8ea] px-2.5 py-0.5 text-[11px] font-semibold text-[#424752] transition-colors group-hover:bg-[#d7e2ff] group-hover:text-[#003F87]"
                >
                  {category.badge}
                </span>
              </span>
              <span className="mb-2 block text-lg font-bold text-[#191c1e]">{category.title}</span>
              <span className="block text-sm leading-relaxed text-[#424752]">
                {category.description}
              </span>
            </span>
            <span className="mt-6 flex w-full items-center justify-between border-t border-[#e6e8ea] pt-4 text-[13px] font-semibold text-[#003F87]">
              <span>Buka Panduan</span>
              <Icon
                name="arrow_forward"
                className="text-[18px] transition-transform group-hover:translate-x-1"
              />
            </span>
          </button>
        ))}
      </div>

      <StepNavigation back={{ label: "Kembali ke Pilih Layanan", onClick: onBack }} />

      {toast && (
        <Toast key={toast.id} icon={toast.icon} onClose={closeToast}>
          {toast.message}
        </Toast>
      )}
    </div>
  );
}
