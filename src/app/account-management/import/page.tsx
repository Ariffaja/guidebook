import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import InternAccountImport from "@/components/accounts/InternAccountImport";

export const metadata: Metadata = { title: "Impor Akun Magang - Manajemen Akun" };

export default async function ImportInternAccountsPage() {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");
  return <AppLayout pageLabel="Impor Akun Magang"><InternAccountImport /></AppLayout>;
}
