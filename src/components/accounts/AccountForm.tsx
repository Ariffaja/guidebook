"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import Icon from "@/components/ui/Icon";
import { createAccount, updateAccount } from "@/app/account-management/actions";

export type AccountFormValues = { id: number; name: string; email: string; role: string; sopDivisions?: ("DAFDUK" | "CAPIL")[] };
type SopDivisionKey = "DAFDUK" | "CAPIL";

const inputClass = "mt-1.5 w-full rounded-lg border border-[#c2c6d4] bg-white px-3.5 py-2.5 text-sm text-[#191c1e] outline-none transition focus:border-[#0056B3] focus:ring-2 focus:ring-[#0056B3]/15";
const roles = [
  { value: "ADMIN", label: "Admin" },
  { value: "MENTOR", label: "Mentor" },
  { value: "MAGANG", label: "Magang" },
];

export default function AccountForm({ initial }: { initial?: AccountFormValues }) {
  const isEditing = Boolean(initial);
  const action = initial ? updateAccount.bind(null, initial.id) : createAccount;
  const [state, formAction, pending] = useActionState(action, {});
  const [role, setRole] = useState(initial?.role ?? "MAGANG");
  const [sopDivisions, setSopDivisions] = useState<SopDivisionKey[]>(initial?.sopDivisions ?? []);
  const [showInitialPassword, setShowInitialPassword] = useState(false);

  return (
    <div className="mx-auto w-full max-w-2xl pb-8">
      <Link href="/account-management" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#0056B3] hover:text-[#003F87]">
        <Icon name="arrow_back" className="text-[18px]" /> Kembali ke Manajemen Akun
      </Link>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px]">{isEditing ? "Edit Akun" : "Tambah Akun"}</h1>
        <p className="mt-1 text-sm text-[#59616d]">{isEditing ? "Perbarui identitas, role, dan cakupan divisi akun." : "Isi identitas akun, role, dan cakupan divisi mentor."}</p>
      </div>

      <form action={formAction} className="space-y-5 rounded-xl border border-[#e0e3e5] bg-white p-5 shadow-sm sm:p-7">
        <label className="block text-sm font-semibold text-[#424752]">Nama lengkap <span className="text-red-700">*</span>
          <input name="name" required maxLength={100} defaultValue={initial?.name ?? ""} className={inputClass} autoComplete="name" />
        </label>
        <label className="block text-sm font-semibold text-[#424752]">Email <span className="text-red-700">*</span>
          <input name="email" type="email" required maxLength={191} defaultValue={initial?.email ?? ""} className={inputClass} autoComplete="email" />
        </label>
        <label className="block text-sm font-semibold text-[#424752]">Role <span className="text-red-700">*</span>
          <select name="role" required value={role} onChange={(event) => setRole(event.target.value)} className={inputClass}>
            {roles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        {role === "MENTOR" && <fieldset className="rounded-lg border border-[#d5d9e0] p-4">
          <legend className="px-1 text-sm font-semibold text-[#424752]">Cakupan Divisi <span className="text-red-700">*</span></legend>
          <p className="mb-3 text-xs text-[#727784]">Pilih satu atau kedua divisi untuk akun mentor.</p>
          <div className="flex flex-wrap gap-4">
            {[{ value: "DAFDUK", label: "Dafduk" }, { value: "CAPIL", label: "Capil" }].map((division) => (
              <label key={division.value} className="inline-flex items-center gap-2 text-sm font-medium text-[#424752]">
                <input
                  type="checkbox"
                  name="sopDivisions"
                  value={division.value}
                  checked={sopDivisions.includes(division.value as SopDivisionKey)}
                  onChange={(event) => setSopDivisions((current) => event.target.checked
                    ? [...current, division.value as SopDivisionKey]
                    : current.filter((item) => item !== division.value))}
                  className="h-4 w-4 accent-[#0056B3]"
                />
                {division.label}
              </label>
            ))}
          </div>
        </fieldset>}
        {!isEditing && <label className="block text-sm font-semibold text-[#424752]">Sandi awal <span className="text-red-700">*</span>
          <span className="relative mt-1.5 block">
            <input name="password" type={showInitialPassword ? "text" : "password"} required minLength={8} className={`${inputClass} mt-0 pr-11 font-normal`} autoComplete="new-password" />
            <button
              type="button"
              aria-label={showInitialPassword ? "Sembunyikan sandi awal" : "Tampilkan sandi awal"}
              aria-pressed={showInitialPassword}
              onClick={() => setShowInitialPassword((visible) => !visible)}
              className="absolute inset-y-1.5 right-0 flex w-10 items-center justify-center rounded-r-lg text-[#59616d] hover:bg-slate-100 hover:text-[#191c1e] focus-visible:outline-2 focus-visible:outline-[#0056B3]"
            >
              <Icon name={showInitialPassword ? "visibility_off" : "visibility"} className="text-[20px]" />
            </button>
          </span>
          <span className="mt-1 block text-xs font-normal text-[#727784]">Minimal 8 karakter. Sampaikan sandi awal ini kepada pengguna secara terpisah.</span>
        </label>}
        {state.error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">{state.error}</p>}
        <div className="flex justify-end gap-2 border-t border-[#eceef0] pt-4">
          <Link href="/account-management" className="rounded-lg border border-[#c2c6d4] px-4 py-2.5 text-sm font-medium text-[#424752]">Batal</Link>
          <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-[#0056B3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#003F87] disabled:opacity-60">
            <Icon name={isEditing ? "check" : "person_add"} /> {pending ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Buat Akun"}
          </button>
        </div>
      </form>
    </div>
  );
}
