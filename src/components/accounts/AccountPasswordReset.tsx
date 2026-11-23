"use client";

import { useActionState, useState } from "react";
import Icon from "@/components/ui/Icon";
import { resetAccountPassword } from "@/app/account-management/actions";

export default function AccountPasswordReset({ id }: { id: number }) {
  const [state, formAction, pending] = useActionState(resetAccountPassword.bind(null, id), {});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  function passwordField(name: "password" | "confirmation", label: string, visible: boolean, setVisible: (visible: boolean) => void) {
    return (
      <label className="block text-sm font-semibold text-[#424752]">{label}
        <span className="relative mt-1.5 block">
          <input
            name={name}
            type={visible ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-[#c2c6d4] px-3.5 py-2.5 pr-11 text-sm font-normal outline-none focus:border-[#0056B3] focus:ring-2 focus:ring-[#0056B3]/15"
          />
          <button
            type="button"
            aria-label={`${visible ? "Sembunyikan" : "Tampilkan"} ${label.toLowerCase()}`}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-[#59616d] hover:bg-slate-100 hover:text-[#191c1e] focus-visible:outline-2 focus-visible:outline-[#0056B3]"
          >
            <Icon name={visible ? "visibility_off" : "visibility"} className="text-[20px]" />
          </button>
        </span>
      </label>
    );
  }

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <p className="text-sm text-[#59616d]">Sandi baru minimal 8 karakter. Admin perlu menyampaikannya kepada pengguna secara terpisah.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {passwordField("password", "Sandi baru", showPassword, setShowPassword)}
        {passwordField("confirmation", "Ulangi sandi baru", showConfirmation, setShowConfirmation)}
      </div>
      {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      {state.success && <p role="status" className="text-sm text-emerald-700">{state.success}</p>}
      <button disabled={pending} className="rounded-lg border border-[#0056B3] px-4 py-2 text-sm font-semibold text-[#0056B3] hover:bg-[#edf4ff] disabled:opacity-60">{pending ? "Mereset..." : "Reset Sandi"}</button>
    </form>
  );
}
