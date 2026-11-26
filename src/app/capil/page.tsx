import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";
import CapilModule from "@/components/capil/CapilModule";
import { requireMentorDivision } from "@/lib/mentorAccess";

export const metadata: Metadata = {
  title: "Pencatatan Sipil - GUIDEBOOK ADMINDUK",
};

export default async function CapilPage() {
  await requireMentorDivision("capil");
  return (
    <AppLayout pageLabel="Pencatatan Sipil">
      <CapilModule />
    </AppLayout>
  );
}
