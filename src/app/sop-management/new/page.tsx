import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import SopCaseForm from "@/components/sop/SopCaseForm";

export const metadata: Metadata = {
  title: "Tambah Kasus SOP - SOP Directory",
};

export default async function NewSopCasePage() {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "MENTOR") redirect("/");

  return (
    <AppLayout pageLabel="Tambah Kasus SOP">
      <SopCaseForm />
    </AppLayout>
  );
}
