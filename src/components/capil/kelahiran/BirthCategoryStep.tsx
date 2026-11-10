"use client";

import { useCallback, useState, type ReactNode } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Icon from "@/components/ui/Icon";
import StepNavigation from "@/components/ui/StepNavigation";
import Toast from "@/components/ui/Toast";
import { birthCategories, type BirthCategory } from "./categories";

type BirthCategoryStepProps = {
  onBack: () => void;
  /** Dipanggil saat kategori NIK Bayi Kecil dipilih. */
  onVerifyBayiKecil: () => void;
};

type ToastState = { id: number; icon: string; message: ReactNode };

/**
 * Kartu kategori kelahiran. Dibuat lokal (bukan SelectableCard) karena desain Stitch-nya
 * berbeda: biru #0056B3 dan tag khusus pada setiap kartu.
 */
function BirthCategoryCard({
  category,
  onSelect,
}: {
  category: BirthCategory;
  onSelect: () => void;
}) {
  const idleTag =
    category.tagTone === "warm" ? "bg-[#FFDBCC] text-[#351000]" : "bg-gray-100 text-gray-600";

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex h-full w-full cursor-pointer flex-col justify-between rounded-xl border-2 border-gray-200 bg-white p-8 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:border-[#0056B3] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
    >
      <span className="mb-6 flex w-full items-center justify-between">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors group-hover:bg-blue-50 group-hover:text-[#0056B3]"
        >
          <Icon name={category.icon} className="text-[32px]" />
        </span>
        <span
          className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-semibold text-gray-600 transition-colors group-hover:bg-blue-50 group-hover:text-[#003F87]"
        >
          <Icon name="touch_app" className="text-[16px]" />
          Pilih Kategori
        </span>
      </span>

      <span className="flex flex-col gap-2">
        <span className="flex flex-wrap items-center gap-2">
          <span
            className="text-2xl font-semibold text-gray-900 transition-colors"
          >
            {category.title}
          </span>
          <span
            className={`rounded px-2 py-0.5 text-[11px] font-semibold uppercase transition-colors ${idleTag}`}
          >
            {category.tag}
          </span>
        </span>
        <span
          className="block text-base leading-relaxed text-gray-600 transition-colors"
        >
          {category.description}
        </span>
      </span>
    </button>
  );
}

/**
 * Tahap Capil: pilih kategori kelahiran (NIK Bayi Kecil / NIK Bayi Dewasa).
 * NIK Bayi Kecil lanjut ke Verifikasi Berkas; NIK Bayi Dewasa masih placeholder Toast
 * karena desain dan prosedurnya belum tersedia.
 */
export default function BirthCategoryStep({
  onBack,
  onVerifyBayiKecil,
}: BirthCategoryStepProps) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  function handleSelect(category: BirthCategory) {
    if (category.key === "bayi-kecil") {
      onVerifyBayiKecil();
      return;
    }

    setToast({
      id: Date.now(),
      icon: "info",
      message: (
        <>
          Kategori <strong>{category.title}</strong> dipilih. Halaman panduan berkas belum tersedia.
        </>
      ),
    });
  }

  return (
    <div className="flex w-full flex-col">
      <Breadcrumb
        items={[
          { label: "Pencatatan Sipil", onClick: onBack },
          { label: "Kelahiran", onClick: onBack },
          { label: "Pilih Kategori" },
        ]}
      />

      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px] sm:leading-10">
          Pilih Kategori Pencatatan Kelahiran
        </h1>
        <p className="max-w-3xl text-base text-[#424752]">
          Pilih kategori yang sesuai untuk melihat panduan pemeriksaan berkas dan input SIAK
          selanjutnya.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {birthCategories.map((category) => (
          <BirthCategoryCard
            key={category.key}
            category={category}
            onSelect={() => handleSelect(category)}
          />
        ))}
      </div>

      <StepNavigation back={{ label: "Kembali", onClick: onBack }} />

      {toast && (
        <Toast key={toast.id} icon={toast.icon} onClose={closeToast}>
          {toast.message}
        </Toast>
      )}
    </div>
  );
}
