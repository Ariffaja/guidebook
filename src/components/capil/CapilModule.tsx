"use client";

import { useState } from "react";
import BirthCategoryStep from "./kelahiran/BirthCategoryStep";
import BirthVerificationStep from "./kelahiran/BirthVerificationStep";
import DeathCategoryStep from "./kematian/DeathCategoryStep";
import DeathVerificationStep from "./kematian/DeathVerificationStep";
import ServiceStep from "./ServiceStep";
import type { CapilServiceKey } from "./services";
import { deathCategories, type DeathCategoryKey } from "./kematian/categories";

type CapilView =
  | "layanan"
  | "kategori-kematian"
  | "verifikasi-kematian"
  | "kategori-kelahiran"
  | "verifikasi-bayi-kecil";

/** Pemegang state modul Capil: pilihan layanan, kategori, dan tahap yang tampil. */
export default function CapilModule() {
  const [view, setView] = useState<CapilView>("layanan");
  const [deathCategory, setDeathCategory] = useState<DeathCategoryKey | null>(null);

  const deathCategoryTitle =
    deathCategories.find((category) => category.key === deathCategory)?.title ?? "";
  // Halaman verifikasi memakai layout dua kolom sehingga membutuhkan wadah yang lebih lebar.
  const isWideView = view === "verifikasi-bayi-kecil" || view === "verifikasi-kematian";

  function goTo(next: CapilView) {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleServiceSelect(service: CapilServiceKey) {
    goTo(service === "kematian" ? "kategori-kematian" : "kategori-kelahiran");
  }

  function handleOpenDeathVerification(key: DeathCategoryKey) {
    setDeathCategory(key);
    goTo("verifikasi-kematian");
  }

  return (
    <div
      className={`mx-auto flex w-full flex-col pb-12 ${isWideView ? "max-w-none" : "max-w-[1080px]"}`}
    >
      {view === "layanan" && (
        <ServiceStep onSelect={handleServiceSelect} />
      )}
      {view === "kategori-kematian" && (
        <DeathCategoryStep
          onBack={() => goTo("layanan")}
          onOpenVerification={handleOpenDeathVerification}
        />
      )}
      {view === "verifikasi-kematian" && deathCategory && (
        <DeathVerificationStep
          categoryTitle={deathCategoryTitle}
          onBackToService={() => goTo("layanan")}
          onBackToCategory={() => goTo("kategori-kematian")}
        />
      )}
      {view === "kategori-kelahiran" && (
        <BirthCategoryStep
          onBack={() => goTo("layanan")}
          onVerifyBayiKecil={() => goTo("verifikasi-bayi-kecil")}
        />
      )}
      {view === "verifikasi-bayi-kecil" && (
        <BirthVerificationStep
          onBackToService={() => goTo("layanan")}
          onBackToCategory={() => goTo("kategori-kelahiran")}
        />
      )}
    </div>
  );
}
