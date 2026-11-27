import Link from "next/link";
import Icon from "@/components/ui/Icon";
import DashboardScrollEffects from "@/components/ui/DashboardScrollEffects";

type DashboardActivity = {
  id: string;
  sopTitle: string;
  category: string;
  action: string;
  actorName: string;
  createdAt: string;
};

type RecentAccount = { id: number; name: string; email: string; role: string; createdAt: string };

type AdminDashboardProps = {
  stats: {
    accounts: number;
    activeAccounts: number;
    inactiveAccounts: number;
    mentors: number;
    interns: number;
    activeSops: number;
    archivedSops: number;
    dafdukSops: number;
    capilSops: number;
  };
  activities: DashboardActivity[];
  recentAccounts: RecentAccount[];
  mentorsWithoutDivision: number;
};

const actionLabels: Record<string, string> = {
  CREATE: "SOP ditambahkan",
  UPDATE: "SOP diperbarui",
  ARCHIVE: "SOP diarsipkan",
  RESTORE: "SOP dipulihkan",
  DELETE: "SOP dihapus",
};

const dateTime = (value: string) => new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
}).format(new Date(value));

function MetricCard({ title, value, detail, icon, tone }: { title: string; value: number; detail: string; icon: string; tone: string }) {
  return (
    <div data-dashboard-reveal className="rounded-xl border border-[#dfe5ed] bg-white p-5 shadow-sm">
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}><Icon name={icon} className="text-[23px]" /></div>
      <p className="text-3xl font-bold tracking-tight text-[#142033]">{value}</p>
      <p className="mt-1 text-sm font-medium text-[#59616d]">{title}</p>
      <p className="mt-3 text-xs font-medium text-[#087e73]">{detail}</p>
    </div>
  );
}

