import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

type AppLayoutProps = {
  children: ReactNode;
  /** Teks penanda halaman yang tampil di Header. */
  pageLabel: string;
};

/**
 * Kerangka bersama semua halaman: Sidebar tetap (288px), Header tetap (64px),
 * area konten, dan footer. Halaman hanya mengisi `children`.
 */
export default async function AppLayout({ children, pageLabel }: AppLayoutProps) {
  const session = await auth();

  if (!session?.user || !session.user.isActive) {
    redirect("/login");
  }

  return (
    <div className="app-shell min-h-screen bg-[#F7F9FB] text-slate-800">
      <Sidebar isAdmin={session.user.role === "ADMIN"} />
      <div className="flex min-h-screen flex-col lg:pl-[19rem]">
        <Header
          pageLabel={pageLabel}
          user={
            session?.user
              ? {
                  name: session.user.name ?? null,
                  email: session.user.email ?? null,
                  role: session.user.role,
                }
              : null
          }
        />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-6 pt-24 sm:px-8">
          <div className="flex-1">{children}</div>
          <footer className="mt-10 flex w-full flex-col items-center justify-between gap-3 border-t border-slate-200/80 pb-2 pt-6 text-xs text-slate-500 sm:flex-row">
            <span className="font-medium text-slate-700">
              Dinas Kependudukan dan Pencatatan Sipil Kabupaten Sidoarjo
            </span>
            <span>Sistem Panduan Internal Operasional © {new Date().getFullYear()}</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
