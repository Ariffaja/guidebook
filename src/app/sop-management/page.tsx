import { redirect } from "next/navigation";

export default async function SopManagementPage({ searchParams }: { searchParams?: Promise<{ status?: string }> }) {
  const { status } = searchParams ? await searchParams : {};
  redirect(status ? "/sop-directory?status=" + encodeURIComponent(status) : "/sop-directory");
}
