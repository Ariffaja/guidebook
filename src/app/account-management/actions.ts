"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { MAX_INTERN_IMPORT_ROWS, parseInternWorkbook, type InternImportRow } from "@/lib/internImport";
import { isSopDivisionKey } from "@/lib/sopAccess";

export type AccountFormState = { error?: string };
export type PasswordFormState = { error?: string; success?: string };
export type InternImportResult = { error?: string; preview?: InternImportRow[]; created?: number; skipped?: number };

const allowedRoles = ["ADMIN", "MENTOR", "MAGANG"] as const;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !session.user.isActive) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");
  return session.user;
}

function readAccountForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "");
  const rawDivisions = formData.getAll("sopDivisions").map(String);
  if (!name || name.length > 100) return { error: "Nama wajib diisi dan maksimal 100 karakter." } as const;
  if (!email || email.length > 191 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Masukkan alamat email yang valid." } as const;
  if (!allowedRoles.includes(role as (typeof allowedRoles)[number])) return { error: "Pilih role akun yang tersedia." } as const;
  if (role === "MENTOR" && (rawDivisions.length === 0 || rawDivisions.some((division) => !isSopDivisionKey(division)))) {
    return { error: "Pilih minimal satu divisi SOP untuk akun mentor." } as const;
  }
  const sopDivisions = role === "MENTOR" ? [...new Set(rawDivisions.filter(isSopDivisionKey))] : [];
  return { data: { name, email, role, sopDivisions } } as const;
}

async function getRoleId(role: string) {
  const row = await prisma.role.findUnique({ where: { name: role }, select: { id: true } });
  return row?.id ?? null;
}

function revalidateAccountPages() {
  revalidatePath("/account-management");
  revalidatePath("/sop-directory");
  revalidatePath("/");
}

export async function createAccount(_previous: AccountFormState, formData: FormData): Promise<AccountFormState> {
  await requireAdmin();
  const parsed = readAccountForm(formData);
  if ("error" in parsed) return parsed;
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Sandi awal minimal 8 karakter." };
  const roleId = await getRoleId(parsed.data.role);
  if (!roleId) return { error: "Role belum tersedia. Jalankan seed role terlebih dahulu." };

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        roleId,
        password: await bcrypt.hash(password, 12),
        sopDivisions: { create: parsed.data.sopDivisions.map((division) => ({ division })) },
      },
    });
  } catch {
    return { error: "Email sudah terdaftar atau akun gagal dibuat." };
  }
  revalidateAccountPages();
  redirect("/account-management?status=created");
}

export async function updateAccount(id: number, _previous: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const actor = await requireAdmin();
  const parsed = readAccountForm(formData);
  if ("error" in parsed) return parsed;
  const roleId = await getRoleId(parsed.data.role);
  if (!roleId) return { error: "Role belum tersedia. Jalankan seed role terlebih dahulu." };

  try {
    await prisma.$transaction(async (tx) => {
      const account = await tx.user.findUnique({ where: { id }, include: { role: true } });
      if (!account) throw new Error("ACCOUNT_NOT_FOUND");
      if (String(id) === actor.id && account.role.name === "ADMIN" && parsed.data.role !== "ADMIN") throw new Error("SELF_ROLE_CHANGE");
      if (account.isActive && account.role.name === "ADMIN" && parsed.data.role !== "ADMIN") {
        const activeAdmins = await tx.user.count({ where: { isActive: true, role: { is: { name: "ADMIN" } } } });
        if (activeAdmins <= 1) throw new Error("LAST_ACTIVE_ADMIN");
      }
      await tx.user.update({ where: { id }, data: { name: parsed.data.name, email: parsed.data.email, roleId } });
      await tx.userSopDivision.deleteMany({ where: { userId: id } });
      if (parsed.data.sopDivisions.length) {
        await tx.userSopDivision.createMany({
          data: parsed.data.sopDivisions.map((division) => ({ userId: id, division })),
        });
      }
    }, { isolationLevel: "Serializable" });
  } catch (error) {
    if (error instanceof Error && error.message === "ACCOUNT_NOT_FOUND") return { error: "Akun tidak ditemukan." };
    if (error instanceof Error && error.message === "SELF_ROLE_CHANGE") return { error: "Kamu tidak dapat mengubah role akun admin yang sedang digunakan." };
    if (error instanceof Error && error.message === "LAST_ACTIVE_ADMIN") return { error: "Role admin aktif terakhir tidak dapat diubah. Tambahkan admin lain terlebih dahulu." };
    return { error: "Email mungkin sudah digunakan akun lain. Periksa kembali lalu coba lagi." };
  }
  revalidateAccountPages();
  redirect("/account-management?status=updated");
}

