"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { toggleAccountStatus } from "@/app/account-management/actions";

export type AccountRow = { id: number; name: string; email: string; role: string; isActive: boolean; sopDivisions: ("DAFDUK" | "CAPIL")[] };
type RoleFilter = "all" | "ADMIN" | "MENTOR" | "MAGANG";
type StatusFilter = "all" | "active" | "inactive";

const roleLabels: Record<string, string> = { ADMIN: "Admin", MENTOR: "Mentor", MAGANG: "Magang" };

export default function AccountManagement({ accounts, currentUserId, status }: { accounts: AccountRow[]; currentUserId: number; status?: string }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [state, setState] = useState<StatusFilter>("all");
  const visibleAccounts = useMemo(() => accounts.filter((account) => {
    const matchesText = `${account.name} ${account.email}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesText && (role === "all" || account.role === role) && (state === "all" || (state === "active" ? account.isActive : !account.isActive));
  }), [accounts, query, role, state]);

  const statusMessages: Record<string, string> = {
    created: "Akun berhasil dibuat.", updated: "Perubahan akun berhasil disimpan.",
    "status-updated": "Status akun berhasil diperbarui.",
    "self-disabled": "Kamu tidak dapat menonaktifkan akun yang sedang digunakan.",
    "last-admin": "Akun tersebut adalah admin aktif terakhir. Tambahkan admin lain sebelum menonaktifkannya atau mengubah rolenya.",
    error: "Aksi gagal. Muat ulang halaman lalu coba lagi.",
  };

  return (
    <div className="flex w-full flex-col pb-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px]">Manajemen Akun</h1><p className="mt-1 text-base text-[#424752]">Kelola akses dan informasi pengguna GUIDEBOOK ADMINDUK.</p></div>
        <div className="flex flex-wrap gap-2"><Link href="/account-management/import" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#9bb8dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#0056B3] hover:bg-[#edf4ff]"><Icon name="upload" />Impor Akun Magang</Link><Link href="/account-management/new" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0056B3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#003F87]"><Icon name="person_add" />Tambah Akun</Link></div>
      </div>
      {status && statusMessages[status] && <p role="status" className={`mb-4 rounded-lg border px-4 py-3 text-sm ${status === "last-admin" || status === "error" || status === "self-disabled" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`}>{statusMessages[status]}</p>}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {[{ label: "Semua akun", value: accounts.length }, { label: "Aktif", value: accounts.filter((item) => item.isActive).length }, { label: "Nonaktif", value: accounts.filter((item) => !item.isActive).length }].map((item) => <div key={item.label} className="rounded-lg border border-[#e0e3e5] bg-white p-4 shadow-sm"><p className="text-xs font-medium text-[#727784]">{item.label}</p><p className="mt-1 text-2xl font-semibold text-[#191c1e]">{item.value}</p></div>)}
      </div>

      <section className="rounded-xl border border-[#e0e3e5] bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <label className="relative block"><span className="sr-only">Cari akun</span><Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#727784]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama atau email..." className="w-full rounded-lg border border-[#c2c6d4] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#0056B3] focus:ring-2 focus:ring-[#0056B3]/15" /></label>
          <label className="text-sm"><span className="sr-only">Filter role</span><select value={role} onChange={(event) => setRole(event.target.value as RoleFilter)} className="w-full rounded-lg border border-[#c2c6d4] px-3 py-2.5 text-sm"><option value="all">Semua role</option><option value="ADMIN">Admin</option><option value="MENTOR">Mentor</option><option value="MAGANG">Magang</option></select></label>
          <label className="text-sm"><span className="sr-only">Filter status</span><select value={state} onChange={(event) => setState(event.target.value as StatusFilter)} className="w-full rounded-lg border border-[#c2c6d4] px-3 py-2.5 text-sm"><option value="all">Semua status</option><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select></label>
        </div>
        <p className="my-4 text-xs text-[#727784]">Menampilkan {visibleAccounts.length} dari {accounts.length} akun</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead><tr className="border-y border-[#eceef0] text-xs uppercase tracking-wide text-[#727784]"><th className="px-3 py-3 font-semibold">Pengguna</th><th className="px-3 py-3 font-semibold">Role</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 text-right font-semibold">Aksi</th></tr></thead>
            <tbody className="divide-y divide-[#eceef0]">
              {visibleAccounts.map((account) => <tr key={account.id} className="hover:bg-[#f8f9fb]">
                <td className="px-3 py-3.5"><p className="font-semibold text-[#191c1e]">{account.name}{account.id === currentUserId && <span className="ml-2 text-xs font-normal text-[#727784]">(akunmu)</span>}</p><p className="mt-0.5 text-xs text-[#727784]">{account.email}</p></td>
                <td className="px-3 py-3.5">
                  <span className="inline-flex max-w-full flex-wrap items-center rounded-md bg-[#edf2ff] px-2 py-1 text-xs font-semibold leading-5 text-[#234c9b]">
                    {roleLabels[account.role] ?? account.role}
                    {account.role === "MENTOR" && ` · ${account.sopDivisions.map((division) => division === "DAFDUK" ? "Dafduk" : "Capil").join(" · ") || "Belum ada divisi"}`}
                  </span>
                </td>
                <td className="px-3 py-3.5"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${account.isActive ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}><span className={`h-1.5 w-1.5 rounded-full ${account.isActive ? "bg-emerald-600" : "bg-slate-400"}`} />{account.isActive ? "Aktif" : "Nonaktif"}</span></td>
                <td className="px-3 py-3.5"><div className="flex justify-end gap-2"><Link href={`/account-management/${account.id}/edit`} className="inline-flex items-center gap-1 rounded-md border border-[#d5d9e0] px-2.5 py-1.5 text-xs font-semibold text-[#0056B3] hover:bg-[#edf4ff]"><Icon name="edit" className="text-[16px]" />Edit</Link>
                  <form action={toggleAccountStatus} onSubmit={(event) => { const action = account.isActive ? "menonaktifkan" : "mengaktifkan"; if (!window.confirm(`Yakin ingin ${action} akun ${account.name}?`)) event.preventDefault(); }}><input type="hidden" name="id" value={account.id} /><button disabled={account.id === currentUserId} title={account.id === currentUserId ? "Akun yang sedang digunakan tidak dapat dinonaktifkan" : undefined} className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${account.isActive ? "border-amber-300 text-amber-800 hover:bg-amber-50" : "border-emerald-300 text-emerald-800 hover:bg-emerald-50"}`}>{account.isActive ? "Nonaktifkan" : "Aktifkan"}</button></form>
                </div></td>
              </tr>)}
              {visibleAccounts.length === 0 && <tr><td colSpan={4} className="px-3 py-10 text-center text-sm text-[#727784]">Tidak ada akun yang cocok dengan filter.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
