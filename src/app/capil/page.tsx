import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";
import CapilModule from "@/components/capil/CapilModule";

export const metadata: Metadata = {
  title: "Pencatatan Sipil - GUIDEBOOK ADMINDUK",
};

export default function CapilPage() {
  return (
    <AppLayout pageLabel="Pencatatan Sipil">
      <CapilModule />
    </AppLayout>
  );
}
