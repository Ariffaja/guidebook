import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import Icon from "@/components/ui/Icon";
import { sopCaseTypeLabels, type SopCaseType } from "@/components/sop/sopTypes";
import { prisma } from "@/lib/prisma";
import { getSopAccess } from "@/lib/sopAccess";

export const metadata: Metadata = { title: "Riwayat SOP - GUIDEBOOK ADMINDUK" };

type AuditChange = { field: string; oldValue: unknown; newValue: unknown };
type AuditDetails = { changes?: AuditChange[] };

const actionLabels: Record<string, string> = {
  CREATE: "Dibuat",
  UPDATE: "Diedit",
  ARCHIVE: "Diarsipkan",
  RESTORE: "Dipulihkan",
  DELETE: "Dihapus permanen",
};

const fieldLabels: Record<string, string> = {
  category: "Divisi",
  caseType: "Jenis kasus",
  ref: "Referensi",
  title: "Judul SOP",
  classification: "Klasifikasi",
  deadlineBusinessDays: "Tenggat (hari kerja)",
  description: "Deskripsi kasus",
  template: "Templat respons",
  keywords: "Kata kunci",
  isArchived: "Status arsip",
};

function getDetails(value: unknown): AuditDetails {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as AuditDetails;
}

function formatValue(field: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "(kosong)";
  if (field === "category") return value === "dafduk" ? "Dafduk" : value === "capil" ? "Capil" : String(value);
  if (field === "caseType" && typeof value === "string" && value in sopCaseTypeLabels) {
    return sopCaseTypeLabels[value as SopCaseType];
  }
  if (field === "isArchived") return value ? "Diarsipkan" : "Aktif";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value, null, 2);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date) + " WIB";
}

export default async function SopHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  const access = await getSopAccess(Number(session.user.id));
  if (!access?.canManage) redirect("/");

  const { id } = await params;
  const logs = await prisma.sopAuditLog.findMany({
    where: { sopCaseId: id, category: { in: access.categories } },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
  const currentCase = await prisma.sopCase.findUnique({ where: { id } });
  if (currentCase && !access.categories.includes(currentCase.category as "dafduk" | "capil")) redirect("/");
  if (!currentCase && logs.length === 0) redirect("/sop-directory");

  const title = logs[0]?.sopTitle ?? currentCase?.title ?? "SOP yang dihapus";
  const isArchived = currentCase?.isArchived ?? logs[0]?.action === "DELETE";
  const backHref = isArchived ? "/sop-directory?view=archive" : "/sop-directory";

  return (
    <AppLayout pageLabel="Riwayat SOP">
      <main className="mx-auto w-full max-w-5xl pb-8">
        <Link href={backHref} className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#0056B3] hover:text-[#003F87]">
          <Icon name="arrow_back" className="text-[18px]" /> Kembali ke {isArchived ? "Arsip SOP" : "Direktori SOP"}
        </Link>

        <header className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-[#0056B3]">
            <Icon name="history" className="text-[22px]" />
            <span className="text-xs font-bold uppercase tracking-wider">Riwayat SOP</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px]">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#59616d]">Catatan perubahan ini hanya dapat dilihat oleh Admin dan Mentor yang memiliki akses ke divisi SOP terkait.</p>
        </header>

        {logs.length === 0 ? (
          <section className="rounded-xl border border-[#e0e3e5] bg-white p-8 text-center shadow-sm">
            <Icon name="history" className="text-[30px] text-[#727784]" />
            <p className="mt-3 text-sm text-[#424752]">Belum ada riwayat untuk SOP ini. Perubahan sebelum fitur riwayat tersedia tidak tercatat.</p>
          </section>
        ) : (
          <ol className="flex flex-col gap-4">
            {logs.map((log) => {
              const details = getDetails(log.details);
              const changes = Array.isArray(details.changes) ? details.changes : [];
              return (
                <li key={log.id} className="rounded-xl border border-[#e0e3e5] bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col justify-between gap-3 border-b border-[#eceef0] pb-4 sm:flex-row sm:items-start">
                    <div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${log.action === "DELETE" ? "bg-red-50 text-red-800" : log.action === "ARCHIVE" ? "bg-amber-50 text-amber-800" : "bg-[#edf4ff] text-[#234c9b]"}`}>
                        {actionLabels[log.action] ?? log.action}
                      </span>
                      <p className="mt-2 text-sm font-semibold text-[#191c1e]">{log.actorName}</p>
                      <p className="text-xs text-[#59616d]">{log.actorEmail}</p>
                    </div>
                    <time dateTime={log.createdAt.toISOString()} className="text-xs text-[#59616d]">{formatDate(log.createdAt)}</time>
                  </div>

                  {changes.length > 0 ? (
                    <div className="mt-4 flex flex-col gap-3">
                      {changes.map((change, index) => (
                        <section key={`${change.field}-${index}`} className="rounded-lg bg-[#f7f9fb] p-3.5">
                          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#424752]">{fieldLabels[change.field] ?? change.field}</h2>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="min-w-0">
                              <p className="mb-1 text-[11px] font-semibold text-[#727784]">Sebelumnya</p>
                              <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded bg-white p-3 text-xs leading-relaxed text-[#424752]">{formatValue(change.field, change.oldValue)}</pre>
                            </div>
                            <div className="min-w-0">
                              <p className="mb-1 text-[11px] font-semibold text-[#727784]">Sesudahnya</p>
                              <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded bg-white p-3 text-xs leading-relaxed text-[#191c1e]">{formatValue(change.field, change.newValue)}</pre>
                            </div>
                          </div>
                        </section>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-[#59616d]">Tidak ada rincian bagian yang berubah pada aktivitas ini.</p>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </main>
    </AppLayout>
  );
}
