import type { DocumentSelection, VerificationDocument } from "./birthVerificationData";

/**
 * Logika evaluasi, disalin dari fungsi updateDocState() dan evaluateOverall() di HTML Stitch.
 * Fungsi murni tanpa akses DOM, jadi mudah diuji.
 */

/** Hasil evaluasi satu dokumen. */
export type DocumentResult = "pending" | "valid" | "perbaikan" | "tolak";

/** Status akhir seluruh berkas. "menunggu" = belum 7 dokumen terisi lengkap. */
export type OverallStatus = "menunggu" | "siap" | "btl" | "tdp";

export type Evaluation = {
  completedCount: number;
  totalCount: number;
  percent: number;
  status: OverallStatus;
  /** Daftar masalah per dokumen (BTL dan TDP digabung, urutan dokumen 1-7). */
  issues: string[];
  results: DocumentResult[];
};

export const TOTAL_DOCUMENTS = 7;

export type BirthParentClassification = "asi" | "anak-ibu-dan-ayah";

export function todayInJakarta(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "0";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** Rejects partial native date-input values such as year 0002 while the user is typing. */
export function isValidClassificationDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return false;
  return value <= todayInJakarta();
}

function normalizedTime(value: string): string {
  return value.length === 5 ? `${value}:00` : value;
}

/**
 * Menentukan klasifikasi dari tanggal perkawinan dan tanggal lahir.
 * Waktu hanya dibandingkan bila kedua peristiwa terjadi pada tanggal yang sama.
 */
export function classifyBirthParentStatus(
  birthDate: string,
  marriageDate: string,
  birthTime = "",
  marriageTime = "",
): BirthParentClassification | null {
  if (!isValidClassificationDate(birthDate) || !isValidClassificationDate(marriageDate)) return null;
  if (birthDate < marriageDate) return "asi";
  if (birthDate > marriageDate) return "anak-ibu-dan-ayah";
  if (!birthTime || !marriageTime) return null;
  return normalizedTime(birthTime) < normalizedTime(marriageTime)
    ? "asi"
    : "anak-ibu-dan-ayah";
}

export const DIRECTIVE_PLACEHOLDER =
  "[Template arahan pesan perbaikan / tindak lanjut operator akan muncul otomatis sesuai hasil pemeriksaan di sini]";

/** Satu dokumen dianggap selesai setelah kondisi lampiran fisik dipilih. */
export function isDocumentComplete(selection: DocumentSelection): boolean {
  return selection.image !== "";
}

export function evaluateDocument(selection: DocumentSelection): DocumentResult {
  if (!isDocumentComplete(selection)) return "pending";
  if (selection.image === "jelas") return "valid";
  if (selection.image === "salah_unggah") return "tolak";
  return "perbaikan";
}

export function evaluateAll(
  documents: VerificationDocument[],
  selections: DocumentSelection[],
): Evaluation {
  const results = selections.map(evaluateDocument);
  const issues: string[] = [];
  let completedCount = 0;
  let hasTDP = false;
  let hasBTL = false;

  results.forEach((result, index) => {
    if (result === "pending") return;
    completedCount += 1;
    const title = documents[index].shortTitle;
    if (result === "tolak") {
      hasTDP = true;
      issues.push(`${title}: Lampiran salah unggah, rusak, atau tidak valid.`);
    } else if (result === "perbaikan") {
      hasBTL = true;
      issues.push(`${title}: Lampiran buram, terpotong, atau belum terbaca jelas.`);
    }
  });

  let status: OverallStatus = "menunggu";
  const totalCount = documents.length;
  // Status hanya ditentukan setelah seluruh dokumen yang berlaku terisi.
  if (completedCount === totalCount) {
    status = hasTDP ? "tdp" : hasBTL ? "btl" : "siap";
  }

  return {
    completedCount,
    totalCount,
    percent: totalCount ? Math.round((completedCount / totalCount) * 100) : 0,
    status,
    issues,
    results,
  };
}

export function buildDirective(evaluation: Evaluation, serviceName = "NIK Bayi Kecil"): string {
  const list = evaluation.issues.join("\n- ");

  switch (evaluation.status) {
    case "tdp":
      return `Yth. Pemohon PLAVON,\nPermohonan ${serviceName} TIDAK DAPAT DIPROSES (TDP) karena lampiran fisik berikut tidak valid:\n- ${list}\nSilakan ajukan permohonan baru dengan melampirkan berkas fisik asli yang sah.`;
    case "btl":
      return `Yth. Pemohon PLAVON,\nStatus permohonan Kelahiran ${serviceName}: PERBAIKAN BERKAS (BTL).\nMohon unggah ulang lampiran berikut dengan foto yang jelas dan utuh:\n- ${list}\nBatas waktu unggah perbaikan berkas adalah 3x24 jam melalui portal PLAVON.`;
    case "siap":
      return `[PEMERIKSAAN AWAL SELESAI]\nSeluruh lampiran yang berlaku untuk ${serviceName} telah memenuhi kriteria pemeriksaan awal.\nBerkas dapat ditindaklanjuti oleh operator sesuai prosedur yang berlaku.`;
    default:
      return DIRECTIVE_PLACEHOLDER;
  }
}
