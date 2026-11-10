"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Icon from "@/components/ui/Icon";

const kkOptions = [
  {
    key: "original",
    icon: "verified",
    title: "Asli / terbaca jelas",
    description:
      "Dokumen KK asli atau cetakan digital TTE barcode resmi Dukcapil terbaca tajam dan NIK seluruh anggota keluarga sinkron.",
  },
  {
    key: "blurred",
    icon: "visibility_off",
    title: "Buram / tidak terbaca",
    description:
      "Resolusi scan rendah, foto terpotong, atau barcode/NIK kabur sehingga data keluarga tidak dapat divalidasi operator.",
  },
  {
    key: "photocopy",
    icon: "file_copy",
    title: "Fotocopy",
    description:
      "Lampiran berupa fotokopi hitam putih tanpa legalisir basah / bukan dokumen asli berkode QR valid.",
  },
  {
    key: "not-applicant",
    icon: "cancel",
    title: "Bukan milik pemohon",
    description:
      "Lampiran KK orang lain, salah unggah berkas, atau identitas di dalam berkas tidak berkorelasi dengan pemohon PLAVON.",
  },
] as const;

const houseOptions = [
  {
    key: "shm-valid",
    icon: "verified",
    title: "SHM atas nama pemohon atau anggota keluarga",
    description:
      "Sertifikat Hak Milik (SHM) sah tercantum nama pemohon atau salah satu anggota keluarga dalam KK yang berpindah.",
  },
  {
    key: "shm-pending",
    icon: "pending",
    title: "SHM belum balik nama",
    description:
      "Nama di SHM berbeda dengan pemohon. Memerlukan lampiran tambahan berupa Akta Jual Beli (AJB) / Surat Keterangan Waris.",
  },
  {
    key: "pbb-valid",
    icon: "receipt_long",
    title: "PBB atas nama pemohon atau anggota keluarga",
    description:
      "Bukti lunas Pajak Bumi dan Bangunan (PBB) tahun berjalan atas nama pemohon atau anggota keluarga di alamat tujuan.",
  },
  {
    key: "pbb-pending",
    icon: "pending",
    title: "PBB belum balik nama",
    description:
      "Objek pajak PBB belum disesuaikan ke nama pemohon. Wajib dilengkapi bukti peralihan hak atau surat keterangan desa/kelurahan.",
  },
  {
    key: "statement",
    icon: "assignment_turned_in",
    title: "Surat pernyataan tidak keberatan alamat rumah digunakan",
    description:
      "Surat persetujuan dari pemilik rumah asli bermaterai cukup (Rp 10.000) bagi pemohon yang menumpang / sewa rumah.",
  },
  {
    key: "marriage",
    icon: "favorite",
    title: "Akta nikah",
    description: "Khusus kepindahan mengikuti pasangan dengan rumah bersama.",
  },
] as const;

type KkCondition = (typeof kkOptions)[number]["key"] | null;
type HouseCondition = (typeof houseOptions)[number]["key"] | "none" | null;
type ResultStatus = "pending" | "valid" | "btl";

const optionIconColors: Record<string, string> = {
  verified: "text-[#009688]",
  visibility_off: "text-[#a84a00]",
  file_copy: "text-[#a84a00]",
  cancel: "text-[#e53935]",
  pending: "text-[#a84a00]",
  receipt_long: "text-[#008c8c]",
  assignment_turned_in: "text-[#008c8c]",
  favorite: "text-[#174b8a]",
};

function SelectionOption({
  icon,
  title,
  description,
  selected,
  onClick,
  independent = false,
}: {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  independent?: boolean;
}) {
  return (
    <button
      type="button"
      role={independent ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3] ${
        selected
          ? "border-[#b8c9df] bg-[#f2f6fb]"
          : "border-[#e7eaee] bg-[#f8f9fa] hover:border-[#9db6d4] hover:bg-white"
      }`}
    >
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border text-[11px] ${
          "rounded-full"
        } ${
          selected
            ? "border-[#0056B3] bg-[#0056B3] text-white"
            : "border-[#98a1ab] bg-white text-transparent"
        }`}
        aria-hidden="true"
      >
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-[12px] font-semibold leading-snug text-[#191c1e]">
          <Icon
            name={icon}
            className={`shrink-0 text-[14px] ${optionIconColors[icon] ?? "text-[#59616d]"}`}
          />
          {title}
        </span>
        <span className="mt-1 block text-[10px] leading-relaxed text-[#59616d]">{description}</span>
      </span>
    </button>
  );
}

