export type DeathCategoryKey =
  | "ktp-el-lama"
  | "ktp-el-modern"
  | "kepala-keluarga"
  | "luar-negeri";

export type DeathCategory = {
  key: DeathCategoryKey;
  icon: string;
  badge: string;
  title: string;
  description: string;
  /** Menandai kategori utama yang ditonjolkan dengan border biru (KTP-el Modern). */
  featured?: boolean;
};

export const deathCategories: DeathCategory[] = [
  {
    key: "ktp-el-modern",
    icon: "contactless",
    badge: "Biometrik",
    title: "KTP-el Modern",
    description:
      "Pencatatan kematian bagi pemegang KTP elektronik modern terintegrasi IKD dan biometrik digital.",
    featured: true,
  },
  {
    key: "ktp-el-lama",
    icon: "badge",
    badge: "Standar",
    title: "KTP Lama",
    description:
      "Pencatatan jenazah dengan dokumen KTP elektronik model lama yang belum terintegrasi chip mutakhir.",
  },
  {
    key: "kepala-keluarga",
    icon: "family_restroom",
    badge: "Kartu Keluarga",
    title: "Jenazah Berstatus Kepala Keluarga",
    description:
      "Alur khusus penerbitan akta kematian yang disertai otomatisasi pergantian Kepala Keluarga pada KK.",
  },
  {
    key: "luar-negeri",
    icon: "flight_takeoff",
    badge: "Luar Negeri",
    title: "Jenazah Meninggal di Luar Negeri",
    description:
      "Pencatatan surat pelaporan kematian luar negeri dari KBRI/KJRI untuk penerbitan surat tanda lapor.",
  },
];
