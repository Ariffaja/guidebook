# Sprint Checkpoint: SOP Management

**Tanggal mulai:** 22 November 2026  
**Tujuan:** Admin berprivilege dapat mengelola kasus dan templat respons yang tampil di SOP Directory.

## Keputusan produk

- **SOP Directory** tetap menjadi halaman untuk mencari, membaca, dan melihat detail kasus.
- **SOP Management** menjadi menu terpisah untuk mengelola kasus; hanya role berprivilege yang dapat membukanya dan menjalankan aksinya.
- Kategori dan jenis kasus:
  - **Dafduk:** Pindah Datang atau Pindah Keluar.
  - **Capil:** Kematian atau Kelahiran.
- Tiap kasus memiliki klasifikasi **BTL** atau **TDP**, judul, deskripsi kasus, dan templat respons operator.
- Kasus **BTL** dapat memakai tenggat dalam hari kerja. Tanggal dihitung saat templat dibuka/disalin dengan melewati Sabtu, Minggu, dan hari libur nasional Indonesia; **cuti bersama dihitung sebagai hari kerja**. Zona tanggal mengikuti Asia/Jakarta. Kalender nasional disimpan di database dan dikelola admin berdasarkan SKB resmi.
- Templat dinamis memakai token `{{TANGGAL_TENGGAT}}`; teks tersimpan tidak ditulis ulang setiap hari.
- Versi awal mendukung tambah, baca daftar, edit, dan **hapus permanen** dengan dialog konfirmasi. Soft delete ditunda untuk iterasi berikutnya.
- Perubahan yang disimpan di SOP Management harus muncul di SOP Directory.

## Checkpoint dan status

Status: `Belum mulai` · `Sedang dikerjakan` · `Selesai` · `Terhambat`

| # | Checkpoint | Kriteria selesai | Status |
|---|---|---|---|
| 0 | Pahami kondisi proyek | Konfirmasi tampilan Directory saat ini, penyimpanan kasus, autentikasi, dan role admin | **Selesai** |
| 1 | Kunci rancangan data dan akses | Tentukan bentuk model kasus, relasi kategori/jenis, field wajib, perilaku validasi, serta batas akses admin | **Selesai** |
| 2 | Siapkan penyimpanan persisten | Kasus disimpan di database melalui Prisma; migrasi dan data awal siap tanpa kehilangan kasus Directory yang ada | **Selesai** |
| 3 | Implementasikan operasi aman | Server memeriksa sesi dan role pada setiap operasi tambah, ubah, dan hapus; validasi input dan pesan kegagalan tersedia | **Selesai** |
| 4 | Buat menu dan halaman SOP Management | Admin dapat melihat daftar, menambah kasus, memilih kasus untuk diedit, dan menghapus setelah konfirmasi | **Selesai** |
| 5 | Hubungkan SOP Directory | Directory membaca data aktif dari penyimpanan yang sama dan mempertahankan pencarian/filter/detail yang ada | **Selesai** |
| 6 | Tenggat dinamis BTL | Admin dapat mengatur durasi 1–30 hari kerja, menyisipkan token tanggal, dan Directory merender tanggal dinamis memakai kalender libur nasional dari database | Sedang dikerjakan |
| 7 | Verifikasi alur admin | Verifikasi tambah, baca, edit, hapus, validasi, tampilan Directory, kalender tenggat, serta penolakan akses bagi pengguna tanpa privilege | Belum mulai |
| 8 | Catatan finishing untuk developer berikutnya | Sampaikan kekurangan dan pekerjaan pemeliharaan kalender libur nasional, termasuk pembaruan tahun baru dari SKB resmi | Belum mulai |

## Kondisi proyek yang sudah ditemukan

- SOP Directory berada di `src/components/sop` dan saat ini memuat data dari `sopCases` statis.
- Tipe kasus yang ada mencakup `category`, `ref`, `title`, `classification`, `description`, `template`, dan `keywords`.
- Prisma dan autentikasi berbasis role sudah digunakan. Skema Prisma yang diperiksa saat checkpoint awal hanya memiliki `User` dan `Role`; belum ada model kasus SOP.
- Halaman admin yang ada memeriksa role `ADMIN`, tetapi akses khusus menu dan operasi SOP Management tetap perlu dirancang serta diperiksa di server.

## Catatan progres

- 22 Nov 2026: Form data, aksi server khusus `ADMIN`, daftar SOP Management, halaman tambah/edit terpisah, dan konfirmasi hapus permanen sudah dibuat.
- Catatan kasus lama dipertahankan saat inisialisasi pertama. Jenis kasus pada data lama dibiarkan kosong karena kategori layanan aslinya belum dipastikan; admin memilih jenisnya saat mengedit.
- Migrasi database `20261122120000_add_sop_cases` sudah diterapkan. Karena query engine lama terkunci di output standar Windows, Prisma Client diarahkan ke `src/generated/prisma`; generate berhasil di lokasi baru.
- Kalender tahun 2026 dan 2027 disiapkan sebagai data awal dan digunakan di belakang layar untuk menghitung tenggat. Tidak ada menu atau halaman kalender libur untuk pengguna/admin. Jika tahun yang dibutuhkan belum ada atau belum lengkap, token menampilkan pemberitahuan bahwa kalender belum tersedia alih-alih menghitung tanggal yang berpotensi keliru.
- **Pengingat untuk finishing proyek:** sebelum serah terima, jelaskan kepada pengguna dan developer berikutnya bahwa kalender untuk tahun baru harus diperbarui dari SKB resmi melalui pemeliharaan database (misalnya migrasi terkontrol). Tidak ada UI untuk mengelola kalender.
- Cuti bersama tidak dimasukkan sebagai hari libur, sesuai keputusan produk; tanggal tersebut tetap dihitung sebagai hari kerja.
- Field tenggat sudah ditambahkan ke schema dan migrasi `20261122150000_add_sop_deadline` sudah diterapkan. Generate client untuk perubahan ini perlu dijalankan setelah server dev berhenti karena file engine sedang terkunci.

## Di luar versi pertama

- Soft delete, pemulihan kasus yang dihapus, dan audit riwayat perubahan.
- Unggah lampiran dokumen SOP.
