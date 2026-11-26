import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";
import DafdukServiceSelection from "@/components/dafduk/DafdukServiceSelection";
import { requireMentorDivision } from "@/lib/mentorAccess";

export const metadata: Metadata = {
  title: "Pendaftaran Kependudukan - GUIDEBOOK ADMINDUK",
};

export default async function DafdukPage() {
  await requireMentorDivision("dafduk");
  return (
    <AppLayout pageLabel="Pendaftaran Kependudukan">
      <DafdukServiceSelection />
    </AppLayout>
  );
}
