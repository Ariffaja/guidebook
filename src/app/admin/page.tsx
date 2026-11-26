import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Dashboard Admin - GUIDEBOOK ADMINDUK" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const [
    accounts,
    activeAccounts,
    inactiveAccounts,
    mentors,
    interns,
    mentorsWithoutDivision,
    activeSops,
    archivedSops,
    dafdukSops,
    capilSops,
    activities,
    recentAccounts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: false } }),
    prisma.user.count({ where: { role: { is: { name: "MENTOR" } } } }),
    prisma.user.count({ where: { role: { is: { name: "MAGANG" } } } }),
    prisma.user.count({ where: { isActive: true, role: { is: { name: "MENTOR" } }, sopDivisions: { none: {} } } }),
    prisma.sopCase.count({ where: { isArchived: false } }),
    prisma.sopCase.count({ where: { isArchived: true } }),
    prisma.sopCase.count({ where: { isArchived: false, category: "dafduk" } }),
    prisma.sopCase.count({ where: { isArchived: false, category: "capil" } }),
    prisma.sopAuditLog.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, sopTitle: true, category: true, action: true, actorName: true, createdAt: true } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, createdAt: true, role: { select: { name: true } } } }),
  ]);

  return (
    <AppLayout pageLabel="Dashboard Admin">
      <AdminDashboard
        stats={{ accounts, activeAccounts, inactiveAccounts, mentors, interns, activeSops, archivedSops, dafdukSops, capilSops }}
        mentorsWithoutDivision={mentorsWithoutDivision}
        activities={activities.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))}
        recentAccounts={recentAccounts.map(({ id, name, email, createdAt, role }) => ({ id, name, email, role: role.name, createdAt: createdAt.toISOString() }))}
      />
    </AppLayout>
  );
}
