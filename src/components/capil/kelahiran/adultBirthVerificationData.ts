import type { VerificationDocument } from "./birthVerificationData";

function options(clear: string, repair: string, invalid: string) {
  return [
    { value: "jelas" as const, label: clear },
    { value: "buram" as const, label: repair },
    { value: "salah_unggah" as const, label: invalid },
  ];
}

/** Enam berkas wajib untuk skenario pencatatan kelahiran NIK Bayi Dewasa. */
export const adultBirthRequiredDocuments: VerificationDocument[] = [
  {
    id: 1,
    icon: "family_restroom",
    title: "Kartu Keluarga Pemohon",
    shortTitle: "KK Pemohon",
    checklistLabel: "KK Pemohon",
    imageOptions: options(
      "KK jelas, utuh, dan data orang tua terbaca",
      "Foto KK buram / terpotong / data tidak terbaca",
      "KK salah / rusak / data tidak sesuai",
    ),
  },
  {
    id: 2,
    icon: "id_card",
    title: "KTP Pemohon",
    shortTitle: "KTP Pemohon",
    checklistLabel: "KTP Pemohon",
    imageOptions: options(
      "KTP jelas, utuh, dan data terbaca",
      "Foto KTP buram / terpotong / data tidak terbaca",
      "KTP salah / rusak / data tidak sesuai",
    ),
  },
  {
    id: 3,
    icon: "badge",
    title: "KTP Saksi",
    shortTitle: "KTP Saksi",
    checklistLabel: "KTP Saksi",
    imageOptions: options(
      "KTP saksi jelas, utuh, dan data terbaca",
      "Foto KTP saksi buram / terpotong / data tidak terbaca",
      "KTP salah / rusak / data tidak sesuai",
    ),
  },
  {
    id: 4,
    icon: "description",
    title: "SPTJM Kebenaran Data Kelahiran",
    shortTitle: "SPTJM Data Kelahiran",
    checklistLabel: "SPTJM Data Kelahiran",
    imageOptions: options(
      "SPTJM terisi, ditandatangani, dan terbaca jelas",
      "Foto buram / terpotong / ada isian tidak terbaca",
      "SPTJM salah / tidak sesuai / tidak ditandatangani",
    ),
  },
  {
    id: 5,
    icon: "groups",
    title: "SPTJM Kebenaran Data Urutan Saudara Kandung",
    shortTitle: "SPTJM Urutan Saudara Kandung",
    checklistLabel: "SPTJM Urutan Saudara",
    imageOptions: options(
      "SPTJM terisi, ditandatangani, dan terbaca jelas",
      "Foto buram / terpotong / ada isian tidak terbaca",
      "SPTJM salah / tidak sesuai / tidak ditandatangani",
    ),
  },
  {
    id: 6,
    icon: "family_restroom",
    title: "SPTJM Kebenaran sebagai Pasangan Suami Istri",
    shortTitle: "SPTJM Pasangan Suami Istri",
    checklistLabel: "SPTJM Pasangan Suami Istri",
    imageOptions: options(
      "SPTJM terisi, ditandatangani, dan terbaca jelas",
      "Foto buram / terpotong / ada isian tidak terbaca",
      "SPTJM salah / tidak sesuai / tidak ditandatangani",
    ),
  },
];

/** Akta nikah hanya diperiksa sebagai lampiran tambahan jika pemohon memilikinya. */
export const adultBirthMarriageDocument: VerificationDocument = {
  id: 7,
  icon: "menu_book",
  title: "Akta / Kutipan Nikah Orang Tua (Jika Ada)",
  shortTitle: "Akta / Kutipan Nikah Orang Tua",
  checklistLabel: "Akta / Kutipan Nikah",
  imageOptions: options(
    "Dokumen jelas dan tanggal perkawinan terbaca",
    "Foto buram / terpotong / tanggal tidak terbaca",
    "Dokumen salah / tidak sesuai",
  ),
};
