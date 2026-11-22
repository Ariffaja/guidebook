import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

export const MAX_INTERN_IMPORT_ROWS = 500;
export type InternImportRow = { rowNumber: number; name: string; email: string; errors: string[] };
export type InternImportPreview = { rows: InternImportRow[]; error?: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const toCellText = (value: unknown) => String(value ?? "").trim();

export async function parseInternWorkbook(file: File): Promise<InternImportPreview> {
  if (!file.name.toLowerCase().endsWith(".xlsx")) return { rows: [], error: "Unggah file Excel .xlsx dari templat yang disediakan." };
  if (file.size === 0 || file.size > 5 * 1024 * 1024) return { rows: [], error: "Ukuran file harus lebih dari 0 dan maksimal 5 MB." };

  let workbook: XLSX.WorkBook;
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    workbook = XLSX.read(bytes, { type: "array", sheetRows: MAX_INTERN_IMPORT_ROWS + 2, cellFormula: false, cellHTML: false });
  } catch {
    return { rows: [], error: "File Excel tidak dapat dibaca. Unduh ulang templat lalu coba lagi." };
  }

  const firstSheetName = workbook.SheetNames[0];
  const sheet = firstSheetName ? workbook.Sheets[firstSheetName] : undefined;
  if (!sheet) return { rows: [], error: "Sheet Akun Magang tidak ditemukan di file." };
  const fullRange = sheet["!fullref"] ?? sheet["!ref"];
  if (typeof fullRange === "string" && XLSX.utils.decode_range(fullRange).e.r > MAX_INTERN_IMPORT_ROWS) {
    return { rows: [], error: `Maksimal ${MAX_INTERN_IMPORT_ROWS} akun per impor.` };
  }
  const records = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", raw: false, blankrows: false });
  const header = (records[0] ?? []).map((cell) => toCellText(cell).toLowerCase());
  const nameColumn = header.indexOf("nama");
  const emailColumn = header.indexOf("email");
  if (nameColumn < 0 || emailColumn < 0) return { rows: [], error: "Baris pertama harus memuat judul kolom Nama dan Email." };
  const dataRows = records.slice(1).filter((row) => row.some((cell) => toCellText(cell) !== ""));
  if (dataRows.length === 0) return { rows: [], error: "File belum berisi data akun." };
  if (dataRows.length > MAX_INTERN_IMPORT_ROWS) return { rows: [], error: `Maksimal ${MAX_INTERN_IMPORT_ROWS} akun per impor.` };

  const seenEmails = new Set<string>();
  const rows: InternImportRow[] = dataRows.map((record, index) => {
    const name = toCellText(record[nameColumn]);
    const email = toCellText(record[emailColumn]).toLowerCase();
    const errors: string[] = [];
    if (!name) errors.push("Nama wajib diisi.");
    else if (name.length > 100) errors.push("Nama maksimal 100 karakter.");
    if (!email) errors.push("Email wajib diisi.");
    else if (email.length > 191 || !emailPattern.test(email)) errors.push("Format email tidak valid.");
    if (email && emailPattern.test(email)) {
      if (seenEmails.has(email)) errors.push("Email duplikat di dalam file.");
      seenEmails.add(email);
    }
    return { rowNumber: index + 2, name, email, errors };
  });

  const validEmails = [...new Set(rows.filter((row) => row.errors.length === 0).map((row) => row.email))];
  if (validEmails.length) {
    // Existing account duplicates are surfaced in the preview and rechecked on final import.
    const existing = await prisma.user.findMany({ where: { email: { in: validEmails } }, select: { email: true } });
    const existingEmails = new Set(existing.map((account) => account.email.toLowerCase()));
    for (const row of rows) if (existingEmails.has(row.email)) row.errors.push("Email sudah terdaftar.");
  }

  return { rows };
}
