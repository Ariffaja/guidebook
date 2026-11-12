/**
 * Data Verifikasi Berkas Kematian (KTP-el).
 * Dokumen, urutan, ikon, dan pilihan dropdown disalin dari HTML Stitch kematian.
 */

/** Pemeriksaan [INPUT] Data Teks PLAVON. */
export type DeathInputCondition = "sesuai" | "tidak_sesuai" | "tidak_lengkap";
/** Pemeriksaan [GAMBAR] Lampiran Fisik. */
export type DeathImageCondition = "jelas" | "buram" | "salah_unggah";

export type ConditionOption<T extends string> = { value: T; label: string };

export type DeathVerificationDocument = {
  id: number;
  icon: string;
  /** Nama dokumen di kartu dan di daftar template arahan. */
  title: string;
  /** Label ringkas pada checklist panel hasil. */
  checklistLabel: string;
};

/** Pilihan operator untuk satu dokumen. Nilai "" berarti belum diisi. */
export type DeathDocumentSelection = {
  input: DeathInputCondition | "";
  image: DeathImageCondition | "";
};

/** Pilihan dropdown sama untuk keenam dokumen. */
export const deathInputOptions: ConditionOption<DeathInputCondition>[] = [
  { value: "sesuai", label: "Sesuai / Valid" },
  { value: "tidak_sesuai", label: "Tidak Sesuai SIAK" },
  { value: "tidak_lengkap", label: "Data Kurang Lengkap" },
];

export const deathImageOptions: ConditionOption<DeathImageCondition>[] = [
  { value: "jelas", label: "Jelas & Asli" },
  { value: "buram", label: "Buram / Tidak Terbaca" },
  { value: "salah_unggah", label: "Salah Berkas / Rusak" },
];

export const deathVerificationDocuments: DeathVerificationDocument[] = [
  { id: 1, icon: "badge", title: "KTP Jenazah", checklistLabel: "KTP Jenazah" },
  { id: 2, icon: "family_restroom", title: "KK Jenazah", checklistLabel: "KK Jenazah" },
  { id: 3, icon: "person_check", title: "KTP Saksi 1", checklistLabel: "KTP Saksi 1" },
  { id: 4, icon: "person_check", title: "KTP Saksi 2", checklistLabel: "KTP Saksi 2" },
  { id: 5, icon: "assignment_ind", title: "Pelapor", checklistLabel: "Pelapor" },
  {
    id: 6,
    icon: "description",
    title: "Surat Keterangan Kematian",
    checklistLabel: "Ket. Kematian",
  },
];
