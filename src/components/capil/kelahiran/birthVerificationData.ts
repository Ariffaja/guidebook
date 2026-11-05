/**
 * Data Verifikasi Berkas Kelahiran - NIK Bayi Kecil.
 * Seluruh label, urutan, dan pilihan disalin dari HTML Stitch (code.html).
 */

/** Pemeriksaan [INPUT] Data Teks PLAVON. */
export type InputCondition = "sesuai" | "data_beda" | "kosong";
/** Pemeriksaan [GAMBAR] Lampiran Fisik. */
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
  inputOptions: ConditionOption<InputCondition>[];
  imageOptions: ConditionOption<ImageCondition>[];
};

/** Pilihan operator untuk satu dokumen. Nilai "" berarti belum diisi. */
export type DocumentSelection = {
  input: InputCondition | "";
  image: ImageCondition | "";
};

function inputOptions(sesuai: string, dataBeda: string, kosong: string): ConditionOption<InputCondition>[] {
  return [
    { value: "sesuai", label: sesuai },
    { value: "data_beda", label: dataBeda },
    { value: "kosong", label: kosong },
  ];
}

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
    inputOptions: inputOptions(
      "Sesuai & Sinkron dengan SIAK",
      "Nomor KK / Elemen Beda Karakter",
      "Data Input Kosong / Kurang Lengkap",
    ),
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
    inputOptions: inputOptions(
      "NIK & Biodata Pemohon Valid",
      "Ketik NIK Tidak Sesuai KTP",
      "Input NIK Kurang dari 16 Digit",
    ),
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
    inputOptions: inputOptions(
      "Tanggal, Jam, Berat & Jenis Sesuai",
      "Jam / Tanggal Lahir Tidak Cocok",
      "Data Faskes / Dokter Kosong",
    ),
    imageOptions: imageOptions(
      "Surat Resmi bertanda tangan & Stempel",
      "Tanda tangan / Stempel Samar",
      "Bukan Surat Kelahiran / Form Kosong",
    ),
  },
  {
    id: 4,
    icon: "male",
    title: "KTP Ayah",
    shortTitle: "KTP Ayah",
    checklistLabel: "KTP Ayah",
    inputOptions: inputOptions(
      "NIK & Nama Ayah Terverifikasi SIAK",
      "Ejaan Nama Ayah Beda dengan KK",
      "NIK Ayah Tidak Ditemukan / Kosong",
    ),
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
    inputOptions: inputOptions(
      "NIK & Biodata Ibu Sesuai SIAK",
      "Tanggal Lahir Ibu Beda dengan Data KK",
      "Data Ibu Tidak Terisi Lengkap",
    ),
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
    inputOptions: inputOptions(
      "NIK & Data Saksi Kelahiran Lengkap",
      "Saksi NIK Terdeteksi Masih di Bawah Umur",
      "Data Saksi 1/2 Belum Dimasukkan",
    ),
    imageOptions: imageOptions(
      "e-KTP Saksi Asli Jelas & Terlampir Lengkap",
      "Foto KTP Saksi Terpotong / Resolusi Rendah",
      "Lampiran Saksi Hilang / Bukan KTP",
    ),
  },
];
