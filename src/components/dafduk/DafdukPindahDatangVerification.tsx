"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Icon from "@/components/ui/Icon";
import Toast from "@/components/ui/Toast";

const skpwniOptions = [
  { key: "original", icon: "verified", title: "Asli", description: "SKPWNI asli atau dokumen resmi dari daerah asal yang dapat divalidasi." },
  { key: "photocopy", icon: "file_copy", title: "Fotocopy", description: "Lampiran hanya berupa fotokopi atau salinan SKPWNI." },
  { key: "none", icon: "cancel", title: "Tidak ada", description: "Pemohon belum melampirkan SKPWNI dari daerah asal." },
] as const;

const kkOptions = [
  { key: "original", icon: "verified", title: "Asli / terbaca jelas", description: "Dokumen KK asli atau cetakan digital TTE barcode resmi Dukcapil terbaca tajam dan NIK seluruh anggota keluarga sinkron." },
  { key: "blurred", icon: "visibility_off", title: "Buram / tidak terbaca", description: "Resolusi scan rendah, foto terpotong, atau barcode/NIK kabur sehingga data keluarga tidak dapat divalidasi operator." },
  { key: "photocopy", icon: "file_copy", title: "Fotocopy", description: "Lampiran berupa fotokopi hitam putih tanpa legalisir basah / bukan dokumen asli berkode QR valid." },
  { key: "not-applicant", icon: "cancel", title: "Bukan milik pemohon", description: "Lampiran KK orang lain, salah unggah berkas, atau identitas di dalam berkas tidak berkorelasi dengan pemohon PLAVON." },
] as const;

const ktpOptions = [
  { key: "original", icon: "verified", title: "Asli / terbaca jelas", description: "KTP-el asli atau dokumen digital resmi terbaca jelas dan data identitas sesuai dengan pemohon." },
  { key: "blurred", icon: "visibility_off", title: "Buram / tidak terbaca", description: "Foto atau scan KTP-el buram, terpotong, atau informasi penting tidak dapat dibaca." },
  { key: "photocopy", icon: "file_copy", title: "Fotocopy", description: "Lampiran hanya berupa fotokopi atau salinan KTP-el." },
  { key: "not-applicant", icon: "cancel", title: "Bukan milik pemohon", description: "KTP-el yang dilampirkan bukan milik pemohon atau identitasnya tidak sesuai." },
] as const;

const houseOptions = [
  { key: "shm-valid", icon: "verified", title: "SHM atas nama pemohon atau anggota keluarga", description: "Sertifikat Hak Milik (SHM) tercantum atas nama pemohon atau salah satu anggota keluarga." },
  { key: "shm-pending", icon: "pending", title: "SHM belum balik nama", description: "Nama pada SHM berbeda. Perlu dokumen pendukung seperti AJB atau surat keterangan waris." },
  { key: "pbb-valid", icon: "receipt_long", title: "PBB atas nama pemohon atau anggota keluarga", description: "Bukti lunas PBB tahun berjalan atas nama pemohon atau anggota keluarga di alamat tujuan." },
  { key: "pbb-pending", icon: "pending", title: "PBB belum balik nama", description: "Nama pada PBB belum sesuai. Perlu bukti peralihan hak atau surat keterangan desa/kelurahan." },
  { key: "statement", icon: "assignment_turned_in", title: "Surat pernyataan tidak keberatan alamat rumah digunakan", description: "Surat persetujuan pemilik rumah bermeterai cukup bagi pemohon yang menumpang atau menyewa." },
] as const;

type SkpwniCondition = (typeof skpwniOptions)[number]["key"] | null;
type KkCondition = (typeof kkOptions)[number]["key"] | null;
type KtpCondition = (typeof ktpOptions)[number]["key"] | null;
type HouseCondition = (typeof houseOptions)[number]["key"] | "none" | null;
type VerificationStatus = "pending" | "valid" | "btl";

