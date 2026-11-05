import type {
  DeathDocumentSelection,
  DeathVerificationDocument,
} from "./deathVerificationData";

/**
 * Logika evaluasi Verifikasi Berkas Kematian. Fungsi murni tanpa akses DOM.
 * Catatan: arti nilai input BERBEDA dari kelahiran
 * (di sini tidak_sesuai = TOLAK, tidak_lengkap = PERBAIKAN).
 */

/** Hasil evaluasi satu dokumen. */
export type DeathDocumentResult = "pending" | "valid" | "perbaikan" | "tolak";

/** Status akhir. "menunggu" = belum 6 dokumen terisi lengkap. */
export type DeathOverallStatus = "menunggu" | "siap" | "btl" | "tdp";

export type DeathEvaluation = {
  completedCount: number;
  percent: number;
  status: DeathOverallStatus;
  results: DeathDocumentResult[];
  /** Dokumen berstatus TOLAK (dipakai template TDP). */
  tolakIssues: string[];
  /** Dokumen berstatus PERBAIKAN (dipakai template BTL). */
  perbaikanIssues: string[];
};

export const TOTAL_DEATH_DOCUMENTS = 6;

export const DEATH_DIRECTIVE_PLACEHOLDER =
  "[Template arahan pesan perbaikan / tindak lanjut operator akan muncul otomatis sesuai hasil pemeriksaan di sini]";

/** Satu dokumen dianggap selesai hanya jika kedua pemeriksaan sudah diisi. */
export function isDocumentComplete(selection: DeathDocumentSelection): boolean {
  return selection.input !== "" && selection.image !== "";
}

export function evaluateDocument(selection: DeathDocumentSelection): DeathDocumentResult {
  if (!isDocumentComplete(selection)) return "pending";
  if (selection.input === "sesuai" && selection.image === "jelas") return "valid";
  if (selection.input === "tidak_sesuai" || selection.image === "salah_unggah") return "tolak";
  // Sisanya: input tidak_lengkap atau gambar buram (dan tidak memenuhi kondisi TOLAK).
  return "perbaikan";
}

export function evaluateAll(
  documents: DeathVerificationDocument[],
  selections: DeathDocumentSelection[],
): DeathEvaluation {
  const results = selections.map(evaluateDocument);
  const tolakIssues: string[] = [];
  const perbaikanIssues: string[] = [];
  let completedCount = 0;

  results.forEach((result, index) => {
    if (result === "pending") return;
    completedCount += 1;
    const title = documents[index].title;
    if (result === "tolak") {
      tolakIssues.push(`${title} (Data tidak sesuai SIAK / berkas fisik tidak valid)`);
    } else if (result === "perbaikan") {
      perbaikanIssues.push(`${title} (Data kurang lengkap / berkas fisik buram)`);
    }
  });

  // Status hanya ditentukan setelah keenam dokumen terisi. TDP lebih diutamakan daripada BTL.
  let status: DeathOverallStatus = "menunggu";
  if (completedCount === TOTAL_DEATH_DOCUMENTS) {
    status = tolakIssues.length > 0 ? "tdp" : perbaikanIssues.length > 0 ? "btl" : "siap";
  }

  return {
    completedCount,
    percent: Math.round((completedCount / TOTAL_DEATH_DOCUMENTS) * 100),
    status,
    results,
    tolakIssues,
    perbaikanIssues,
  };
}

export function buildDirective(evaluation: DeathEvaluation): string {
  switch (evaluation.status) {
    case "tdp":
      return `Yth. Pemohon PLAVON, pengajuan Akta Kematian Anda TIDAK DAPAT DIPROSES (TDP) karena terdapat ketidaksesuaian data pokok: ${evaluation.tolakIssues.join(", ")}. Silakan lakukan permohonan ulang dengan data kependudukan yang sah.`;
    case "btl":
      return `Yth. Pemohon PLAVON, berkas Akta Kematian Anda status BERKAS TIDAK LENGKAP (BTL). Mohon unggah kembali dokumen berikut dengan foto yang jelas/terbaca: ${evaluation.perbaikanIssues.join(", ")}. Batas perbaikan 3x24 jam.`;
    case "siap":
      return "[PEMERIKSAAN AWAL SELESAI] Keenam dokumen telah memenuhi kriteria pemeriksaan awal dan dapat ditindaklanjuti operator sesuai prosedur yang berlaku.";
    default:
      return DEATH_DIRECTIVE_PLACEHOLDER;
  }
}
