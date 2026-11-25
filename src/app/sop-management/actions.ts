"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { getSopCases } from "@/lib/sopCases";
import { getSopAccess } from "@/lib/sopAccess";
import { createSopAuditLog, getSopAuditChanges, type SopAuditActor } from "@/lib/sopAudit";
import { SOP_DEADLINE_TOKEN } from "@/components/sop/sopDeadline";

export type SopFormState = { error?: string };

const allowedTypes = {
  dafduk: ["pindah-datang", "pindah-keluar"],
  capil: ["kematian", "kelahiran"],
} as const;

async function requireSopManager() {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  const access = await getSopAccess(Number(session.user.id));
  if (!access?.canManage) redirect("/");
  return {
    ...access,
    actor: {
      userId: Number(session.user.id),
      name: session.user.name?.trim() || "Pengguna",
      email: session.user.email ?? "",
    } satisfies SopAuditActor,
  };
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
  const access = await requireSopManager();
  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;
  if (!access.categories.includes(parsed.data.category)) return { error: "Kamu tidak memiliki akses ke divisi SOP tersebut." };
  await getSopCases();
  const lastPosition = await prisma.sopCase.aggregate({ _max: { sortOrder: true } });

  const id = randomUUID();
  await prisma.$transaction(async (tx) => {
    await tx.sopCase.create({
      data: { id, sortOrder: (lastPosition._max.sortOrder ?? -1) + 1, ...parsed.data },
    });
    await createSopAuditLog(tx, {
      sopCaseId: id,
      sopTitle: parsed.data.title,
      category: parsed.data.category,
      action: "CREATE",
      actor: access.actor,
      details: { changes: getSopAuditChanges(null, parsed.data as Record<string, unknown>) },
    });
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
  const access = await requireSopManager();
  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;
  if (!access.categories.includes(parsed.data.category)) return { error: "Kamu tidak memiliki akses ke divisi SOP tersebut." };
  await getSopCases();

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.sopCase.findUnique({ where: { id } });
      if (!existing || existing.isArchived || !access.categories.includes(existing.category as "dafduk" | "capil")) return null;
      const updatedCase = await tx.sopCase.update({ where: { id }, data: parsed.data });
      await createSopAuditLog(tx, {
        sopCaseId: id,
        sopTitle: updatedCase.title,
        category: updatedCase.category,
        action: "UPDATE",
        actor: access.actor,
        details: { changes: getSopAuditChanges(existing as unknown as Record<string, unknown>, updatedCase as unknown as Record<string, unknown>) },
      });
      return updatedCase;
    });
    if (!updated) return { error: "Kasus tidak ditemukan atau kamu tidak memiliki akses untuk mengubahnya." };
  } catch {
    return { error: "Kasus tidak ditemukan atau gagal diperbarui. Muat ulang halaman lalu coba lagi." };
  }

  revalidatePath("/sop-directory");
  revalidatePath("/sop-management");
  redirect("/sop-directory?status=updated");
}

async function setSopCaseArchived(formData: FormData, isArchived: boolean): Promise<void> {
  const access = await requireSopManager();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/sop-directory?status=error");
  await getSopCases(access.categories, isArchived);

  let changed = false;
  try {
    changed = await prisma.$transaction(async (tx) => {
      const existing = await tx.sopCase.findUnique({ where: { id } });
      if (
        !existing ||
        !access.categories.includes(existing.category as "dafduk" | "capil") ||
        existing.isArchived === isArchived
      ) return false;
      const updatedCase = await tx.sopCase.update({ where: { id }, data: { isArchived } });
      await createSopAuditLog(tx, {
        sopCaseId: id,
        sopTitle: existing.title,
        category: existing.category,
        action: isArchived ? "ARCHIVE" : "RESTORE",
        actor: access.actor,
        details: {
          changes: [{ field: "isArchived", oldValue: existing.isArchived, newValue: updatedCase.isArchived }],
        },
      });
      return true;
    });
  } catch {
    redirect("/sop-directory?status=error");
  }
  if (!changed) redirect("/sop-directory?status=error");

  revalidatePath("/sop-directory");
  revalidatePath("/sop-management");
  redirect(isArchived ? "/sop-directory?status=archived" : "/sop-directory?status=restored");
}

export async function archiveSopCase(formData: FormData): Promise<void> {
  await setSopCaseArchived(formData, true);
}

export async function restoreSopCase(formData: FormData): Promise<void> {
  await setSopCaseArchived(formData, false);
}

export async function deleteArchivedSopCase(formData: FormData): Promise<void> {
  const access = await requireSopManager();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/sop-directory?view=archive&status=error");

  try {
    const deleted = await prisma.$transaction(async (tx) => {
      const existing = await tx.sopCase.findUnique({ where: { id } });
      if (
        !existing ||
        !existing.isArchived ||
        !access.categories.includes(existing.category as "dafduk" | "capil")
      ) return false;
      await createSopAuditLog(tx, {
        sopCaseId: id,
        sopTitle: existing.title,
        category: existing.category,
        action: "DELETE",
        actor: access.actor,
        details: {
          changes: getSopAuditChanges(existing as unknown as Record<string, unknown>, null),
        },
      });
      await tx.sopCase.delete({ where: { id } });
      return true;
    });
    if (!deleted) redirect("/sop-directory?view=archive&status=error");
  } catch {
    redirect("/sop-directory?view=archive&status=error");
  }

  revalidatePath("/sop-directory");
  revalidatePath("/sop-management");
  redirect(`/sop-directory/${encodeURIComponent(id)}/history?deleted=1`);
}