const iconColors: Record<string, string> = {
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
        selected ? "border-[#b8c9df] bg-[#f2f6fb]" : "border-[#e7eaee] bg-[#f8f9fa] hover:border-[#9db6d4] hover:bg-white"
      }`}
    >
      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[11px] ${selected ? "border-[#0056B3] bg-[#0056B3] text-white" : "border-[#98a1ab] bg-white text-transparent"}`} aria-hidden="true">
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-[12px] font-semibold leading-snug text-[#191c1e]">
          <Icon name={icon} className={`shrink-0 text-[14px] ${iconColors[icon] ?? "text-[#59616d]"}`} />
          {title}
        </span>
        <span className="mt-1 block text-[10px] leading-relaxed text-[#59616d]">{description}</span>
      </span>
    </button>
  );
}

function SummaryRow({ icon, label, value, valid }: { icon: string; label: string; value: string; valid: boolean | null }) {
  const valueStyle = valid === null
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
      <span className={`shrink-0 rounded px-2 py-1 text-[9px] font-bold ${valueStyle}`}>{value}</span>
    </div>
  );
}

export default function DafdukPindahDatangVerification() {
  const router = useRouter();
  const [skpwni, setSkpwni] = useState<SkpwniCondition>(null);
  const [kk, setKk] = useState<KkCondition>(null);
  const [ktp, setKtp] = useState<KtpCondition>(null);
  const [house, setHouse] = useState<HouseCondition>(null);
  const [optionalMarriage, setOptionalMarriage] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [toast, setToast] = useState<{ id: number; icon: string; message: string } | null>(null);

  const skpwniIssue = skpwni !== null && skpwni !== "original";
  const kkIssue = kk !== null && kk !== "original";
  const ktpIssue = ktp !== null && ktp !== "original";
  const houseIssue = house === "shm-pending" || house === "pbb-pending" || house === "none";
  const allRequiredSelected = skpwni !== null && ktp !== null && kk !== null && house !== null;
  const status: VerificationStatus = skpwniIssue || ktpIssue || kkIssue || houseIssue
    ? "btl"
    : allRequiredSelected
      ? "valid"
      : "pending";

  const statusContent = status === "pending"
    ? { title: "MENUNGGU PILIHAN BERKAS", icon: "checklist", description: "Pilih kondisi SKPWNI, KTP, Kartu Keluarga, dan bukti kepemilikan rumah untuk melihat hasil pemeriksaan berkas." }
    : status === "valid"
      ? { title: "SIAP DIPROSES (VALID)", icon: "task_alt", description: "SKPWNI asli, KTP, Kartu Keluarga, dan bukti kepemilikan rumah memenuhi pemeriksaan awal. Berkas dapat dilanjutkan ke proses penerimaan di SIAK Terpusat." }
      : { title: "BTL (BERKAS TIDAK LENGKAP / BUTUH PERBAIKAN)", icon: "assignment_late", description: "Terdapat berkas yang perlu diperbaiki atau dilengkapi. Lihat rincian dan arahan pada template PLAVON." };
  const statusStyles = status === "valid"
    ? { frame: "border-[#b7e9e5] bg-[#e8faf8]", badge: "bg-[#86e8e2] text-[#004f4f]", icon: "text-[#006a6a]", copy: "text-[#075c58]" }
    : status === "btl"
      ? { frame: "border-[#f2c2a8] bg-[#fff5ef]", badge: "bg-[#ffdbcc] text-[#7b2f00]", icon: "text-[#9a3f0b]", copy: "text-[#833b13]" }
      : { frame: "border-[#dfe3e8] bg-[#f5f6f7]", badge: "bg-[#e6e8ea] text-[#424752]", icon: "text-[#59616d]", copy: "text-[#59616d]" };

  const selectedSkpwni = skpwniOptions.find((option) => option.key === skpwni);
  const selectedKk = kkOptions.find((option) => option.key === kk);
  const selectedKtp = ktpOptions.find((option) => option.key === ktp);
  const selectedHouse = houseOptions.find((option) => option.key === house);
  const skpwniValue = skpwni === null ? "Belum dipilih" : skpwni === "original" ? "✓ Asli" : selectedSkpwni?.title ?? "BTL";
  const kkValue = kk === null ? "Belum dipilih" : kk === "original" ? "✓ Asli / Jelas" : selectedKk?.title ?? "BTL";
  const ktpValue = ktp === null ? "Belum dipilih" : ktp === "original" ? "✓ Asli / Jelas" : selectedKtp?.title ?? "BTL";
  const houseValue = house === null ? "Belum dipilih" : house === "none" ? "Tidak ada" : selectedHouse?.title ?? "Belum dipilih";

  const templateMessages = getArrivalTemplate({ skpwni, ktp, kk, house, status });

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(templateMessages.join("\n\n"));
      setCopiedTemplate(true);
      window.setTimeout(() => setCopiedTemplate(false), 1800);
    } catch {
      setToast({ id: Date.now(), icon: "warning", message: "Template gagal disalin. Salin manual dari kotak template." });
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] pb-8">
      <Breadcrumb
        items={[
          { label: "Pendaftaran Kependudukan", onClick: () => router.push("/dafduk") },
          { label: "Pindah Datang" },
          { label: "Verifikasi Berkas" },
        ]}
      />

      <div className="mb-6 rounded-xl border border-[#e4e8ed] bg-[#f1f3f5] px-5 py-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#657181]">
          Penduduk / Pindah Datang / Verifikasi Berkas
        </p>
        <h1 className="text-[22px] font-bold tracking-tight text-[#191c1e]">Verifikasi Berkas: Pindah Datang</h1>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.9fr)]">
        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-[#e4e8ed] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3">
              <h2 className="flex items-center gap-2 text-[14px] font-bold text-[#191c1e]"><span className="h-2 w-2 rounded-full bg-[#0056B3]" /> 1. Surat Keterangan Pindah WNI (SKPWNI)</h2>
              <p className="mt-1 text-[11px] text-[#59616d]">Periksa keaslian SKPWNI yang diterbitkan oleh daerah asal.</p>
            </div>
            <div role="radiogroup" aria-label="Kondisi SKPWNI" className="flex flex-col gap-2">
              {skpwniOptions.map((option) => <SelectionOption key={option.key} icon={option.icon} title={option.title} description={option.description} selected={skpwni === option.key} onClick={() => setSkpwni((current) => current === option.key ? null : option.key)} />)}
            </div>
          </section>

          <section className="rounded-xl border border-[#e4e8ed] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3">
              <h2 className="flex items-center gap-2 text-[14px] font-bold text-[#191c1e]"><span className="h-2 w-2 rounded-full bg-[#0056B3]" /> 2. KTP Pemohon</h2>
              <p className="mt-1 text-[11px] text-[#59616d]">Pilih kondisi fisik dan kesesuaian identitas KTP-el pemohon.</p>
            </div>
            <div role="radiogroup" aria-label="Kondisi KTP Pemohon" className="flex flex-col gap-2">
              {ktpOptions.map((option) => <SelectionOption key={option.key} icon={option.icon} title={option.title} description={option.description} selected={ktp === option.key} onClick={() => setKtp((current) => current === option.key ? null : option.key)} />)}
            </div>
          </section>

          <section className="rounded-xl border border-[#e4e8ed] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3">
              <h2 className="flex items-center gap-2 text-[14px] font-bold text-[#191c1e]"><span className="h-2 w-2 rounded-full bg-[#0056B3]" /> 3. Kartu Keluarga Pemohon</h2>
              <p className="mt-1 text-[11px] text-[#59616d]">Pilih kondisi fisik dan keabsahan Kartu Keluarga yang dilampirkan.</p>
            </div>
            <div role="radiogroup" aria-label="Kondisi Kartu Keluarga" className="flex flex-col gap-2">
              {kkOptions.map((option) => <SelectionOption key={option.key} icon={option.icon} title={option.title} description={option.description} selected={kk === option.key} onClick={() => setKk((current) => current === option.key ? null : option.key)} />)}
            </div>
          </section>

          <section className="rounded-xl border border-[#e4e8ed] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3">
              <h2 className="flex items-center gap-2 text-[14px] font-bold text-[#191c1e]"><span className="h-2 w-2 rounded-full bg-[#0056B3]" /> 4. Bukti Kepemilikan Rumah</h2>
              <p className="mt-1 text-[11px] text-[#59616d]">Pilih bukti kepemilikan atau persetujuan penggunaan alamat rumah di daerah tujuan.</p>
            </div>
            <div role="radiogroup" aria-label="Bukti kepemilikan rumah" className="flex flex-col gap-2">
              {houseOptions.map((option) => <SelectionOption key={option.key} icon={option.icon} title={option.title} description={option.description} selected={house === option.key} onClick={() => setHouse((current) => current === option.key ? null : option.key)} />)}
              <SelectionOption icon="cancel" title="Tidak ada" description="Pemohon belum melampirkan bukti kepemilikan maupun persetujuan penggunaan alamat rumah." selected={house === "none"} onClick={() => setHouse((current) => current === "none" ? null : "none")} />
            </div>
          </section>

          <section className="rounded-xl border border-[#e4e8ed] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3">
              <h2 className="flex items-center gap-2 text-[14px] font-bold text-[#191c1e]"><span className="h-2 w-2 rounded-full bg-[#0056B3]" /> 5. Akta Nikah (Opsional)</h2>
              <p className="mt-1 text-[11px] text-[#59616d]">Pilih jika Akta Nikah dilampirkan sebagai dokumen pendukung.</p>
            </div>
            <SelectionOption independent icon="favorite" title="Akta nikah dilampirkan" description="Dokumen opsional dan tidak memengaruhi status pemeriksaan berkas wajib." selected={optionalMarriage} onClick={() => setOptionalMarriage((value) => !value)} />
          </section>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
          <section className="rounded-xl border border-[#e4e8ed] bg-white p-4 shadow-sm sm:p-5" aria-live="polite">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="mb-2 text-[9px] font-bold uppercase tracking-[1.5px] text-[#657181]">Status Verifikasi SIAK</p>
                <span className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold ${statusStyles.badge}`}>
                  <Icon name={status === "valid" ? "check_circle" : status === "btl" ? "warning" : "info"} className="mr-1 text-[13px]" />
                  {statusContent.title}
                </span>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${statusStyles.badge}`}>
                <Icon name={statusContent.icon} className={`text-[23px] ${statusStyles.icon}`} />
              </span>
            </div>
            <div className={`rounded-lg border p-3 text-[11px] leading-relaxed ${statusStyles.frame} ${statusStyles.copy}`}>{statusContent.description}</div>

            <div className="mt-5">
              <h3 className="mb-2 text-[9px] font-bold uppercase tracking-[1.3px] text-[#657181]">Pemeriksaan Lampiran</h3>
              <div className="flex flex-col gap-2">
                <SummaryRow icon="description" label="SKPWNI" value={skpwniValue} valid={skpwni === null ? null : skpwni === "original"} />
                <SummaryRow icon="badge" label="KTP Pemohon" value={ktpValue} valid={ktp === null ? null : ktp === "original"} />
                <SummaryRow icon="badge" label="Kartu Keluarga Pemohon" value={kkValue} valid={kk === null ? null : kk === "original"} />
                <SummaryRow icon="home_work" label="Bukti Kepemilikan Rumah" value={houseValue} valid={house === null ? null : !houseIssue} />
                <SummaryRow icon="favorite" label="Akta Nikah (Opsional)" value={optionalMarriage ? "✓ Dilampirkan" : "Tidak dilampirkan"} valid={optionalMarriage ? true : null} />
              </div>
            </div>

            <div className="mt-5 border-t border-[#e4e8ed] pt-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-[9px] font-bold uppercase tracking-[1.3px] text-[#657181]">Template Arahan Operator (PLAVON)</h3>
                <button type="button" onClick={copyTemplate} disabled={status === "pending"} className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-[#0056B3] transition-colors hover:text-[#003F87] disabled:cursor-not-allowed disabled:text-[#9aa3ad]">
                  <Icon name={copiedTemplate ? "check" : "content_copy"} className="text-[13px]" />
                  {copiedTemplate ? "Tersalin" : "Salin Pesan"}
                </button>
              </div>
              <div className="whitespace-pre-line rounded-lg border border-[#e7eaee] bg-[#f8f9fa] p-3 text-[10px] leading-relaxed text-[#424752]">{templateMessages.join("\n\n")}</div>
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-7 flex flex-col items-center justify-between gap-4 border-t border-[#e0e3e5] pt-5 sm:flex-row">
        <Link href="/dafduk" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-[#424752] transition-colors hover:bg-[#e6e8ea]">
          <Icon name="arrow_back" className="text-[16px]" /> Kembali ke Pilih Layanan
        </Link>
        {status === "valid" && (
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <span className="text-[10px] text-[#657181]">Pemeriksaan selesai · berkas siap diteruskan ke SIAK Terpusat</span>
            <button type="button" onClick={() => router.push("/dafduk/pindah-datang/finalisasi")} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#003F87] px-5 py-3 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-[#0056B3]">
              Lanjutkan ke Finalisasi SIAK <Icon name="arrow_forward" className="text-[15px]" />
            </button>
          </div>
        )}
      </div>

      {toast && <Toast key={toast.id} icon={toast.icon} onClose={() => setToast(null)}>{toast.message}</Toast>}
    </div>
  );
}

function getArrivalTemplate({ skpwni, ktp, kk, house, status }: { skpwni: SkpwniCondition; ktp: KtpCondition; kk: KkCondition; house: HouseCondition; status: VerificationStatus }): string[] {
  if (status === "pending") return ["Pilih kondisi SKPWNI, KTP, Kartu Keluarga, dan bukti kepemilikan rumah untuk menampilkan template PLAVON."];
  if (status === "valid") return [
    "Terima kasih telah menggunakan layanan Plavon Dukcapil.",
    "SKPWNI asli, KTP Pemohon, Kartu Keluarga Pemohon, dan bukti kepemilikan rumah telah memenuhi pemeriksaan awal. Berkas dapat dilanjutkan ke proses Pindah Datang di SIAK Terpusat.",
    "Terima kasih.",
  ];

  const issues: string[] = [];
  if (skpwni === "photocopy") issues.push("Mohon mengunggah SKPWNI asli dari daerah asal. Fotokopi SKPWNI belum dapat diproses.");
  if (skpwni === "none") issues.push("Mohon melampirkan SKPWNI yang diterbitkan oleh daerah asal.");
  if (ktp === "blurred") issues.push("Mohon mengunggah kembali KTP-el pemohon dengan kualitas gambar yang jelas dan seluruh informasi terbaca.");
  if (ktp === "photocopy") issues.push("Mohon mengunggah KTP-el asli atau dokumen digital resmi, bukan fotokopi.");
  if (ktp === "not-applicant") issues.push("Mohon mengunggah KTP-el yang sesuai dengan identitas pemohon.");
  if (kk === "blurred") issues.push("Mohon mengunggah kembali Kartu Keluarga asli dengan kualitas gambar yang jelas dan seluruh informasi terbaca.");
  if (kk === "photocopy") issues.push("Mohon mengunggah Kartu Keluarga asli, bukan fotokopi.");
  if (kk === "not-applicant") issues.push("Mohon mengunggah Kartu Keluarga yang sesuai dengan identitas pemohon.");
  if (house === "shm-pending") issues.push("Mohon melampirkan dokumen pendukung kepemilikan rumah, seperti AJB atau surat keterangan waris.");
  if (house === "pbb-pending") issues.push("Mohon melampirkan bukti peralihan hak atau surat keterangan desa/kelurahan untuk PBB.");
  if (house === "none") issues.push("Mohon melampirkan bukti kepemilikan rumah atau surat persetujuan penggunaan alamat dari pemilik rumah.");
  return [
    "Terima kasih telah menggunakan layanan Plavon Dukcapil.",
    "Permohonan Pindah Datang berstatus BERKAS TIDAK LENGKAP (BTL). Mohon melengkapi atau memperbaiki berkas berikut:",
    ...issues.map((issue) => "• " + issue),
    "Terima kasih.",
  ];
}
