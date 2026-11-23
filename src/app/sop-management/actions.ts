"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { getSopCases } from "@/lib/sopCases";
import { SOP_DEADLINE_TOKEN } from "@/components/sop/sopDeadline";

export type SopFormState = { error?: string };

const allowedTypes = {
  dafduk: ["pindah-datang", "pindah-keluar"],
  capil: ["kematian", "kelahiran"],
} as const;

async function requireSopManager() {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "MENTOR") redirect("/");
}

function readForm(formData: FormData) {
  const category = formData.get("category");
  const caseType = formData.get("caseType");
  const classification = formData.get("classification");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const template = String(formData.get("template") ?? "").trim();
  const hasDeadline = formData.get("hasDeadline") === "on";
  const deadlineValue = String(formData.get("deadlineBusinessDays") ?? "").trim();

  if (category !== "dafduk" && category !== "capil") {
    return { error: "Pilih kategori Dafduk atau Capil." } as const;
  }
  if (
    typeof caseType !== "string" ||
    !(allowedTypes[category] as readonly string[]).includes(caseType)
  ) {
    return { error: "Pilih jenis kasus yang sesuai dengan kategori." } as const;
  }
  if (classification !== "BTL" && classification !== "TDP") {
    return { error: "Pilih klasifikasi BTL atau TDP." } as const;
  }
  if (!title) return { error: "Judul kasus wajib diisi." } as const;
  if (!template) return { error: "Templat respons wajib diisi." } as const;
  if (hasDeadline && classification !== "BTL") {
    return { error: "Tenggat kelengkapan hanya tersedia untuk kasus BTL." } as const;
  }
  let deadlineBusinessDays: number | null = null;
  if (hasDeadline) {
    const days = Number(deadlineValue);
    if (!Number.isInteger(days) || days < 1 || days > 30) {
      return { error: "Durasi tenggat harus antara 1 sampai 30 hari kerja." } as const;
    }
    if (!template.includes(SOP_DEADLINE_TOKEN)) {
      return { error: `Sisipkan variabel ${SOP_DEADLINE_TOKEN} ke templat agar tanggal tenggat ditampilkan.` } as const;
    }
    deadlineBusinessDays = days;
  } else if (template.includes(SOP_DEADLINE_TOKEN)) {
    return { error: "Aktifkan tenggat kelengkapan atau hapus variabel tanggal tenggat dari templat." } as const;
  }

  return {
    data: {
      category,
      caseType,
      classification,
      deadlineBusinessDays,
      title,
      description: description || null,
      template,
    },
  } as const;
}

export async function createSopCase(_previous: SopFormState, formData: FormData): Promise<SopFormState> {
  await requireSopManager();
  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;
  await getSopCases();
  const lastPosition = await prisma.sopCase.aggregate({ _max: { sortOrder: true } });

  await prisma.sopCase.create({
    data: { id: randomUUID(), sortOrder: (lastPosition._max.sortOrder ?? -1) + 1, ...parsed.data },
  });
  revalidatePath("/sop-directory");
  revalidatePath("/sop-management");
  redirect("/sop-directory?status=created");
}

export async function updateSopCase(
  id: string,
  _previous: SopFormState,
  formData: FormData,
): Promise<SopFormState> {
  await requireSopManager();
  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;
  await getSopCases();

  try {
    await prisma.sopCase.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "Kasus tidak ditemukan atau gagal diperbarui. Muat ulang halaman lalu coba lagi." };
  }

  revalidatePath("/sop-directory");
  revalidatePath("/sop-management");
  redirect("/sop-directory?status=updated");
}

export async function deleteSopCase(formData: FormData): Promise<void> {
  await requireSopManager();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/sop-directory?status=error");
  await getSopCases();

  try {
    await prisma.sopCase.delete({ where: { id } });
  } catch {
    redirect("/sop-directory?status=error");
  }

  revalidatePath("/sop-directory");
  revalidatePath("/sop-management");
  redirect("/sop-directory?status=deleted");
}

