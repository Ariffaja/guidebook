import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import AccountManagement, { type AccountRow } from "@/components/accounts/AccountManagement";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Manajemen Akun - GUIDEBOOK ADMINDUK" };

export default async function AccountManagementPage({ searchParams }: { searchParams?: Promise<{ status?: string }> }) {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");
  const params = searchParams ? await searchParams : {};
  const users = await prisma.user.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    include: { role: { select: { name: true } }, sopDivisions: { select: { division: true } } },
  });
  const accounts: AccountRow[] = users.map(({ id, name, email, role, isActive, sopDivisions }) => ({
    id,
    name,
    email,
    role: role.name,
    isActive,
    sopDivisions: sopDivisions.map(({ division }) => division),
  }));

  return <AppLayout pageLabel="Manajemen Akun"><AccountManagement accounts={accounts} currentUserId={Number(session.user.id)} status={params.status} /></AppLayout>;
}
