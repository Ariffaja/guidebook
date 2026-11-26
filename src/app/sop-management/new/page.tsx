import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import SopCaseForm from "@/components/sop/SopCaseForm";
import { getSopAccess } from "@/lib/sopAccess";

export const metadata: Metadata = {
  title: "Tambah Kasus SOP - Direktori SOP",
};

export default async function NewSopCasePage() {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  const access = await getSopAccess(Number(session.user.id));
  if (!access?.canManage) redirect("/");

  return (
    <AppLayout pageLabel="Tambah Kasus SOP">
      <SopCaseForm allowedCategories={access.categories} />
    </AppLayout>
  );
}
