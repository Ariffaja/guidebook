import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import SopManagement from "@/components/sop/SopManagement";
import { getSopCases } from "@/lib/sopCases";
import { getHolidayCalendarData } from "@/lib/holidayCalendar";

export const metadata: Metadata = {
  title: "SOP Management - GUIDEBOOK ADMINDUK",
};

export default async function SopManagementPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const [cases, calendar] = await Promise.all([getSopCases(), getHolidayCalendarData()]);
  const { status } = searchParams ? await searchParams : {};

  return (
    <AppLayout pageLabel="SOP Management">
      <SopManagement cases={cases} status={status} {...calendar} />
    </AppLayout>
  );
}
