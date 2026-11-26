import type { Metadata } from "next";
import { auth } from "../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import SopDirectory from "@/components/sop/SopDirectory";
import { getSopCases } from "@/lib/sopCases";
import { getHolidayCalendarData } from "@/lib/holidayCalendar";
import { getSopAccess } from "@/lib/sopAccess";

export const metadata: Metadata = {
  title: "Direktori SOP - GUIDEBOOK ADMINDUK",
};

export default async function SopDirectoryPage({ searchParams }: { searchParams?: Promise<{ status?: string; view?: string }> }) {
  const session = await auth();
  const access = session?.user ? await getSopAccess(Number(session.user.id)) : null;
  const params = searchParams ? await searchParams : {};
  const showArchived = Boolean(access?.canManage && params.view === "archive");
  const [cases, calendar] = await Promise.all([
    getSopCases(access?.categories ?? [], showArchived),
    getHolidayCalendarData(),
  ]);

  return (
    <AppLayout pageLabel="Direktori SOP">
      <SopDirectory
        cases={cases}
        allowedCategories={access?.categories ?? []}
        canManage={access?.canManage ?? false}
        showArchived={showArchived}
        status={params.status}
        {...calendar}
      />
    </AppLayout>
  );
}
