"use client";

import { useActionState, useState } from "react";
import { changeOwnPassword } from "@/app/account-management/actions";
import Icon from "@/components/ui/Icon";

export default function ChangeOwnPasswordForm() {
  const [state, formAction, pending] = useActionState(changeOwnPassword, {});
  const [visible, setVisible] = useState({ current: false, password: false, confirmation: false });

  function passwordField(name: "currentPassword" | "password" | "confirmation", label: string, key: keyof typeof visible, autoComplete: string) {
    return (
      <label className="block text-xs font-medium text-slate-600">{label}
        <span className="relative mt-1 block">
          <input name={name} type={visible[key] ? "text" : "password"} required minLength={name === "currentPassword" ? undefined : 8} autoComplete={autoComplete} className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-11 text-sm text-slate-900 outline-none focus:border-blue-600" />
          <button type="button" aria-label={visible[key] ? `Sembunyikan ${label.toLowerCase()}` : `Tampilkan ${label.toLowerCase()}`} aria-pressed={visible[key]} onClick={() => setVisible((current) => ({ ...current, [key]: !current[key] }))} className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center rounded-r-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-[#0056B3]">
            <Icon name={visible[key] ? "visibility_off" : "visibility"} className="text-[19px]" />
          </button>
        </span>
      </label>
    );
  }

  return (
    <form action={formAction} className="mt-3 space-y-3 border-t border-slate-200 pt-3">
      {passwordField("currentPassword", "Sandi saat ini", "current", "current-password")}
      <div>{passwordField("password", "Sandi baru", "password", "new-password")}<span className="mt-1 block text-xs font-normal text-slate-500">Minimal 8 karakter.</span></div>
      {passwordField("confirmation", "Konfirmasi sandi baru", "confirmation", "new-password")}
      {state.error && <p role="alert" className="text-xs text-red-700">{state.error}</p>}
      {state.success && <p role="status" className="text-xs text-emerald-700">{state.success}</p>}
      <button disabled={pending} className="w-full rounded-lg bg-[#0056B3] px-3 py-2 text-sm font-semibold text-white hover:bg-[#003F87] disabled:opacity-60">{pending ? "Menyimpan..." : "Simpan Sandi Baru"}</button>
    </form>
  );
}
