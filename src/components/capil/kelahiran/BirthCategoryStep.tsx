"use client";

import { useCallback, useState, type ReactNode } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Icon from "@/components/ui/Icon";
import StepNavigation from "@/components/ui/StepNavigation";
import Toast from "@/components/ui/Toast";
import { birthCategories, type BirthCategory, type BirthCategoryKey } from "./categories";

type BirthCategoryStepProps = {
  /** Kategori terpilih; disimpan di CapilModule agar bertahan saat kembali dari tahap verifikasi. */
  selected: BirthCategoryKey | null;
  onSelect: (key: BirthCategoryKey | null) => void;
  onBack: () => void;
  /** Dipanggil saat Lanjutkan dengan NIK Bayi Kecil terpilih. */
  onVerifyBayiKecil: () => void;
};

type ToastState = { id: number; icon: string; message: ReactNode };

/**
 * Kartu kategori kelahiran. Dibuat lokal (bukan SelectableCard) karena desain Stitch-nya
 * berbeda: biru #0056B3, tag per kartu, label "Terpilih" tanpa tanda ✓ ganda, dan bisa dibatalkan.
 */
function BirthCategoryCard({
  category,
  selected,
  onToggle,
}: {
  category: BirthCategory;
  selected: boolean;
  onToggle: () => void;
}) {
  const idleTag =
    category.tagTone === "warm" ? "bg-[#FFDBCC] text-[#351000]" : "bg-gray-100 text-gray-600";

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`group relative flex h-full w-full flex-col justify-between rounded-xl border p-8 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3] ${
        selected
          ? "border-[#0056B3] bg-[#0056B3] text-white shadow-lg"
          : "border-gray-200 bg-white shadow-sm hover:shadow-md"
      }`}
    >
      <span className="mb-6 flex w-full items-center justify-between">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${
            selected ? "bg-white/20 text-white" : "bg-blue-50 text-[#0056B3]"
          }`}
        >
          <Icon name={category.icon} className="text-[32px]" />
        </span>
        <span
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
            selected ? "bg-white text-[#0056B3] shadow-sm" : "bg-gray-100 text-gray-600"
          }`}
        >
          <Icon name={selected ? "check" : "touch_app"} className="text-[16px]" />
          {selected ? "Terpilih" : "Pilih Kategori"}
        </span>
      </span>

      <span className="flex flex-col gap-2">
        <span className="flex flex-wrap items-center gap-2">
          <span
            className={`text-2xl font-semibold transition-colors ${
              selected ? "text-white" : "text-gray-900"
            }`}
          >
            {category.title}
          </span>
          <span
            className={`rounded px-2 py-0.5 text-[11px] font-semibold uppercase transition-colors ${
              selected ? "bg-white/20 text-white" : idleTag
            }`}
          >
            {category.tag}
          </span>
        </span>
        <span
          className={`block text-base leading-relaxed transition-colors ${
            selected ? "text-blue-100" : "text-gray-600"
          }`}
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
  selected,
  onSelect,
  onBack,
  onVerifyBayiKecil,
}: BirthCategoryStepProps) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  function handleToggle(key: BirthCategoryKey) {
    // Klik kartu yang sudah terpilih membatalkan pilihan.
    onSelect(selected === key ? null : key);
  }

  function handleContinue() {
    const category = birthCategories.find((item) => item.key === selected);

    if (!category) {
      setToast({
        id: Date.now(),
        icon: "warning",
        message: "Silakan pilih salah satu kategori terlebih dahulu.",
      });
      return;
    }

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
            selected={selected === category.key}
            onToggle={() => handleToggle(category.key)}
          />
        ))}
      </div>

      <StepNavigation
        back={{ label: "Kembali", onClick: onBack }}
        next={{ label: "Lanjutkan", onClick: handleContinue }}
      />

      {toast && (
        <Toast key={toast.id} icon={toast.icon} onClose={closeToast}>
          {toast.message}
        </Toast>
      )}
    </div>
  );
}
