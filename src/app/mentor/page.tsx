import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import MentorDashboard from "@/components/mentor/MentorDashboard";
import { getSopAccess } from "@/lib/sopAccess";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Dashboard Mentor - GUIDEBOOK ADMINDUK" };

export default async function MentorPage() {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  if (session.user.role !== "MENTOR") redirect("/");

  const access = await getSopAccess(Number(session.user.id));
  const categories = access?.categories ?? [];
  const whereAllowed = { category: { in: categories } };

  const [activeSops, archivedSops, btlCount, tdpCount, activities, divisionCounts] = await Promise.all([
    prisma.sopCase.count({ where: { ...whereAllowed, isArchived: false } }),
    prisma.sopCase.count({ where: { ...whereAllowed, isArchived: true } }),
    prisma.sopCase.count({ where: { ...whereAllowed, isArchived: false, classification: "BTL" } }),
    prisma.sopCase.count({ where: { ...whereAllowed, isArchived: false, classification: "TDP" } }),
    categories.length > 0
      ? prisma.sopAuditLog.findMany({ where: { category: { in: categories } }, orderBy: { createdAt: "desc" }, take: 6, select: { id: true, sopTitle: true, category: true, action: true, actorName: true, createdAt: true } })
      : Promise.resolve([]),
    Promise.all(categories.map(async (key) => ({
      key,
      activeSops: await prisma.sopCase.count({ where: { category: key, isArchived: false } }),
      archivedSops: await prisma.sopCase.count({ where: { category: key, isArchived: true } }),
    }))),
  ]);

  const divisionMeta = {
    dafduk: { label: "Pendaftaran Kependudukan", href: "/dafduk" },
    capil: { label: "Pencatatan Sipil", href: "/capil" },
  } as const;
  const divisions = divisionCounts.map((division) => ({ ...divisionMeta[division.key], ...division }));

  return (
    <AppLayout pageLabel="Dashboard Mentor">
      <MentorDashboard
        name={session.user.name?.trim() || "Mentor"}
        divisions={divisions}
        activities={activities.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))}
        btlCount={btlCount}
        tdpCount={tdpCount}
      />
    </AppLayout>
  );
}
