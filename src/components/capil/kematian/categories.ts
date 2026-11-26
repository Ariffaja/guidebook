export type DeathCategoryKey =
  | "ktp-el-lama"
  | "ktp-el-modern";

export type DeathCategory = {
  key: DeathCategoryKey;
  icon: string;
  badge: string;
  title: string;
  description: string;
  /** Menandai kategori utama yang ditonjolkan dengan border biru (KTP-el). */
  featured?: boolean;
};

export const deathCategories: DeathCategory[] = [
  {
    key: "ktp-el-modern",
    icon: "contactless",
    badge: "Biometrik",
    title: "KTP-el",
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
];
