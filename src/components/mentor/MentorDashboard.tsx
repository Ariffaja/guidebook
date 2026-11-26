import Link from "next/link";
import Icon from "@/components/ui/Icon";

type MentorDivision = { key: "dafduk" | "capil"; label: string; href: string; activeSops: number; archivedSops: number };
type MentorActivity = { id: string; sopTitle: string; category: string; action: string; actorName: string; createdAt: string };

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

export default function MentorDashboard({ name, divisions, activities, btlCount, tdpCount }: { name: string; divisions: MentorDivision[]; activities: MentorActivity[]; btlCount: number; tdpCount: number }) {
  const totalActive = divisions.reduce((total, division) => total + division.activeSops, 0);
  const totalArchived = divisions.reduce((total, division) => total + division.archivedSops, 0);
  const quickActions = [
    ...divisions.map((division) => ({ href: division.href, label: `Buka ${division.label}`, icon: division.key === "dafduk" ? "badge" : "assignment" })),
    { href: "/sop-directory", label: "Direktori SOP", icon: "menu_book" },
    ...(divisions.length > 0 ? [{ href: "/sop-management/new", label: "Tambah SOP", icon: "post_add" }] : []),
  ];

  return (
    <div className="flex w-full flex-col pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px]">Dashboard Mentor</h1>
        <p className="mt-1 text-base text-[#59616d]">Selamat datang, {name}. Berikut ringkasan divisi dan SOP yang dapat kamu kelola.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Divisi yang dapat diakses" value={divisions.length} detail={divisions.map((division) => division.label).join(" · ") || "Belum ada divisi ditetapkan"} icon="domain" tone="bg-[#e9efff] text-[#3156c8]" />
        <MetricCard title="SOP aktif" value={totalActive} detail={`${totalArchived} tersimpan di arsip`} icon="menu_book" tone="bg-[#e3f7f1] text-[#008b70]" />
        <MetricCard title="SOP BTL" value={btlCount} detail="Templat aktif pada divisi yang diizinkan" icon="assignment_late" tone="bg-[#fff2df] text-[#cc7900]" />
        <MetricCard title="SOP TDP" value={tdpCount} detail="Templat aktif pada divisi yang diizinkan" icon="block" tone="bg-[#fce9eb] text-[#cf4552]" />
      </div>

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.9fr)]">
        <section className="overflow-hidden rounded-xl border border-[#dfe5ed] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e8ebef] px-5 py-4">
            <div><h2 className="font-semibold text-[#191c1e]">Aktivitas SOP terbaru</h2><p className="mt-0.5 text-xs text-[#727784]">Hanya perubahan pada divisi yang menjadi aksesmu</p></div>
            <Link href="/sop-directory" className="text-sm font-semibold text-[#0056B3] hover:text-[#003F87]">Buka direktori</Link>
          </div>
          {activities.length ? <ul className="divide-y divide-[#eceef0]">{activities.map((activity) => <li key={activity.id} className="flex items-center gap-3 px-5 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf2ff] text-[#3156c8]"><Icon name={activity.action === "CREATE" ? "add_circle" : activity.action === "ARCHIVE" ? "archive" : activity.action === "DELETE" ? "delete" : "edit_note"} className="text-[20px]" /></span>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#191c1e]">{actionLabels[activity.action] ?? "SOP diperbarui"}</p><p className="truncate text-xs text-[#59616d]">{activity.sopTitle} · {activity.category === "dafduk" ? "Dafduk" : "Capil"}</p><p className="mt-1 text-[11px] text-[#727784]">{activity.actorName} · {dateTime(activity.createdAt)}</p></div>
          </li>)}</ul> : <p className="px-5 py-10 text-center text-sm text-[#727784]">Belum ada aktivitas pada divisi yang dapat diakses.</p>}
        </section>

        <section className="rounded-xl border border-[#dfe5ed] bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#191c1e]">Aksi cepat</h2>
          <div className="mt-4 flex flex-col gap-2.5">{quickActions.map((action) => <Link key={action.href} href={action.href} className="flex items-center gap-2.5 rounded-lg border border-[#b7cce5] px-3.5 py-3 text-sm font-medium text-[#0056B3] transition-colors hover:border-[#0056B3] hover:bg-[#f3f7ff]"><Icon name={action.icon} className="text-[19px]" />{action.label}<Icon name="arrow_forward" className="ml-auto text-[17px]" /></Link>)}</div>
        </section>
      </div>

      {divisions.length > 0 ? <section className="mt-5 rounded-xl border border-[#dfe5ed] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-[#191c1e]">Ringkasan divisi</h2><span className="text-xs text-[#727784]">Sesuai hak akses admin</span></div>
        <div className="grid gap-3 sm:grid-cols-2">{divisions.map((division) => <Link key={division.key} href={division.href} className="rounded-lg border border-[#e7eaee] bg-[#f8f9fa] p-4 transition-all hover:-translate-y-0.5 hover:border-[#0056B3] hover:shadow-sm"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Icon name={division.key === "dafduk" ? "badge" : "assignment"} className="text-[20px] text-[#0056B3]" /><span className="font-semibold text-[#191c1e]">{division.label}</span></div><Icon name="arrow_forward" className="text-[18px] text-[#0056B3]" /></div><p className="mt-3 text-sm text-[#59616d]">{division.activeSops} SOP aktif · {division.archivedSops} arsip</p></Link>)}</div>
      </section> : <section className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5"><Icon name="warning" className="text-[21px] text-amber-700" /><div><h2 className="font-semibold text-amber-950">Divisi belum ditetapkan</h2><p className="mt-1 text-sm text-amber-900">Hubungi admin untuk menetapkan divisi Dafduk dan/atau Capil agar menu verifikasi dan SOP dapat ditampilkan.</p></div></section>}
    </div>
  );
}

function MetricCard({ title, value, detail, icon, tone }: { title: string; value: number; detail: string; icon: string; tone: string }) {
  return <div className="rounded-xl border border-[#dfe5ed] bg-white p-5 shadow-sm"><div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}><Icon name={icon} className="text-[23px]" /></div><p className="text-3xl font-bold tracking-tight text-[#142033]">{value}</p><p className="mt-1 text-sm font-medium text-[#59616d]">{title}</p><p className="mt-3 text-xs font-medium text-[#087e73]">{detail}</p></div>;
}