export default function AdminDashboard({ stats, activities, recentAccounts, mentorsWithoutDivision }: AdminDashboardProps) {
  const warnings = [
    ...(mentorsWithoutDivision > 0 ? [`${mentorsWithoutDivision} akun mentor belum memiliki divisi SOP.`] : []),
    ...(stats.dafdukSops === 0 ? ["Belum ada SOP aktif pada divisi Dafduk."] : []),
    ...(stats.capilSops === 0 ? ["Belum ada SOP aktif pada divisi Capil."] : []),
  ];

  const quickActions = [
    { href: "/account-management/new", label: "Tambah akun", icon: "person_add" },
    { href: "/account-management/import", label: "Impor peserta magang", icon: "upload" },
    { href: "/sop-management/new", label: "Tambah SOP", icon: "post_add" },
    { href: "/sop-directory?view=archive", label: "Buka arsip SOP", icon: "archive" },
  ];

  return (
    <DashboardScrollEffects>
    <div className="flex w-full flex-col pb-8">
      <div className="mb-6" data-dashboard-intro>
        <h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px]">Dashboard Admin</h1>
        <p className="mt-1 text-base text-[#59616d]">Ringkasan akun dan dokumentasi operasional GUIDEBOOK ADMINDUK.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total akun" value={stats.accounts} detail={`${stats.activeAccounts} aktif · ${stats.inactiveAccounts} nonaktif`} icon="groups" tone="bg-[#e9efff] text-[#3156c8]" />
        <MetricCard title="Mentor" value={stats.mentors} detail={`${mentorsWithoutDivision} belum diberi divisi`} icon="supervisor_account" tone="bg-[#e3f7f1] text-[#008b70]" />
        <MetricCard title="Peserta magang" value={stats.interns} detail="Akun role Magang" icon="school" tone="bg-[#fff2df] text-[#cc7900]" />
        <MetricCard title="SOP aktif" value={stats.activeSops} detail={`${stats.archivedSops} SOP tersimpan di arsip`} icon="menu_book" tone="bg-[#fce9eb] text-[#cf4552]" />
      </div>

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.9fr)]">
        <section data-dashboard-reveal className="overflow-hidden rounded-xl border border-[#dfe5ed] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e8ebef] px-5 py-4">
            <div><h2 className="font-semibold text-[#191c1e]">Aktivitas SOP terbaru</h2><p className="mt-0.5 text-xs text-[#727784]">Perubahan dokumentasi yang tercatat</p></div>
            <Link href="/admin/sop-history" className="text-sm font-semibold text-[#0056B3] hover:text-[#003F87]">Lihat riwayat</Link>
          </div>
          {activities.length > 0 ? <ul className="divide-y divide-[#eceef0]">
            {activities.map((activity) => <li key={activity.id} className="flex items-center gap-3 px-5 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf2ff] text-[#3156c8]"><Icon name={activity.action === "CREATE" ? "add_circle" : activity.action === "ARCHIVE" ? "archive" : activity.action === "DELETE" ? "delete" : "edit_note"} className="text-[20px]" /></span>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#191c1e]">{actionLabels[activity.action] ?? "SOP diperbarui"}</p><p className="truncate text-xs text-[#59616d]">{activity.sopTitle} · {activity.category === "dafduk" ? "Dafduk" : "Capil"}</p><p className="mt-1 text-[11px] text-[#727784]">{activity.actorName} · {dateTime(activity.createdAt)}</p></div>
            </li>)}
          </ul> : <p className="px-5 py-10 text-center text-sm text-[#727784]">Belum ada aktivitas perubahan SOP.</p>}
        </section>

        <section data-dashboard-reveal className="rounded-xl border border-[#dfe5ed] bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#191c1e]">Aksi cepat</h2>
          <div className="mt-4 flex flex-col gap-2.5">
            {quickActions.map((action) => <Link key={action.href} href={action.href} className="flex items-center gap-2.5 rounded-lg border border-[#b7cce5] px-3.5 py-3 text-sm font-medium text-[#0056B3] transition-colors hover:border-[#0056B3] hover:bg-[#f3f7ff]"><Icon name={action.icon} className="text-[19px]" />{action.label}<Icon name="arrow_forward" className="ml-auto text-[17px]" /></Link>)}
          </div>
        </section>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <section data-dashboard-reveal className="rounded-xl border border-[#dfe5ed] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-[#191c1e]">Dokumentasi SOP</h2><Link href="/sop-directory" className="text-xs font-semibold text-[#0056B3] hover:underline">Buka direktori</Link></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-[#f4f7ff] p-4"><p className="text-xs font-medium text-[#59616d]">Dafduk</p><p className="mt-1 text-2xl font-bold text-[#142033]">{stats.dafdukSops}</p><p className="text-xs text-[#727784]">SOP aktif</p></div>
            <div className="rounded-lg bg-[#f0faf7] p-4"><p className="text-xs font-medium text-[#59616d]">Capil</p><p className="mt-1 text-2xl font-bold text-[#142033]">{stats.capilSops}</p><p className="text-xs text-[#727784]">SOP aktif</p></div>
          </div>
        </section>

        <section data-dashboard-reveal className="rounded-xl border border-[#dfe5ed] bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-[#191c1e]">Akun terbaru</h2><Link href="/account-management" className="text-xs font-semibold text-[#0056B3] hover:underline">Kelola akun</Link></div>
          {recentAccounts.length > 0 ? <ul className="divide-y divide-[#eceef0]">{recentAccounts.map((account) => <li key={account.id} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#191c1e]">{account.name}</p><p className="truncate text-xs text-[#727784]">{account.email}</p><p className="mt-1 text-[11px] text-[#727784]">Dibuat {dateTime(account.createdAt)}</p></div><span className="shrink-0 rounded-full bg-[#edf2ff] px-2.5 py-1 text-[10px] font-bold text-[#3156a0]">{account.role === "MAGANG" ? "MAGANG" : account.role}</span></li>)}</ul> : <p className="py-6 text-sm text-[#727784]">Belum ada akun.</p>}
        </section>
      </div>

      <section data-dashboard-reveal className={`mt-5 rounded-xl border p-5 shadow-sm ${warnings.length ? "border-amber-200 bg-amber-50" : "border-[#dfe5ed] bg-white"}`}>
        <div className="flex items-start gap-3"><Icon name={warnings.length ? "warning" : "task_alt"} className={`text-[21px] ${warnings.length ? "text-amber-700" : "text-emerald-700"}`} /><div><h2 className="font-semibold text-[#191c1e]">Peringatan admin</h2>{warnings.length ? <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-900">{warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul> : <p className="mt-1 text-sm text-[#59616d]">Tidak ada hal yang perlu ditindaklanjuti saat ini.</p>}</div></div>
      </section>
    </div>
    </DashboardScrollEffects>
  );
}
