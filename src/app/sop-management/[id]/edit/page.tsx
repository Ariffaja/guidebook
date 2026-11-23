import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import SopCaseForm from "@/components/sop/SopCaseForm";
import { getSopCases } from "@/lib/sopCases";

export const metadata: Metadata = {
  title: "Edit Kasus SOP - SOP Directory",
};

export default async function EditSopCasePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "MENTOR") redirect("/");

  const { id } = await params;
  const cases = await getSopCases();
  const sopCase = cases.find((item) => item.id === id);
  if (!sopCase) notFound();

  return (
    <AppLayout pageLabel="Edit Kasus SOP">
      <SopCaseForm initial={sopCase} />
    </AppLayout>
  );
}
