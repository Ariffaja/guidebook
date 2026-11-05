export type BirthCategoryKey = "bayi-kecil" | "bayi-dewasa";

export type BirthCategory = {
  key: BirthCategoryKey;
  icon: string;
  title: string;
  tag: string;
  /** Warna tag saat kartu tidak terpilih: abu-abu (neutral) atau peach #FFDBCC (warm). */
  tagTone: "neutral" | "warm";
  description: string;
};

export const birthCategories: BirthCategory[] = [
  {
    key: "bayi-kecil",
    icon: "child_care",
    title: "NIK Bayi Kecil",
    tag: "Umur ≤ 18 Thn",
    tagTone: "neutral",
    description: "Penerbitan akta kelahiran dan penerbitan NIK baru bagi bayi baru lahir / balita.",
  },
  {
    key: "bayi-dewasa",
    icon: "person_add",
    title: "NIK Bayi Dewasa",
    tag: "Terlambat > 18 Thn",
    tagTone: "warm",
    description:
      "Pencatatan kelahiran terlambat bagi penduduk dewasa yang belum memiliki NIK atau akta kelahiran.",
  },
];
