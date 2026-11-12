import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";
import SopDirectory from "@/components/sop/SopDirectory";

export const metadata: Metadata = {
  title: "SOP Directory - GUIDEBOOK ADMINDUK",
};

export default function SopDirectoryPage() {
  return (
    <AppLayout pageLabel="SOP Directory">
      <SopDirectory />
    </AppLayout>
  );
}
