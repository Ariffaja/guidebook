"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import { importInternAccounts, previewInternImport } from "@/app/account-management/actions";
import type { InternImportRow } from "@/lib/internImport";

export default function InternAccountImport() {
  const [rows, setRows] = useState<InternImportRow[] | null>(null);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);
  const [pending, setPending] = useState(false);
  const validRows = rows?.filter((row) => row.errors.length === 0) ?? [];

  async function handlePreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    const formData = new FormData(event.currentTarget);
    setPending(true);
    try {
      const preview = await previewInternImport(formData);
      setRows(preview.preview ?? null);
      setError(preview.error ?? "");
    } catch {
      setError("File gagal diproses. Coba unggah ulang templat Excel.");
    } finally {
      setPending(false);
    }
  }

  async function handleImport() {
    if (!rows) return;
    setError("");
    setPending(true);
    try {
      const imported = await importInternAccounts(rows, password, confirmation);
      if (imported.error) {
        setError(imported.error);
        return;
      }
      setResult({ created: imported.created ?? 0, skipped: imported.skipped ?? 0 });
      setRows(null);
      setPassword("");
      setConfirmation("");
    } catch {
      setError("Impor gagal diproses. Muat ulang halaman dan tinjau file kembali.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl pb-8">
      <Link href="/account-management" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#0056B3] hover:text-[#003F87]"><Icon name="arrow_back" className="text-[18px]" />Kembali ke Manajemen Akun</Link>
      <div className="mb-5"><h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px]">Impor Akun Magang</h1><p className="mt-1 text-sm text-[#59616d]">Buat banyak akun magang dari satu file Excel.</p></div>

      <section className="rounded-xl border border-[#e0e3e5] bg-white p-5 shadow-sm sm:p-7">
        <ol className="mb-6 grid gap-3 text-sm text-[#424752] sm:grid-cols-3">
          <li className="rounded-lg bg-[#f5f8ff] p-3"><strong className="block text-[#191c1e]">1. Unduh templat</strong>Isi kolom Nama dan Email.</li>
          <li className="rounded-lg bg-[#f5f8ff] p-3"><strong className="block text-[#191c1e]">2. Unggah dan tinjau</strong>Periksa format data serta email duplikat.</li>
          <li className="rounded-lg bg-[#f5f8ff] p-3"><strong className="block text-[#191c1e]">3. Konfirmasi impor</strong>Role seluruh akun menjadi MAGANG.</li>
        </ol>
        <a href="/account-management/template" className="mb-5 inline-flex items-center gap-2 rounded-lg border border-[#9bb8dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#0056B3] shadow-sm hover:bg-[#edf4ff]"><Icon name="download" />Unduh Templat Excel</a>

        <form onSubmit={handlePreview} className="flex flex-col gap-3 border-t border-[#eceef0] pt-5 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm font-semibold text-[#424752]">File Excel (.xlsx)
            <input name="file" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" required onChange={() => { setRows(null); setResult(null); setError(""); }} className="mt-1.5 block w-full rounded-lg border border-[#c2c6d4] bg-white p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#edf4ff] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[#0056B3]" />
          </label>
          <button disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0056B3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#003F87] disabled:opacity-60"><Icon name="fact_check" />{pending ? "Memeriksa..." : "Tinjau Data"}</button>
        </form>

        {error && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">{error}</p>}
        {result && <div role="status" className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">Impor selesai: <strong>{result.created}</strong> akun dibuat, <strong>{result.skipped}</strong> baris dilewati.</div>}

        {rows && <div className="mt-6 border-t border-[#eceef0] pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-lg font-semibold text-[#191c1e]">Pratinjau data</h2><p className="mt-1 text-sm text-[#727784]">{validRows.length} baris siap diimpor dari {rows.length} baris.</p></div><span className="rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-semibold text-[#0056B3]">Role otomatis: MAGANG</span></div>
          <div className="mt-4 max-h-[420px] overflow-auto rounded-lg border border-[#e0e3e5]"><table className="w-full min-w-[650px] border-collapse text-left text-sm"><thead className="sticky top-0 bg-[#f7f9fb]"><tr className="border-b border-[#e0e3e5] text-xs uppercase text-[#727784]"><th className="px-3 py-2.5">Baris</th><th className="px-3 py-2.5">Nama</th><th className="px-3 py-2.5">Email</th><th className="px-3 py-2.5">Hasil pemeriksaan</th></tr></thead><tbody className="divide-y divide-[#eceef0]">{rows.map((row) => <tr key={`${row.rowNumber}-${row.email}`}><td className="px-3 py-2.5 text-[#727784]">{row.rowNumber}</td><td className="px-3 py-2.5">{row.name || "—"}</td><td className="px-3 py-2.5">{row.email || "—"}</td><td className="px-3 py-2.5">{row.errors.length ? <span className="text-xs font-medium text-red-700">{row.errors.join(" ")}</span> : <span className="text-xs font-semibold text-emerald-700">Siap diimpor</span>}</td></tr>)}</tbody></table></div>

          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-950">Satu sandi awal untuk semua akun dalam impor ini</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-900">Sandi tidak disimpan di file Excel. Admin perlu menyampaikan sandi kepada peserta secara terpisah dan menganjurkan mereka menggantinya lewat profil setelah masuk.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-medium text-[#424752]">Sandi awal
                <span className="relative mt-1 block">
                  <input type={showPassword ? "text" : "password"} minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 pr-11 text-sm outline-none focus:border-[#0056B3]" />
                  <button type="button" aria-label={showPassword ? "Sembunyikan sandi awal" : "Tampilkan sandi awal"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-[#59616d] hover:bg-amber-100 hover:text-[#191c1e] focus-visible:outline-2 focus-visible:outline-[#0056B3]">
                    <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-[20px]" />
                  </button>
                </span>
                <span className="mt-1 block text-xs font-normal text-[#727784]">Minimal 8 karakter.</span>
              </label>
              <label className="block text-sm font-medium text-[#424752]">Ulangi sandi awal
                <span className="relative mt-1 block">
                  <input type={showConfirmation ? "text" : "password"} minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 pr-11 text-sm outline-none focus:border-[#0056B3]" />
                  <button type="button" aria-label={showConfirmation ? "Sembunyikan konfirmasi sandi" : "Tampilkan konfirmasi sandi"} aria-pressed={showConfirmation} onClick={() => setShowConfirmation((visible) => !visible)} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-[#59616d] hover:bg-amber-100 hover:text-[#191c1e] focus-visible:outline-2 focus-visible:outline-[#0056B3]">
                    <Icon name={showConfirmation ? "visibility_off" : "visibility"} className="text-[20px]" />
                  </button>
                </span>
                <span className="mt-1 block text-xs font-normal text-[#727784]">Minimal 8 karakter.</span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end"><button type="button" disabled={pending || validRows.length === 0 || password.length < 8 || password !== confirmation} onClick={handleImport} className="inline-flex items-center gap-2 rounded-lg bg-[#0056B3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#003F87] disabled:cursor-not-allowed disabled:opacity-50"><Icon name="upload" />{pending ? "Mengimpor..." : `Impor ${validRows.length} Akun`}</button></div>
        </div>}
      </section>
    </div>
  );
}
