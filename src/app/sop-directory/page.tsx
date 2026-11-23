import type { Metadata } from "next";
import { auth } from "../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import SopDirectory from "@/components/sop/SopDirectory";
import { getSopCases } from "@/lib/sopCases";
import { getHolidayCalendarData } from "@/lib/holidayCalendar";

export const metadata: Metadata = {
  title: "SOP Directory - GUIDEBOOK ADMINDUK",
};

export default async function SopDirectoryPage({ searchParams }: { searchParams?: Promise<{ status?: string }> }) {
  const session = await auth();
  const [cases, calendar] = await Promise.all([getSopCases(), getHolidayCalendarData()]);
  const { status } = searchParams ? await searchParams : {};
  const canManage = session?.user?.role === "ADMIN" || session?.user?.role === "MENTOR";

  return (
    <AppLayout pageLabel="SOP Directory">
      <SopDirectory cases={cases} canManage={canManage} status={status} {...calendar} />
    </AppLayout>
  );
}
