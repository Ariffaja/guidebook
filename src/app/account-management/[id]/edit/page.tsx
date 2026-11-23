import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import AppLayout from "@/components/layout/AppLayout";
import AccountForm from "@/components/accounts/AccountForm";
import AccountPasswordReset from "@/components/accounts/AccountPasswordReset";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Edit Akun - Manajemen Akun" };

export default async function EditAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const account = await prisma.user.findUnique({
    where: { id },
    include: { role: { select: { name: true } }, sopDivisions: { select: { division: true } } },
  });
  if (!account) notFound();

  return <AppLayout pageLabel="Edit Akun"><div className="mx-auto w-full max-w-2xl pb-8">
    <AccountForm initial={{
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role.name,
      sopDivisions: account.sopDivisions.map(({ division }) => division),
    }} />
    <section className="mt-5 rounded-xl border border-[#e0e3e5] bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-lg font-semibold text-[#191c1e]">Reset sandi akun</h2>
      <AccountPasswordReset id={account.id} />
    </section>
  </div></AppLayout>;
}
