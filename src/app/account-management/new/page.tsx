import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import AccountForm from "@/components/accounts/AccountForm";

export const metadata: Metadata = { title: "Tambah Akun - Manajemen Akun" };

export default async function NewAccountPage() {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");
  return <AppLayout pageLabel="Tambah Akun"><AccountForm /></AppLayout>;
}
