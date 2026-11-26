import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { getSopAccess } from "@/lib/sopAccess";
import type { SopCategory } from "@/components/sop/sopTypes";

/** Pastikan mentor hanya membuka layanan pada divisi yang ditetapkan admin. */
export async function requireMentorDivision(category: SopCategory) {
  const session = await auth();
  if (session?.user?.role !== "MENTOR") return;

  const access = await getSopAccess(Number(session.user.id));
  if (!access?.categories.includes(category)) redirect("/mentor");
}
