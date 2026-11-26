"use client";

import { useActionState, useState } from "react";
import { changeOwnPassword } from "@/app/account-management/actions";

export default function ChangeOwnPasswordForm() {
  const [state, formAction, pending] = useActionState(changeOwnPassword, {});
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const canSubmit = password.length > 0 && confirmation.length > 0;

  return (
    <form action={formAction} className="mt-3 space-y-3 border-t border-slate-200 pt-3">
      <label className="block text-xs font-medium text-slate-600">Sandi baru<input name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="new-password" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600" /><span className="mt-1 block font-normal text-slate-500">Minimal 8 karakter.</span></label>
      <label className="block text-xs font-medium text-slate-600">Konfirmasi sandi baru<input name="confirmation" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required minLength={8} autoComplete="new-password" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600" /></label>
      {state.error && <p role="alert" className="text-xs text-red-700">{state.error}</p>}
      {state.success && <p role="status" className="text-xs text-emerald-700">{state.success}</p>}
      <button disabled={!canSubmit || pending} className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${canSubmit && !pending ? "cursor-pointer bg-[#0056B3] text-white hover:bg-[#003F87]" : "cursor-not-allowed bg-[#d8e3f0] text-[#718096]"}`}>{pending ? "Menyimpan..." : "Simpan"}</button>
    </form>
  );
}
