import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import Icon from "@/components/ui/Icon";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Riwayat SOP - GUIDEBOOK ADMINDUK" };

const actionLabels: Record<string, string> = {
  CREATE: "SOP ditambahkan",
  UPDATE: "SOP diperbarui",
  ARCHIVE: "SOP diarsipkan",
  RESTORE: "SOP dipulihkan dari arsip",
  DELETE: "SOP dihapus",
};

const actionIcons: Record<string, string> = {
  CREATE: "add_circle",
  UPDATE: "edit_note",
  ARCHIVE: "archive",
  RESTORE: "unarchive",
  DELETE: "delete",
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(value);
}

export default async function SopHistoryPage() {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const logs = await prisma.sopAuditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <AppLayout pageLabel="Riwayat SOP">
      <div className="mx-auto w-full max-w-5xl pb-8">
        <div className="mb-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#657181]">Data Master / SOP</p>
          <h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px]">Riwayat SOP</h1>
          <p className="mt-1 text-base text-[#59616d]">Catatan penambahan, perubahan, pengarsipan, dan pemulihan SOP.</p>
        </div>

        <section className="overflow-hidden rounded-xl border border-[#dfe5ed] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e8ebef] px-5 py-4">
            <div><h2 className="font-semibold text-[#191c1e]">Aktivitas terdokumentasi</h2><p className="mt-0.5 text-xs text-[#727784]">Menampilkan hingga 100 perubahan terakhir</p></div>
            <span className="rounded-full bg-[#edf2ff] px-3 py-1 text-xs font-semibold text-[#3156a0]">{logs.length} catatan</span>
          </div>
          {logs.length ? <ul className="divide-y divide-[#eceef0]">
            {logs.map((log) => <li key={log.id} className="flex items-start gap-3 px-5 py-4 sm:items-center">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf2ff] text-[#3156c8]"><Icon name={actionIcons[log.action] ?? "history"} className="text-[20px]" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#191c1e]">{actionLabels[log.action] ?? "Perubahan SOP"}</p>
                <p className="mt-0.5 break-words text-sm text-[#424752]">{log.sopTitle} <span className="text-xs text-[#727784]">· {log.category === "dafduk" ? "Dafduk" : "Capil"}</span></p>
                <p className="mt-1 text-xs text-[#727784]">{log.actorName} ({log.actorEmail}) · {formatDate(log.createdAt)}</p>
              </div>
            </li>)}
          </ul> : <p className="px-5 py-12 text-center text-sm text-[#727784]">Belum ada aktivitas SOP yang tercatat.</p>}
        </section>
      </div>
    </AppLayout>
  );
}
