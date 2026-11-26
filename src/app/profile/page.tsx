import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import ChangeOwnPasswordForm from "@/components/accounts/ChangeOwnPasswordForm";
import Icon from "@/components/ui/Icon";
import { auth } from "../../../auth";

export const metadata: Metadata = { title: "Profil Pengguna - GUIDEBOOK ADMINDUK" };

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  MENTOR: "Mentor",
  MAGANG: "Peserta Magang",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");

  const profileItems = [
    { label: "Nama", value: session.user.name?.trim() || "Pengguna", icon: "person" },
    { label: "Email", value: session.user.email || "-", icon: "mail" },
    { label: "Role", value: roleLabels[session.user.role] ?? session.user.role, icon: "badge" },
  ];

  return (
    <AppLayout pageLabel="Profil Pengguna">
      <div className="mx-auto w-full max-w-3xl pb-8">
        <div className="mb-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#657181]">Akun</p>
          <h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px]">Profil Pengguna</h1>
        </div>

        <section className="rounded-xl border border-[#e0e3e5] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3 border-b border-[#eceef0] pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#003F87] text-white">
              <Icon name="person" className="text-[26px]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#191c1e]">Informasi Profil</h2>
              <p className="text-sm text-[#727784]">Data akun yang sedang digunakan.</p>
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            {profileItems.map((item) => (
              <div key={item.label} className="rounded-lg border border-[#e7eaee] bg-[#f8f9fa] p-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#727784]">
                  <Icon name={item.icon} className="text-[17px] text-[#0056B3]" />{item.label}
                </dt>
                <dd className="mt-2 break-words text-sm font-semibold text-[#191c1e]">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-5 rounded-xl border border-[#e0e3e5] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-3 border-b border-[#eceef0] pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf4ff] text-[#0056B3]">
              <Icon name="lock" className="text-[22px]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#191c1e]">Ubah kata sandi</h2>
            </div>
          </div>

          <ChangeOwnPasswordForm />
        </section>
      </div>
    </AppLayout>
  );
}
