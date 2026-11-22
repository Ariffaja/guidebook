import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import SopCaseForm from "@/components/sop/SopCaseForm";

export const metadata: Metadata = {
  title: "Tambah Kasus - SOP Management",
};

export default async function NewSopCasePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <AppLayout pageLabel="Tambah Kasus SOP">
      <SopCaseForm />
    </AppLayout>
  );
}
