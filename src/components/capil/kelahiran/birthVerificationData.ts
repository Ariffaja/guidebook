/** Data pemeriksaan lampiran fisik kelahiran NIK Bayi Kecil. */
export type ImageCondition = "jelas" | "buram" | "salah_unggah";

export type ConditionOption<T extends string> = { value: T; label: string };

export type VerificationDocument = {
  id: number;
  icon: string;
  /** Judul lengkap di kartu dokumen. */
  title: string;
  /** Judul ringkas untuk daftar masalah pada template arahan. */
  shortTitle: string;
  /** Label pada checklist panel hasil. */
  checklistLabel: string;
  imageOptions: ConditionOption<ImageCondition>[];
};

/** Satu pilihan lampiran fisik per dokumen. Nilai "" berarti belum diperiksa. */
export type DocumentSelection = {
  image: ImageCondition | "";
};

function imageOptions(jelas: string, buram: string, salahUnggah: string): ConditionOption<ImageCondition>[] {
  return [
    { value: "jelas", label: jelas },
    { value: "buram", label: buram },
    { value: "salah_unggah", label: salahUnggah },
  ];
}

export const birthVerificationDocuments: VerificationDocument[] = [
  {
    id: 1,
    icon: "family_restroom",
    title: "KK Pemohon",
    shortTitle: "KK Pemohon",
    checklistLabel: "KK Pemohon",
    imageOptions: imageOptions(
      "Fisik Asli Jelas & Terbaca Penuh",
      "Foto Buram / Terpotong / Fotokopi",
      "Salah Berkas / Rusak / Tidak Valid",
    ),
  },
  {
    id: 2,
    icon: "id_card",
    title: "KTP Pemohon",
    shortTitle: "KTP Pemohon",
    checklistLabel: "KTP Pemohon",
    imageOptions: imageOptions(
      "e-KTP Asli Jelas & Hologram Terbaca",
      "Foto Gelap / Teks NIK Buram",
      "Lampiran Bukan KTP Pemohon",
    ),
  },
  {
    id: 3,
    icon: "local_hospital",
    title: "Surat Keterangan Kelahiran dari Dokter/Bidan/Penolong Kelahiran",
    shortTitle: "Surat Keterangan Kelahiran",
    checklistLabel: "Ket. Kelahiran Dokter/Bidan",
    imageOptions: imageOptions(
      "Surat Resmi Bertanda Tangan & Stempel",
      "Tanda Tangan / Stempel Samar",
      "Bukan Surat Kelahiran / Form Kosong",
    ),
  },
  {
    id: 4,
    icon: "male",
    title: "KTP Ayah",
    shortTitle: "KTP Ayah",
    checklistLabel: "KTP Ayah",
    imageOptions: imageOptions(
      "Foto e-KTP Ayah Jelas & Asli",
      "Foto KTP Silau / Tidak Terbaca",
      "Lampiran Keliru / Tertukar KTP Ibu",
    ),
  },
  {
    id: 5,
    icon: "female",
    title: "KTP Ibu",
    shortTitle: "KTP Ibu",
    checklistLabel: "KTP Ibu",
    imageOptions: imageOptions(
      "e-KTP Ibu Asli & Seluruh Data Terbaca",
      "Foto KTP Miring & Buram",
      "Bukan Dokumen Identitas Ibu",
    ),
  },
  {
    id: 6,
    icon: "visibility",
    title: "KTP Saksi",
    shortTitle: "KTP Saksi",
    checklistLabel: "KTP Saksi",
    imageOptions: imageOptions(
      "e-KTP Saksi Asli Jelas & Terlampir Lengkap",
      "Foto KTP Saksi Terpotong / Resolusi Rendah",
      "Lampiran Saksi Hilang / Bukan KTP",
    ),
  },
  {
    id: 7,
    icon: "menu_book",
    title: "Kutipan Nikah / Akta Perkawinan Orang Tua",
    shortTitle: "Kutipan Nikah / Akta Perkawinan",
    checklistLabel: "Kutipan Nikah / Akta Perkawinan",
    imageOptions: imageOptions(
      "Kutipan / Akta Asli Jelas & Terbaca",
      "Dokumen Buram / Tidak Terbaca",
      "Dokumen Tidak Ada / Salah Berkas",
    ),
  },
];
