import type { SopCase } from "./sopTypes";

/**
 * Data awal SOP Directory.
 *
 * Sumber: dua dokumen catatan templat respons operasional PLAVON (Dafduk: 15 entri,
 * Capil: 12 kasus). Redaksi templat disalin apa adanya, termasuk ejaan aslinya.
 * Daftar ini adalah catatan yang saat ini terkumpul, BUKAN keseluruhan kasus operasional.
 *
 * Aturan pengisian:
 * - `classification` hanya diisi jika tertulis di sumber (tag "(BTL)"/"(TDP)" pada judul
 *   catatan Dafduk, atau judul kategori pada dokumen Capil). Selain itu dibiarkan kosong.
 * - `description` dan `keywords` kosong karena sumber tidak menyediakannya.
 * - Jangan menambah kasus atau mengubah templat tanpa sumber dari pemilik prosedur.
 */
export const sopCases: SopCase[] = [
  {
    id: "dafduk-01",
    category: "dafduk",
    title: "Bukti Kepemilikan Rumah",
    classification: "BTL",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Berkas tidak lengkap, mohon untuk melampirkan surat bukti kepemilikan rumah (jika rumah milik sendiri),
ATAU melampirkan Surat Pernyataan Tidak Keberatan Alamat Rumah Digunakan Sebagai Alamat Dokumen Kependudukan bermaterai 10.000,(apabila numpang kk, kontrak, kos,dll).

Kelengkapan berkas kami tunggu sampai besok tanggal 28 Oktober 2026`,
  },
  {
    id: "dafduk-02",
    category: "dafduk",
    title: "Sertifikat Belum Balik Nama / Nama Orang Lain",
    classification: "BTL",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil

Dikarenakan sertifikat rumah belum dibalik nama , Mohon untuk melampirkan Surat Pernyataan Tidak Keberatan Alamat Rumah Digunakan Sebagai Alamat Dokumen Kependudukan bermaterai 10.000

Terimakasih`,
  },
  {
    id: "dafduk-03",
    category: "dafduk",
    title: "Dusun RT/RW Tidak Ada di SIAK",
    classification: "BTL",
    template: `Terima kasih telah menggunakan Layanan Plavon Dukcapil Kab. Sidoarjo

Mohon maaf, berkas belum dapat diproses karena data RT/RW pada pengajuan Plavon tidak tersedia dalam sistem
Mohon untuk melampirkan Surat Domisili dari Desa/Kelurahan yang mencantumkan informasi RT/RW dan Dusun sesuai dengan alamat tujuan yang diajukan

Terima kasih atas perhatian dan kerja samanya`,
  },
  {
    id: "dafduk-04",
    category: "dafduk",
    title: "RT/RW di PLAVON Tidak Diisi",
    classification: "TDP",
    template: `Terima kasih telah menggunakan Layanan Plavon Dukcapil Kabupaten Sidoarjo.

Mohon maaf, berkas belum dapat diproses karena kolom RT/RW pada aplikasi Plavon belum diisi. Silakan melengkapi data RT/RW terlebih dahulu, kemudian mengajukan permohonan kembali.`,
  },
  {
    id: "dafduk-05",
    category: "dafduk",
    title: "Wajib Rekam KTP (1 Orang Pindah)",
    classification: "TDP",
    template: `Terima kasih telah menggunakan Layanan Plavon Dukcapil Kab. Sidoarjo

Mohon maaf, berkas belum dapat diproses karena anggota keluarga yang bersangkutan belum melakukan perekaman KTP-el.

Mohon untuk melakukan perekaman KTP-el terlebih dahulu di Kantor Kecamatan atau MPP Lingkar Timur.

Setelah perekaman selesai, silakan mengajukan kembali permohonan melalui Layanan Plavon.

Terima kasih atas perhatian dan kerja samanya.`,
  },
  {
    id: "dafduk-06",
    category: "dafduk",
    title: "Wajib Rekam KTP",
    classification: "TDP",
    template: `Terima kasih telah menggunakan Layanan Plavon Dukcapil Kab. Sidoarjo

Mohon maaf, berkas belum dapat diproses dikarenakan anggota keluarga bernama _____ belum melakukan perekaman KTP-el

Silakan melakukan perekaman KTP-el terlebih dahulu di Kantor Kecamatan atau MPP Lingkar Timur

Terima kasih atas perhatian dan kerja samanya.`,
  },
  {
    id: "dafduk-07",
    category: "dafduk",
    title: "Kartu Keluarga Bukan Milik Sendiri",
    classification: "BTL",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil

Mohon untuk melampirkan kartu keluarga milik sendiri, jika kartu keluarga hilang mohon lampirkan surat kehilanagan dari kepolisian terdekat`,
  },
  {
    id: "dafduk-08",
    category: "dafduk",
    title: "Surat Pernyataan Kuasa Pengasuhan Anak atau Surat Pernyataan Bersedia Menerima Anggota Keluarga",
    classification: "BTL",
    template: `Terima kasih telah menggunakan Layanan Plavon Dukcapil

Mohon melampirkan Surat Pernyataan Kuasa Pengasuhan Anak atau Surat Pernyataan Bersedia Menerima Anggota Keluarga dari pihak keluarga tujuan, bermaterai Rp10.000.`,
  },
  {
    id: "dafduk-09",
    category: "dafduk",
    title: "Jenis Pengajuan Salah",
    classification: "TDP",
    template: `Terima kasih telah menggunakan Layanan Plavon Dukcapil

Untuk layanan pindah masuk ke Sidoarjo mohon gunakan layanan Surat Pindah Datang di Plavon

Terimakasih`,
  },
  {
    id: "dafduk-10",
    category: "dafduk",
    title: "Kurang Buku atau Akta Menikah",
    classification: "BTL",
    template: `Terima kasih telah menggunakan Layanan Plavon Dukcapil

Mohon lampirkan buku atau akta nikah halaman 3 dan 4`,
  },
  {
    id: "dafduk-11",
    category: "dafduk",
    title: "KK Tidak Asli",
    classification: "BTL",
    template: `Terimakasih telah menggunakan Layanan Plavon Dukcapil Kab. Sidoarjo

Sesuai dengan peraturan Permendagri NO. 7 Tahun 2019 tentang Pelayanan Administrasi Kependudukan Secara Daring/online, Berkas yang digunakan harus Kartu kelurga asli bukan fotocopy atau screenshot, Mohon untuk melampirkan Kartu keluarga ASLI, jika Kartu Keluarga hilang mohon lampirkan surat kehilangan dari kepolisian`,
  },
  {
    id: "dafduk-12",
    category: "dafduk",
    title: "Jenis Kepindahan Kurang/Salah",
    classification: "TDP",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil

Berkas tidak dapat diproses dikarenakan pada jenis kepindahan adalah "Kepala keluarga dan seluruh anggota keluarga" namun pada list data keluarga yang pindah nama kepala keluarga dan anggota keluarga lain tidak dicantumkan

Dengan demikian mohon untuk memperbaiki pengajuan jika tetap menghendaki pindah "Kepala Keluarga dan Seluruh Anggota Keluarga" mohon untuk menambahkan nama kepala keluarga dan anggota keluarga lain (jika ada), jika hanya anggota keluarga saja yang pindah mohon untuk memilih jenis kepindahan "Anggota Keluarga" pada PLAVON

Terimakasih`,
  },
  {
    id: "dafduk-13",
    category: "dafduk",
    title: "Sudah Pernah Diajukan",
    classification: "TDP",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Pengajuan tidak dapat di proses karena data tersebut sudah pernah diajukan dan berstatus selesai.

Berkas bisa diambil oleh yang bersangkutan atau yang berada dalam 1 Kartu Keluarga di Mall Pelayanan Publik Lingkar Timur dengan membawa Tanda terima dan KTP Asli bagi yang mengambil berkas.`,
  },
  {
    id: "dafduk-14",
    category: "dafduk",
    title: "Anggota Keluarga Tinggalan Dibawah Umur",
    classification: "BTL",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil

Mohon untuk melakukan tumpang kartu keluarga terlebih dahulu untuk anggota keluarga yang bernama ______ dikarenakan anak dibawah umur 17 tahun tidak bisa menjadi kepala keluarga

Terimakasih`,
  },
  {
    id: "dafduk-15",
    category: "dafduk",
    title: "Data Pemohon Bukan Diri Sendiri/Suami/Istri",
    classification: "TDP",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil

Mohon melakukan perbaikan data pemohon menggunakan nama dan KK istri, karena yang mengajukan perpindahan adalah istri, bukan suami.

Terimakasih`,
  },
  {
    id: "capil-1-1",
    category: "capil",
    ref: "Kasus 1.1",
    title: "KTP-el Almarhum/Almarhumah Fotokopi",
    classification: "BTL",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Mohon maaf, permohonan Anda belum dapat diproses dikarenakan dokumen KTP-el almarhum/almarhumah yang diunggah belum berupa dokumen asli. Mohon melampirkan kembali foto KTP-el almarhum/almarhumah dalam bentuk fisik asli.

Kelengkapan berkas kami tunggu paling lambat besok pukul 12.00 WIB. Terima kasih.`,
  },
  {
    id: "capil-1-2",
    category: "capil",
    ref: "Kasus 1.2",
    title: "Dokumen KTP-el Almarhum/Almarhumah Tertukar (Terunggah KK)",
    classification: "BTL",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Mohon maaf, permohonan Anda belum dapat diproses dikarenakan dokumen KTP-el almarhum/almarhumah yang terunggah tidak sesuai (terlampir berkas Kartu Keluarga). Mohon melampirkan foto dokumen KTP-el asli milik almarhum/almarhumah (bukan fotokopi).

Kelengkapan berkas kami tunggu paling lambat besok pukul 12.00 WIB. Terima kasih.`,
  },
  {
    id: "capil-1-3",
    category: "capil",
    ref: "Kasus 1.3",
    title: "Dokumen KTP-el Almarhum/Almarhumah Tidak Sesuai/Tertukar",
    classification: "BTL",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Mohon maaf, permohonan Anda belum dapat diproses dikarenakan dokumen KTP-el almarhum/almarhumah yang diunggah tidak sesuai (bukan foto KTP-el milik almarhum/almarhumah). Mohon melampirkan kembali foto KTP-el asli milik almarhum/almarhumah.

Kelengkapan berkas kami tunggu paling lambat besok pukul 12.00 WIB. Terima kasih.`,
  },
  {
    id: "capil-1-4",
    category: "capil",
    ref: "Kasus 1.4",
    title: "Surat Keterangan Kematian Berupa Fotokopi",
    classification: "BTL",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Mohon maaf, permohonan Anda belum dapat diproses dikarenakan dokumen Surat Keterangan Kematian yang diunggah masih berupa fotokopi. Mohon melampirkan kembali foto Surat Keterangan Kematian asli (apabila meninggal di Rumah Sakit, wajib melampirkan Surat Keterangan Kematian asli yang diterbitkan oleh pihak Rumah Sakit).

Kelengkapan berkas kami tunggu paling lambat besok pukul 12.00 WIB. Terima kasih.`,
  },
  {
    id: "capil-1-5",
    category: "capil",
    ref: "Kasus 1.5",
    title: "Surat Keterangan Kematian Tidak Mencantumkan Tempat Kematian",
    classification: "BTL",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Mohon maaf, permohonan Anda belum dapat diproses dikarenakan dokumen Surat Keterangan Kematian asli dari Desa/Kelurahan belum mencantumkan keterangan tempat meninggalnya almarhum/almarhumah. Mohon memperbarui dan mengunggah kembali Surat Keterangan Kematian asli yang telah mencantumkan lokasi tempat meninggal secara jelas.

Kelengkapan berkas kami tunggu paling lambat besok pukul 12.00 WIB. Terima kasih.`,
  },
  {
    id: "capil-1-6",
    category: "capil",
    ref: "Kasus 1.6",
    title: "Surat Keterangan Kematian Belum Dilampirkan (Opsi Rumah vs Rumah Sakit)",
    classification: "BTL",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Mohon maaf, permohonan Anda belum dapat diproses dikarenakan berkas belum lengkap. Mohon melampirkan foto dokumen Surat Keterangan Kematian asli dengan ketentuan:
- Surat Keterangan Kematian asli dari Desa/Kelurahan (apabila almarhum/almarhumah meninggal di rumah), ATAU
- Surat Keterangan Kematian asli dari Rumah Sakit (apabila almarhum/almarhumah meninggal di Rumah Sakit).

Kelengkapan berkas kami tunggu paling lambat besok pukul 12.00 WIB. Terima kasih.`,
  },
  {
    id: "capil-1-7",
    category: "capil",
    ref: "Kasus 1.7",
    title: "Kartu Keluarga (KK) Fotokopi / KK Asli Hilang",
    classification: "BTL",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Mohon maaf, permohonan Anda belum dapat diproses. Sesuai dengan ketentuan pelayanan Adminduk secara daring, dokumen pendukung yang diunggah wajib berupa foto/pemindaian (scan) dari dokumen asli. Mohon mengunggah kembali foto asli dari Kartu Keluarga (KK) almarhum/almarhumah.

(Catatan: Apabila Kartu Keluarga asli hilang, Anda dapat datang langsung ke Mall Pelayanan Publik (MPP) Lingkar Timur atau MPP Sukodono dengan membawa Surat Laporan Kehilangan dari Kepolisian beserta seluruh berkas persyaratan akta kematian).

Kelengkapan berkas kami tunggu paling lambat besok pukul 12.00 WIB. Terima kasih.`,
  },
  {
    id: "capil-1-8",
    category: "capil",
    ref: "Kasus 1.8",
    title: "Kombinasi: Surat Kematian Tidak Sesuai & KK Fotokopi / Hilang",
    classification: "BTL",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Mohon maaf, permohonan Anda belum dapat diproses dikarenakan dokumen kelengkapan belum sesuai ketentuan:
1. Surat Keterangan Kematian: Mohon melampirkan Surat Keterangan Kematian asli dari Desa/Kelurahan (jika meninggal di rumah) ATAU Surat Keterangan Kematian asli dari Rumah Sakit (jika meninggal di Rumah Sakit).
2. Kartu Keluarga (KK): Mohon melampirkan foto Kartu Keluarga (KK) asli almarhum/almarhumah (bukan fotokopi). Apabila dokumen asli tersebut hilang, silakan melampirkan Surat Keterangan Kehilangan asli dari pihak Kepolisian.

Kelengkapan berkas kami tunggu paling lambat besok pukul 12.00 WIB. Terima kasih.`,
  },
  {
    id: "capil-2-1",
    category: "capil",
    ref: "Kasus 2.1",
    title: "Data Pelapor dan Saksi Sama / KTP Sama",
    classification: "TDP",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Mohon maaf, permohonan Anda tidak dapat diproses dikarenakan data KTP-el pelapor dan data KTP-el saksi terdaftar atas individu yang sama. Sesuai ketentuan, pihak saksi wajib merupakan orang yang berbeda dari pelapor.

Mohon melakukan pengajuan permohonan kembali dari awal dengan melampirkan foto KTP-el asli milik saksi yang berbeda dari pelapor. Terima kasih.`,
  },
  {
    id: "capil-2-2",
    category: "capil",
    ref: "Kasus 2.2",
    title: "Pelapor Bukan Ahli Waris Sah",
    classification: "TDP",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Mohon maaf, permohonan Anda tidak dapat diproses dikarenakan data KTP-el pelapor yang terlampir bukan merupakan ahli waris yang sah dari almarhum/almarhumah. Sesuai ketentuan, pelapor wajib merupakan pasangan (suami/istri), anak kandung, atau saudara kandung dari almarhum/almarhumah.

Mohon melakukan pengajuan permohonan kembali dari awal dengan menggunakan data KTP-el pelapor yang sesuai dengan kriteria tersebut. Terima kasih.`,
  },
  {
    id: "capil-2-3",
    category: "capil",
    ref: "Kasus 2.3",
    title: "Belum Melakukan Perekaman KTP-el",
    classification: "TDP",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Mohon maaf, permohonan Anda tidak dapat diproses dikarenakan pemohon/anggota keluarga terdata belum melakukan perekaman KTP-el. Sesuai ketentuan, seluruh dokumen kependudukan memerlukan status perekaman KTP-el yang sudah aktif.

Mohon melakukan perekaman KTP-el terlebih dahulu di kantor Kecamatan domisili atau Mall Pelayanan Publik (MPP). Setelah proses perekaman selesai dilakukan, silakan mengajukan permohonan kembali dari awal. Terima kasih.`,
  },
  {
    id: "capil-2-4",
    category: "capil",
    ref: "Kasus 2.4",
    title: "Duplikasi Pengajuan / Akta Kematian Sudah Pernah Terbit",
    classification: "TDP",
    template: `Terima kasih telah menggunakan layanan Plavon Dukcapil.

Mohon maaf, permohonan Anda tidak dapat diproses dikarenakan data almarhum/almarhumah terdaftar sudah pernah diajukan dan/atau sudah diterbitkan Akta Kematian sebelumnya dalam sistem kami.

Apabila Anda memerlukan salinan atau informasi lebih lanjut terkait dokumen yang telah terbit, silakan datang langsung ke kantor Dinas Kependudukan dan Pencatatan Sipil (Dukcapil) atau Mall Pelayanan Publik (MPP) Kabupaten Sidoarjo. Terima kasih.`,
  },
];