export default function DafdukWithinVillageVerification({
  classificationTitle = "Dalam Satu Desa / Kelurahan",
  requiresHouseProof = true,
}: {
  classificationTitle?: string;
  requiresHouseProof?: boolean;
}) {
  const router = useRouter();
  const [kkCondition, setKkCondition] = useState<KkCondition>(null);
  const [houseCondition, setHouseCondition] = useState<HouseCondition>(null);
  const [optionalMarriage, setOptionalMarriage] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const houseNeedsCorrection =
    requiresHouseProof &&
    (houseCondition === "shm-pending" ||
      houseCondition === "pbb-pending" ||
      houseCondition === "none");
  const hasHouseInput = !requiresHouseProof || houseCondition !== null;
  const status: ResultStatus =
    kkCondition === null || (kkCondition === "original" && !hasHouseInput)
      ? "pending"
      : kkCondition === "original" && !houseNeedsCorrection
        ? "valid"
        : "btl";
  const statusContent =
    status === "pending"
      ? {
          title: "MENUNGGU PILIHAN BERKAS",
          icon: "checklist",
          description:
            "Pilih kondisi Kartu Keluarga dan bukti alamat tujuan untuk melihat hasil pemeriksaan berkas.",
        }
      : status === "valid"
        ? {
          title: "SIAP DIPROSES (VALID)",
          icon: "task_alt",
          description: requiresHouseProof
            ? "Seluruh berkas lengkap, asli, dan memenuhi syarat legalitas. Anda dapat melanjutkan proses pembaruan alamat dan pengesahan Kartu Keluarga baru di SIAK Terpusat tanpa SKPWNI."
            : "Kartu Keluarga asli dan terbaca jelas. Pemeriksaan berkas awal lengkap dan dapat diteruskan ke tahap berikutnya.",
          }
        : {
          title: "BTL (BERKAS TIDAK LENGKAP / BUTUH PERBAIKAN)",
          icon: "assignment_late",
          description:
            "Berkas memerlukan perbaikan. Lihat rincian dan arahan pada Template PLAVON di bawah pemeriksaan lampiran.",
          };

  const selectedKk = kkOptions.find((option) => option.key === kkCondition);
  const selectedHouse = houseOptions.find((option) => option.key === houseCondition);
  const houseSummary = selectedHouse?.title ?? (houseCondition === "none" ? "Tidak ada" : "Belum dipilih");
  const templateMessages = getPlavonTemplate(
    kkCondition,
    requiresHouseProof ? houseCondition : optionalMarriage ? "marriage" : null,
    requiresHouseProof,
  );
  const statusStyles =
    status === "valid"
      ? { frame: "border-[#b7e9e5] bg-[#e8faf8]", badge: "bg-[#86e8e2] text-[#004f4f]", icon: "text-[#006a6a]", copy: "text-[#075c58]" }
      : status === "btl"
        ? { frame: "border-[#f2c2a8] bg-[#fff5ef]", badge: "bg-[#ffdbcc] text-[#7b2f00]", icon: "text-[#9a3f0b]", copy: "text-[#833b13]" }
        : { frame: "border-[#dfe3e8] bg-[#f5f6f7]", badge: "bg-[#e6e8ea] text-[#424752]", icon: "text-[#59616d]", copy: "text-[#59616d]" };

  function toggleNoHouseEvidence() {
    const next = houseCondition === "none" ? null : "none";
    setHouseCondition(next);
  }

  async function copyTemplate() {
    await navigator.clipboard.writeText(templateMessages.join("\n\n"));
    setCopiedTemplate(true);
    window.setTimeout(() => setCopiedTemplate(false), 1800);
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] pb-8">
        <Breadcrumb
          items={[
            { label: "Pendaftaran Kependudukan", onClick: () => router.push("/dafduk") },
            { label: "Pindah Keluar", onClick: () => router.push("/dafduk/pindah-keluar") },
            { label: classificationTitle, onClick: () => router.push("/dafduk/pindah-keluar") },
            { label: "Verifikasi Berkas" },
          ]}
        />

        <div className="mb-6 rounded-xl border border-[#e4e8ed] bg-[#f1f3f5] px-5 py-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#657181]">
            Penduduk / Pindah Keluar / {classificationTitle} / Verifikasi Berkas
          </p>
          <h1 className="text-[22px] font-bold tracking-tight text-[#191c1e]">
            Verifikasi Berkas: {classificationTitle}
          </h1>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.9fr)]">
          <div className="flex flex-col gap-4">
            <section className="rounded-xl border border-[#e4e8ed] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-3">
                <h2 className="flex items-center gap-2 text-[14px] font-bold text-[#191c1e]">
                  <span className="h-2 w-2 rounded-full bg-[#0056B3]" /> 1. Kartu Keluarga Pemohon
                </h2>
                <p className="mt-1 text-[11px] text-[#59616d]">
                  Pilih kondisi fisik dan keabsahan dokumen Kartu Keluarga yang diunggah pemohon.
                </p>
              </div>
              <div role="radiogroup" aria-label="Kondisi Kartu Keluarga" className="flex flex-col gap-2">
                {kkOptions.map((option) => (
                  <SelectionOption
                    key={option.key}
                    icon={option.icon}
                    title={option.title}
                    description={option.description}
                    selected={kkCondition === option.key}
                    onClick={() => setKkCondition((current) => current === option.key ? null : option.key)}
                  />
                ))}
              </div>
            </section>

            {!requiresHouseProof && (
              <section className="rounded-xl border border-[#e4e8ed] bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-3">
                  <h2 className="flex items-center gap-2 text-[14px] font-bold text-[#191c1e]">
                    <span className="h-2 w-2 rounded-full bg-[#0056B3]" /> 2. Akta Nikah (Opsional)
                  </h2>
                  <p className="mt-1 text-[11px] text-[#59616d]">
                    Pilih jika akta nikah dilampirkan sebagai dokumen pendukung perpindahan mengikuti pasangan.
                  </p>
                </div>
                <SelectionOption
                  independent
                  icon="favorite"
                  title="Akta nikah"
                  description="Dokumen opsional. Tidak wajib dilampirkan jika tidak relevan dengan permohonan."
                  selected={optionalMarriage}
                  onClick={() => setOptionalMarriage((value) => !value)}
                />
              </section>
            )}

            {requiresHouseProof && <section className="rounded-xl border border-[#e4e8ed] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-3">
                <h2 className="flex items-center gap-2 text-[14px] font-bold text-[#191c1e]">
                  <span className="h-2 w-2 rounded-full bg-[#0056B3]" /> 2. Bukti Kepemilikan Rumah
                </h2>
                <p className="mt-1 text-[11px] text-[#59616d]">
                  Verifikasi legalitas alamat domisili tujuan baru: {classificationTitle}.
                </p>
              </div>
              <div role="radiogroup" aria-label="Bukti alamat tujuan" className="flex flex-col gap-2">
                {houseOptions.map((option) => (
                  <SelectionOption
                    key={option.key}
                    icon={option.icon}
                    title={option.title}
                    description={option.description}
                    selected={houseCondition === option.key}
                    onClick={() => setHouseCondition((current) => current === option.key ? null : option.key)}
                  />
                ))}
                <SelectionOption
                  icon="cancel"
                  title="Tidak ada"
                  description="Pemohon sama sekali tidak melampirkan bukti kepemilikan maupun surat persetujuan tempat tinggal tujuan mutasi."
                  selected={houseCondition === "none"}
                  onClick={toggleNoHouseEvidence}
                />
              </div>
            </section>}
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
            <section className="rounded-xl border border-[#e4e8ed] bg-white p-4 shadow-sm sm:p-5" aria-live="polite">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[1.5px] text-[#657181]">
                    Status Verifikasi SIAK
                  </p>
                  <span className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold ${statusStyles.badge}`}>
                    <Icon
                      name={status === "valid" ? "check_circle" : status === "btl" ? "warning" : "info"}
                      className="mr-1 text-[13px]"
                    />
                    {statusContent.title}
                  </span>
                </div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${statusStyles.badge}`}>
                  <Icon name={statusContent.icon} className={`text-[23px] ${statusStyles.icon}`} />
                </span>
              </div>
              <div className={`rounded-lg border p-3 text-[11px] leading-relaxed ${statusStyles.frame} ${statusStyles.copy}`}>
                {statusContent.description}
              </div>

              <div className="mt-5">
                <h3 className="mb-2 text-[9px] font-bold uppercase tracking-[1.3px] text-[#657181]">
                  Pemeriksaan Lampiran
                </h3>
                <div className="flex flex-col gap-2">
                  <SummaryRow
                    icon="badge"
                    label="Kartu Keluarga Pemohon"
                    value={kkCondition === null ? "Belum dipilih" : kkCondition === "original" ? "✓ Asli / Jelas" : selectedKk?.title ?? "Belum dipilih"}
                    valid={kkCondition === null ? null : kkCondition === "original"}
                  />
                  {requiresHouseProof ? (
                    <SummaryRow
                      icon="home_work"
                      label="Bukti Kepemilikan Rumah"
                      value={houseSummary}
                      valid={!hasHouseInput ? null : !houseNeedsCorrection}
                    />
                  ) : (
                    <SummaryRow
                      icon="favorite"
                      label="Akta Nikah (Opsional)"
                      value={optionalMarriage ? "✓ Dilampirkan" : "Tidak dilampirkan"}
                      valid={optionalMarriage ? true : null}
                    />
                  )}
                </div>
              </div>

              <div className="mt-5 border-t border-[#e4e8ed] pt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-[9px] font-bold uppercase tracking-[1.3px] text-[#657181]">
                    Template Arahan Operator (PLAVON)
                  </h3>
                  <button
                    type="button"
                    onClick={copyTemplate}
                    disabled={status === "pending"}
                    className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-[#0056B3] transition-colors hover:text-[#003F87] disabled:cursor-not-allowed disabled:text-[#9aa3ad]"
                  >
                    <Icon name={copiedTemplate ? "check" : "content_copy"} className="text-[13px]" />
                    {copiedTemplate ? "Tersalin" : "Salin Pesan"}
                  </button>
                </div>
                <div className="whitespace-pre-line rounded-lg border border-[#e7eaee] bg-[#f8f9fa] p-3 text-[10px] leading-relaxed text-[#424752]">
                  {templateMessages.join("\n\n")}
                </div>
              </div>
            </section>
          </aside>
        </div>

        <div className="mt-7 flex flex-col items-center justify-between gap-4 border-t border-[#e0e3e5] pt-5 sm:flex-row">
          <Link
            href="/dafduk/pindah-keluar"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-[#424752] transition-colors hover:bg-[#e6e8ea]"
          >
            <Icon name="arrow_back" className="text-[16px]" /> Kembali ke Klasifikasi Pindah
          </Link>
          {status === "valid" && (
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <span className="text-[10px] text-[#657181]">Pemeriksaan Selesai · Siap kirim status ke SIAK Terpusat</span>
              <button
                type="button"
                data-route-href="/dafduk/pindah-keluar/finalisasi"
                onClick={() => router.push("/dafduk/pindah-keluar/finalisasi")}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#003F87] px-5 py-3 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-[#0056B3]"
              >
                Lanjutkan ke Finalisasi SIAK <Icon name="arrow_forward" className="text-[15px]" />
              </button>
            </div>
          )}
        </div>
    </div>
  );
}

