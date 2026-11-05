export type DafdukServiceKey = "pindah-keluar" | "pindah-datang";

export type DafdukService = {
  key: DafdukServiceKey;
  icon: string;
  title: string;
  tag: string;
  description: string;
  footer: { icon: string; label: string };
  /** Nama lengkap untuk notifikasi sementara. */
  toastName: string;
};

export const dafdukServices: DafdukService[] = [
  {
    key: "pindah-keluar",
    icon: "outbox",
    title: "Pindah Keluar",
    tag: "SKPWNI",
    description:
      "Penerbitan Surat Keterangan Pindah WNI (SKPWNI) antar desa/kelurahan, antar kecamatan, kabupaten/kota, maupun antar provinsi.",
    footer: { icon: "fact_check", label: "Verifikasi Kartu Keluarga & KTP Pemohon" },
    toastName: "Pindah Keluar (SKPWNI)",
  },
  {
    key: "pindah-datang",
    icon: "move_to_inbox",
    title: "Pindah Datang",
    tag: "Penerimaan",
    description:
      "Penerimaan penduduk datang, validasi barcode SKPWNI asal, dan pencetakan Kartu Keluarga serta KTP-el baru di daerah tujuan.",
    footer: { icon: "qr_code_scanner", label: "Validasi SKPWNI & Penerbitan KK Baru" },
    toastName: "Pindah Datang (Penerimaan)",
  },
];
