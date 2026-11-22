"use client";

import { useActionState } from "react";
import { resetAccountPassword } from "@/app/account-management/actions";

export default function AccountPasswordReset({ id }: { id: number }) {
  const [state, formAction, pending] = useActionState(resetAccountPassword.bind(null, id), {});
  return (
    <form action={formAction} className="mt-4 space-y-4">
      <p className="text-sm text-[#59616d]">Sandi baru minimal 8 karakter. Admin perlu menyampaikannya kepada pengguna secara terpisah.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[#424752]">Sandi baru
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className="mt-1.5 w-full rounded-lg border border-[#c2c6d4] px-3.5 py-2.5 text-sm outline-none focus:border-[#0056B3] focus:ring-2 focus:ring-[#0056B3]/15" />
        </label>
        <label className="block text-sm font-semibold text-[#424752]">Ulangi sandi baru
          <input name="confirmation" type="password" required minLength={8} autoComplete="new-password" className="mt-1.5 w-full rounded-lg border border-[#c2c6d4] px-3.5 py-2.5 text-sm outline-none focus:border-[#0056B3] focus:ring-2 focus:ring-[#0056B3]/15" />
        </label>
      </div>
      {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      {state.success && <p role="status" className="text-sm text-emerald-700">{state.success}</p>}
      <button disabled={pending} className="rounded-lg border border-[#0056B3] px-4 py-2 text-sm font-semibold text-[#0056B3] hover:bg-[#edf4ff] disabled:opacity-60">{pending ? "Mereset..." : "Reset Sandi"}</button>
    </form>
  );
}
