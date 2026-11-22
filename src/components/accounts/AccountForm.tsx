"use client";

import Link from "next/link";
import { useActionState } from "react";
import Icon from "@/components/ui/Icon";
import { createAccount, updateAccount } from "@/app/account-management/actions";

export type AccountFormValues = { id: number; name: string; email: string; role: string };

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

  return (
    <div className="mx-auto w-full max-w-2xl pb-8">
      <Link href="/account-management" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#0056B3] hover:text-[#003F87]">
        <Icon name="arrow_back" className="text-[18px]" /> Kembali ke Manajemen Akun
      </Link>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px]">{isEditing ? "Edit Akun" : "Tambah Akun"}</h1>
        <p className="mt-1 text-sm text-[#59616d]">{isEditing ? "Perbarui identitas dan role akun." : "Isi identitas akun dan tentukan role pengguna."}</p>
      </div>

      <form action={formAction} className="space-y-5 rounded-xl border border-[#e0e3e5] bg-white p-5 shadow-sm sm:p-7">
        <label className="block text-sm font-semibold text-[#424752]">Nama lengkap <span className="text-red-700">*</span>
          <input name="name" required maxLength={100} defaultValue={initial?.name ?? ""} className={inputClass} autoComplete="name" />
        </label>
        <label className="block text-sm font-semibold text-[#424752]">Email <span className="text-red-700">*</span>
          <input name="email" type="email" required maxLength={191} defaultValue={initial?.email ?? ""} className={inputClass} autoComplete="email" />
        </label>
        <label className="block text-sm font-semibold text-[#424752]">Role <span className="text-red-700">*</span>
          <select name="role" required defaultValue={initial?.role ?? "MAGANG"} className={inputClass}>
            {roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
          </select>
        </label>
        {!isEditing && <label className="block text-sm font-semibold text-[#424752]">Sandi awal <span className="text-red-700">*</span>
          <input name="password" type="password" required minLength={8} className={inputClass} autoComplete="new-password" />
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
