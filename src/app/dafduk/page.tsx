import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";
import DafdukServiceSelection from "@/components/dafduk/DafdukServiceSelection";

export const metadata: Metadata = {
  title: "Pendaftaran Kependudukan - GUIDEBOOK ADMINDUK",
};

export default function DafdukPage() {
  return (
    <AppLayout pageLabel="Pendaftaran Kependudukan">
      <DafdukServiceSelection />
    </AppLayout>
  );
}
