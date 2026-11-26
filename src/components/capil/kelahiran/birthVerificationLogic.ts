import type { DocumentSelection, VerificationDocument } from "./birthVerificationData";

/**
 * Logika evaluasi, disalin dari fungsi updateDocState() dan evaluateOverall() di HTML Stitch.
 * Fungsi murni tanpa akses DOM, jadi mudah diuji.
 */

/** Hasil evaluasi satu dokumen. */
export type DocumentResult = "pending" | "valid" | "perbaikan" | "tolak";

/** Status akhir seluruh berkas. "menunggu" = belum 6 dokumen terisi lengkap. */
export type OverallStatus = "menunggu" | "siap" | "btl" | "tdp";

export type Evaluation = {
  completedCount: number;
  percent: number;
  status: OverallStatus;
  /** Daftar masalah per dokumen (BTL dan TDP digabung, urutan dokumen 1-6). */
  issues: string[];
  results: DocumentResult[];
};

export const TOTAL_DOCUMENTS = 6;

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
  // Status hanya ditentukan setelah keenam dokumen terisi. TDP lebih diutamakan daripada BTL.
  if (completedCount === TOTAL_DOCUMENTS) {
    status = hasTDP ? "tdp" : hasBTL ? "btl" : "siap";
  }

  return {
    completedCount,
    percent: Math.round((completedCount / TOTAL_DOCUMENTS) * 100),
    status,
    issues,
    results,
  };
}

export function buildDirective(evaluation: Evaluation): string {
  const list = evaluation.issues.join("\n- ");

  switch (evaluation.status) {
    case "tdp":
      return `Yth. Pemohon PLAVON,\nPermohonan Akta Kelahiran Anda TIDAK DAPAT DIPROSES (TDP) karena lampiran fisik berikut tidak valid:\n- ${list}\nSilakan ajukan permohonan baru dengan melampirkan berkas fisik asli yang sah.`;
    case "btl":
      return `Yth. Pemohon PLAVON,\nStatus permohonan Kelahiran NIK Bayi Kecil: PERBAIKAN BERKAS (BTL).\nMohon unggah ulang lampiran berikut dengan foto yang jelas dan utuh:\n- ${list}\nBatas waktu unggah perbaikan berkas adalah 3x24 jam melalui portal PLAVON.`;
    case "siap":
      return `[PEMERIKSAAN AWAL SELESAI]\nSeluruh lampiran fisik (KK, KTP Orang Tua & Saksi, Surat Keterangan Kelahiran) telah memenuhi kriteria pemeriksaan awal.\nBerkas dapat ditindaklanjuti oleh operator sesuai prosedur yang berlaku.`;
    default:
      return DIRECTIVE_PLACEHOLDER;
  }
}
