export type SopCategory = "dafduk" | "capil";

export type SopClassification = "BTL" | "TDP" | "Penolakan" | "Perbaikan Berkas";

/** Satu catatan kasus beserta templat responsnya. */
export type SopCase = {
  /** Pengenal stabil untuk React key dan seleksi (bukan nomor SOP resmi). */
  id: string;
  category: SopCategory;
  /** Nomor catatan pada dokumen sumber, jika ada (contoh: "Kasus 1.1"). */
  ref?: string;
  title: string;
  /** Hanya diisi jika klasifikasi tertulis di sumber. Jangan menebak. */
  classification?: SopClassification;
  /** Deskripsi / kondisi pemicu, hanya jika tersedia di sumber. */
  description?: string;
  /** Templat respons asli, disalin apa adanya. */
  template?: string;
  /** Kata kunci tambahan khusus pencarian (opsional). */
  keywords?: string[];
};

export type SopCategoryMeta = {
  key: SopCategory;
  label: string;
  subtitle: string;
  icon: string;
};

export const sopCategories: SopCategoryMeta[] = [
  { key: "dafduk", label: "Dafduk", subtitle: "Pendaftaran Penduduk", icon: "badge" },
  { key: "capil", label: "Capil", subtitle: "Pencatatan Sipil", icon: "assignment" },
];

export type SopClassificationMeta = {
  value: SopClassification;
  /** Penjelasan singkat untuk tooltip, hanya untuk istilah yang sudah dipakai di proyek. */
  hint?: string;
  /** Kelas Tailwind lencana. */
  badgeClass: string;
};

/** Urutan chip filter mengikuti brief: BTL, TDP, Penolakan, Perbaikan Berkas. */
export const sopClassifications: SopClassificationMeta[] = [
  { value: "BTL", hint: "Berkas Tidak Lengkap", badgeClass: "bg-[#ffdbcc] text-[#351000]" },
  { value: "TDP", hint: "Tidak Dapat Diproses", badgeClass: "bg-[#ffdad6] text-[#93000a]" },
  { value: "Penolakan", badgeClass: "border border-[#ba1a1a]/60 bg-white text-[#93000a]" },
  { value: "Perbaikan Berkas", badgeClass: "bg-[#d7e2ff] text-[#001a40]" },
];