export async function toggleAccountStatus(formData: FormData): Promise<void> {
  const actor = await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) redirect("/account-management?status=error");
  let result: "ok" | "missing" | "self-disabled" | "last-admin" = "missing";
  try {
    result = await prisma.$transaction(async (tx) => {
      const account = await tx.user.findUnique({ where: { id }, include: { role: true } });
      if (!account) return "missing";
      if (String(id) === actor.id && account.isActive) return "self-disabled";
      if (account.role.name === "ADMIN" && account.isActive) {
        const activeAdmins = await tx.user.count({ where: { isActive: true, role: { is: { name: "ADMIN" } } } });
        if (activeAdmins <= 1) return "last-admin";
      }
      await tx.user.update({ where: { id }, data: { isActive: !account.isActive } });
      return "ok";
    }, { isolationLevel: "Serializable" });
  } catch {
    redirect("/account-management?status=error");
  }
  if (result === "missing") redirect("/account-management?status=error");
  if (result === "self-disabled") redirect("/account-management?status=self-disabled");
  if (result === "last-admin") redirect("/account-management?status=last-admin");
  revalidateAccountPages();
  redirect("/account-management?status=status-updated");
}

export async function resetAccountPassword(id: number, _previous: PasswordFormState, formData: FormData): Promise<PasswordFormState> {
  await requireAdmin();
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (password.length < 8) return { error: "Sandi baru minimal 8 karakter." };
  if (password !== confirmation) return { error: "Konfirmasi sandi belum sama." };
  try {
    await prisma.user.update({ where: { id }, data: { password: await bcrypt.hash(password, 12) } });
  } catch {
    return { error: "Reset sandi gagal. Pastikan akun masih tersedia." };
  }
  revalidateAccountPages();
  return { success: "Sandi akun berhasil direset." };
}

export async function changeOwnPassword(_previous: PasswordFormState, formData: FormData): Promise<PasswordFormState> {
  const session = await auth();
  if (!session?.user || !session.user.isActive) return { error: "Sesi tidak aktif. Masuk kembali." };
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (password.length < 8) return { error: "Sandi baru minimal 8 karakter." };
  if (password !== confirmation) return { error: "Konfirmasi sandi belum sama." };
  if (password === currentPassword) return { error: "Sandi baru harus berbeda dari sandi saat ini." };

  const id = Number(session.user.id);
  const account = await prisma.user.findUnique({ where: { id }, select: { password: true } });
  if (!account || !(await bcrypt.compare(currentPassword, account.password))) return { error: "Sandi saat ini tidak sesuai." };
  await prisma.user.update({ where: { id }, data: { password: await bcrypt.hash(password, 12) } });
  revalidateAccountPages();
  return { success: "Sandi berhasil diubah." };
}

export async function previewInternImport(formData: FormData): Promise<InternImportResult> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Pilih file Excel yang akan diimpor." };
  const result = await parseInternWorkbook(file);
  if (result.error) return { error: result.error };
  return { preview: result.rows };
}

export async function importInternAccounts(
  inputRows: InternImportRow[],
  password: string,
  confirmation: string,
): Promise<InternImportResult> {
  await requireAdmin();
  if (!Array.isArray(inputRows) || inputRows.length === 0) return { error: "Pratinjau data akun tidak tersedia. Unggah ulang file Excel." };
  if (inputRows.length > MAX_INTERN_IMPORT_ROWS) return { error: `Maksimal ${MAX_INTERN_IMPORT_ROWS} akun per impor.` };
  if (typeof password !== "string" || password.length < 8) return { error: "Sandi awal minimal 8 karakter." };
  if (typeof confirmation !== "string" || password !== confirmation) return { error: "Konfirmasi sandi awal belum sama." };

  const seen = new Set<string>();
  const candidates: { name: string; email: string }[] = [];
  for (const row of inputRows) {
    if (!row || typeof row !== "object") continue;
    const name = String(row.name ?? "").trim();
    const email = String(row.email ?? "").trim().toLowerCase();
    if (!name || name.length > 100 || email.length > 191 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || seen.has(email)) continue;
    seen.add(email);
    candidates.push({ name, email });
  }
  if (!candidates.length) return { error: "Tidak ada baris valid untuk diimpor." };

  const role = await prisma.role.findUnique({ where: { name: "MAGANG" }, select: { id: true } });
  if (!role) return { error: "Role MAGANG belum tersedia. Jalankan seed role terlebih dahulu." };
  const emails = candidates.map((candidate) => candidate.email);
  const existingBeforeImport = await prisma.user.findMany({ where: { email: { in: emails } }, select: { email: true } });
  const existingEmailSet = new Set(existingBeforeImport.map((account) => account.email.toLowerCase()));
  const initiallyNew = candidates.filter((candidate) => !existingEmailSet.has(candidate.email));
  const hashedAccounts: { name: string; email: string; roleId: number; password: string }[] = [];
  for (let index = 0; index < initiallyNew.length; index += 10) {
    const batch = await Promise.all(initiallyNew.slice(index, index + 10).map(async (account) => ({
      ...account,
      roleId: role.id,
      password: await bcrypt.hash(password, 12),
    })));
    hashedAccounts.push(...batch);
  }
  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.user.findMany({ where: { email: { in: emails } }, select: { email: true } });
    const existingEmails = new Set(existing.map((account) => account.email.toLowerCase()));
    const newAccounts = hashedAccounts.filter((candidate) => !existingEmails.has(candidate.email));
    let createdCount = 0;
    for (let index = 0; index < newAccounts.length; index += 10) {
      const created = await tx.user.createMany({ data: newAccounts.slice(index, index + 10), skipDuplicates: true });
      createdCount += created.count;
    }
    return { created: createdCount, skipped: inputRows.length - createdCount };
  }, { isolationLevel: "Serializable" });

  revalidateAccountPages();
  return result;
}
