import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";
import SopDirectory from "@/components/sop/SopDirectory";
import { getSopCases } from "@/lib/sopCases";
import { getHolidayCalendarData } from "@/lib/holidayCalendar";

export const metadata: Metadata = {
  title: "SOP Directory - GUIDEBOOK ADMINDUK",
};

export default async function SopDirectoryPage() {
  const [cases, calendar] = await Promise.all([getSopCases(), getHolidayCalendarData()]);

  return (
    <AppLayout pageLabel="SOP Directory">
      <SopDirectory cases={cases} {...calendar} />
    </AppLayout>
  );
}
