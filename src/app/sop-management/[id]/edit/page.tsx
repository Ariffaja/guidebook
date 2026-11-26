import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import SopCaseForm from "@/components/sop/SopCaseForm";
import { getSopCases } from "@/lib/sopCases";
import { getSopAccess } from "@/lib/sopAccess";

export const metadata: Metadata = {
  title: "Ubah Kasus SOP - Direktori SOP",
};

export default async function EditSopCasePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  const access = await getSopAccess(Number(session.user.id));
  if (!access?.canManage) redirect("/");

  const { id } = await params;
  const cases = await getSopCases(access.categories);
  const sopCase = cases.find((item) => item.id === id);
  if (!sopCase) notFound();

  return (
    <AppLayout pageLabel="Ubah Kasus SOP">
      <SopCaseForm initial={sopCase} allowedCategories={access.categories} />
    </AppLayout>
  );
}