function getPlavonTemplate(
  kk: KkCondition,
  house: HouseCondition,
  requiresHouseProof: boolean,
): string[] {
  if (kk === null) {
    return ["Pilih kondisi Kartu Keluarga dan bukti alamat untuk menampilkan template PLAVON."];
  }
  if (requiresHouseProof && house === null) {
    return ["Pilih bukti kepemilikan atau persetujuan penggunaan rumah untuk menampilkan template PLAVON."];
  }

  const greeting = "Terima kasih telah menggunakan layanan Plavon Dukcapil.";
  const validGreeting = "Terimakasih telah menggunakan layanan PLAVON Kabupaten Sidoarjo";
  const blurReason =
    "Mohon maaf, berkas belum dapat diproses karena dokumen Kartu Keluarga yang dilampirkan kurang jelas atau buram sehingga data di dalamnya tidak dapat terbaca.";
  const blurUpload =
    "Mohon mengunggah kembali foto atau hasil pindai Kartu Keluarga asli dengan kualitas gambar yang jelas dan seluruh informasi dapat terbaca.";
  const copyReason =
    "Mohon maaf, berkas belum dapat diproses karena dokumen Kartu Keluarga yang dilampirkan berupa fotokopi.";
  const copyRule =
    "Sesuai dengan ketentuan Permendagri Nomor 7 Tahun 2019, dokumen yang digunakan untuk pengajuan layanan Plavon harus berupa Kartu Keluarga asli, bukan fotokopi atau tangkapan layar (screenshot).";
  const copyUpload =
    "Mohon mengunggah kembali foto atau hasil pindai Kartu Keluarga asli dengan kualitas gambar yang jelas dan seluruh informasi dapat terbaca.";
  const ownKk =
    "Mohon untuk melampirkan Kartu Keluarga milik sendiri atau Kartu Keluarga yang mencantumkan nama pemohon sebagai anggota keluarga. Apabila Kartu Keluarga hilang, mohon melampirkan surat keterangan kehilangan dari kepolisian terdekat.";
  const shmPending =
    "Dokumen Sertifikat Hak Milik (SHM) yang dilampirkan masih atas nama orang lain. Mohon melampirkan bukti pembelian atau penguasaan rumah, seperti kuitansi pembelian, AJB, atau PPJB. Apabila dokumen tersebut tidak tersedia, mohon melampirkan surat pernyataan tidak keberatan penggunaan alamat rumah dari pemilik sertifikat, bermeterai Rp10.000.";
  const pbbPending =
    "Dokumen PBB yang dilampirkan masih atas nama orang lain. Mohon melampirkan bukti pembelian atau penguasaan rumah, seperti kuitansi pembelian, AJB, atau PPJB. Apabila dokumen tersebut tidak tersedia, mohon melampirkan surat pernyataan tidak keberatan penggunaan alamat rumah dari pihak yang namanya tercantum pada PBB, bermeterai Rp10.000.";
  const generalHomeProof =
    "Mohon melampirkan bukti kepemilikan atau penguasaan rumah, seperti sertifikat tanah, PBB, kuitansi pembelian, AJB, atau PPJB. Apabila dokumen tersebut atas nama orang lain, mohon melampirkan surat pernyataan tidak keberatan penggunaan alamat rumah dari pihak yang bersangkutan, bermeterai Rp10.000.";
  const noHomeProof =
    "ATAU melampirkan Surat Pernyataan Tidak Keberatan Alamat Rumah Digunakan Sebagai Alamat Dokumen Kependudukan bermaterai 10.000 (apabila numpang KK, kontrak, kos, dll).";

  if (!requiresHouseProof) {
    if (kk === "original") return [validGreeting];
    if (kk === "blurred") return [greeting, blurReason, blurUpload];
    if (kk === "photocopy") return [greeting, copyReason, copyRule, copyUpload];
    return [greeting, ownKk];
  }

  if (kk === "original") {
    if (house === "shm-valid" || house === "pbb-valid" || house === "statement" || house === "marriage") {
      return [validGreeting];
    }
    if (house === "shm-pending") {
      return [
        greeting,
        "Mohon maaf, berkas belum dapat diproses karena sertifikat rumah yang dilampirkan masih atas nama orang lain. Mohon melampirkan dokumen pendukung berupa bukti pembelian atau penguasaan rumah, seperti kuitansi pembelian, AJB, atau PPJB.",
        "Apabila dokumen tersebut tidak tersedia, mohon melampirkan surat pernyataan tidak keberatan penggunaan alamat rumah dari pemilik sertifikat yang ditandatangani di atas meterai Rp10.000.",
      ];
    }
    if (house === "pbb-pending") {
      return [
        greeting,
        "Mohon maaf, berkas belum dapat diproses karena dokumen PBB yang dilampirkan masih atas nama orang lain. Mohon melampirkan bukti pembelian atau penguasaan rumah, seperti kuitansi pembelian, AJB, atau PPJB.",
        "Apabila dokumen tersebut tidak tersedia, mohon melampirkan surat pernyataan tidak keberatan penggunaan alamat rumah dari pihak yang namanya tercantum pada PBB, bermeterai Rp10.000.",
      ];
    }
    return [
      greeting,
      "Berkas tidak lengkap, mohon untuk melampirkan surat bukti kepemilikan rumah (jika rumah milik sendiri),",
      noHomeProof,
    ];
  }

  if (kk === "blurred") {
    if (house === "shm-pending" || house === "pbb-pending") {
      const secondaryHouseMessage = house === "shm-pending"
        ? "SHM yang dilampirkan masih atas nama orang lain. Mohon melampirkan bukti pembelian atau penguasaan rumah, seperti kuitansi pembelian, AJB, atau PPJB. Apabila dokumen tersebut tidak tersedia, mohon melampirkan surat pernyataan tidak keberatan penggunaan alamat rumah dari pemilik sertifikat, bermeterai Rp10.000."
        : "Dokumen PBB yang dilampirkan masih atas nama orang lain. Mohon melampirkan bukti pembelian atau penguasaan rumah, seperti kuitansi pembelian, AJB, atau PPJB. Apabila dokumen tersebut tidak tersedia, mohon melampirkan surat pernyataan tidak keberatan penggunaan alamat rumah dari pihak yang namanya tercantum pada PBB, bermeterai Rp10.000.";
      return [
        greeting,
        blurReason,
        "Mohon mengunggah kembali Kartu Keluarga asli dengan kualitas gambar yang jelas dan seluruh informasi dapat terbaca.",
        `Dan juga, ${secondaryHouseMessage}`,
      ];
    }
    if (house === "none") {
      return [
        greeting,
        "Mohon maaf, berkas belum dapat diproses karena dokumen Kartu Keluarga yang dilampirkan buram atau kurang jelas sehingga data di dalamnya tidak dapat terbaca.",
        "Mohon mengunggah kembali Kartu Keluarga asli dengan kualitas gambar yang jelas dan seluruh informasi dapat terbaca.",
        `Dan juga, ${generalHomeProof}`,
      ];
    }
    return [greeting, blurReason, blurUpload];
  }

  if (kk === "photocopy") {
    if (house === "shm-pending" || house === "pbb-pending") {
      return [
        greeting,
        `${copyReason} Mohon mengunggah kembali foto atau hasil pindai Kartu Keluarga asli dengan kualitas gambar yang jelas dan seluruh informasi dapat terbaca.`,
        `Dan juga, ${house === "shm-pending" ? shmPending : pbbPending}`,
      ];
    }
    if (house === "none") {
      return [
        greeting,
        copyReason,
        copyRule,
        copyUpload,
        "Dan juga, mohon untuk melampirkan surat bukti kepemilikan rumah (jika rumah milik sendiri),",
        `${noHomeProof.replace(/^Mohon untuk melampirkan /, "ATAU melampirkan ")} Terima kasih.`,
      ];
    }
    return [greeting, copyReason, copyRule, copyUpload];
  }

  if (house === "shm-valid") return [greeting, ownKk];
  if (house === "shm-pending" || house === "pbb-pending") {
    return [greeting, ownKk, `Dan juga, ${house === "shm-pending" ? shmPending : pbbPending}`];
  }
  if (house === "none") return [greeting, ownKk, `Dan juga, ${generalHomeProof}`];
  return [greeting, ownKk];
}

function SummaryRow({
  icon,
  label,
  value,
  valid,
}: {
  icon: string;
  label: string;
  value: string;
  valid: boolean | null;
}) {
  const valueStyle =
    valid === null
      ? "bg-[#e6e8ea] text-[#59616d]"
      : valid
        ? "bg-[#c9f5f1] text-[#075c58]"
        : "bg-[#ffdbcc] text-[#833b13]";
  return (
    <div className="flex items-center justify-between gap-2 rounded-md bg-[#f5f6f7] px-2.5 py-2">
      <span className="flex min-w-0 items-center gap-1.5 text-[10px] text-[#424752]">
        <Icon name={icon} className="shrink-0 text-[13px]" />
        <span className="truncate">{label}</span>
      </span>
      <span className={`shrink-0 rounded px-2 py-1 text-[9px] font-bold ${valueStyle}`}>
        {value}
      </span>
    </div>
  );
}
