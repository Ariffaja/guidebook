# Panduan Pengembang — GUIDEBOOK ADMINDUK

Dokumen ini menjelaskan cara menjalankan, memahami, dan melanjutkan aplikasi GUIDEBOOK ADMINDUK. Dokumen ini ditujukan untuk pengembang baru maupun AI yang membantu mengerjakan proyek. Baca bagian arsitektur dan batas fitur sebelum mengubah kode.

## 1. Ringkasan proyek

GUIDEBOOK ADMINDUK adalah aplikasi web internal untuk membantu operator Disdukcapil Kabupaten Sidoarjo mempelajari panduan layanan administrasi kependudukan. Isinya mencakup alur Dafduk, alur Capil, direktori catatan kasus dan templat tanggapan SOP, serta pengelolaan akun.

**Aplikasi ini bukan PLAVON atau SIAK.** Aplikasi tidak memproses pengajuan kependudukan dan tidak mengirim atau mengambil data dari kedua sistem tersebut. Materi panduan dan catatan SOP juga bukan jaminan mencakup seluruh kasus operasional.

Teknologi utama:

- Next.js 16 dengan App Router, React 19, TypeScript, dan Tailwind CSS 4.
- NextAuth v5 beta dengan provider email dan kata sandi, sesi JWT.
- MySQL melalui Prisma 6.
- `bcryptjs` untuk hash kata sandi dan `xlsx` untuk templat/impor akun.

## 2. Menjalankan proyek

Prasyarat: Node.js/npm yang sesuai dengan Next.js 16 dan server MySQL yang dapat diakses.

1. Pasang dependensi: `npm install`.
2. Buat `.env` lokal. Isi `DATABASE_URL` dengan alamat koneksi MySQL dan `AUTH_SECRET` dengan secret acak untuk NextAuth. Jangan memasukkan nilai rahasia ke Git, dokumentasi, atau prompt AI.
3. Buat/generasikan Prisma Client: `npx prisma generate`.
4. Terapkan migrasi: `npx prisma migrate deploy`.
5. Siapkan role awal: `npm run db:seed`.
6. Jika belum ada akun admin, buat dengan `npm run db:create-admin`; skrip meminta nama, email, dan kata sandi melalui terminal. Kata sandi minimum 8 karakter.
7. Jalankan aplikasi: `npm run dev`, lalu buka `http://localhost:3000`.

Perintah lain: `npm run build` menjalankan `prisma generate` lalu build Next.js; `npm start` menjalankan hasil build; `npm run lint` menjalankan ESLint. Jangan menjalankan seed admin di lingkungan bersama tanpa memastikan database yang dipakai memang benar.

Skema Prisma berada di `prisma/schema.prisma`; konfigurasi koneksi Prisma ada di `prisma.config.ts`. Migrasi baru dibuat dengan `npx prisma migrate dev --name nama_perubahan` pada lingkungan pengembangan, lalu ditinjau dan disertakan bersama perubahan kode. Untuk lingkungan yang sudah dideploy, gunakan `npx prisma migrate deploy`.

## 3. Fitur yang tersedia

### Navigasi dan profil

- Login memakai email dan kata sandi; akun nonaktif ditolak.
- Kerangka halaman memiliki navigasi desktop dan menu geser untuk layar kecil, profil, logout, pilihan tema gelap/terang tersimpan di browser, dan ubah kata sandi sendiri.
- Halaman yang memakai `AppLayout` memeriksa sesi aktif. Server actions dan halaman pengelolaan juga memeriksa izin pada server.
- Menu admin hanya ditampilkan untuk role `ADMIN`; izin penting tidak hanya bergantung pada menu yang terlihat.

### Dafduk — Pendaftaran Penduduk

- Pilihan layanan mencakup Pindah Keluar (SKPWNI) dan Pindah Datang.
- Pindah Keluar memiliki pilihan klasifikasi wilayah: dalam desa/kelurahan, antar desa/kelurahan, antar kecamatan, antar kabupaten/kota, dan antar provinsi.
- Verifikasi yang tersedia saat ini ada pada alur dalam desa/kelurahan, antar desa/kelurahan, dan antar kecamatan melalui komponen `DafdukWithinVillageVerification`. Perlu bukti rumah untuk tiga klasifikasi itu.
- Halaman klasifikasi antar kabupaten/kota dan antar provinsi saat ini adalah penanda bahwa verifikasi belum tersedia. Pindah Datang juga belum memiliki tahap berikutnya. Tahap finalisasi SIAK belum tersedia.
- Rute dan alur utama: `/dafduk`, `/dafduk/[service]`, `/dafduk/[service]/klasifikasi/[region]`, `/dafduk/[service]/finalisasi`.

### Capil — Pencatatan Sipil

- Alur Kematian menyediakan kategori KTP-el, KTP lama, kepala keluarga, dan kematian di luar negeri. Kategori mengarahkan pengguna ke tahap pemeriksaan berdasarkan aturan dan data pendukung yang berada di `kematian/deathVerificationLogic.ts` dan `kematian/deathVerificationData.ts`.
- Alur Kelahiran menyediakan kategori NIK bayi kecil (umur ≤ 18 tahun) dan kelahiran terlambat untuk penduduk dewasa. Verifikasi bayi kecil menggunakan aturan dan data di `kelahiran/birthVerificationLogic.ts` dan `kelahiran/birthVerificationData.ts`.
- `CapilModule` mengatur perpindahan langkah di sisi browser. Kategori bayi dewasa saat ini belum memiliki langkah verifikasi; verifikasi kelahiran yang dihubungkan adalah untuk bayi kecil.
- Antarmuka menampilkan hasil pemeriksaan dokumen/klasifikasi berdasarkan data aturan lokal. Periksa sumber data dan logika terkait sebelum mengubah hasil yang disarankan.

### SOP Directory

- Data kasus disimpan di tabel `SopCase`; saat pertama kali dibaca, `src/lib/sopCases.ts` memindahkan data lama dari `src/components/sop/sopCases.ts` ke database sekali saja.
- Pengguna yang berhak dapat mencari kasus dan memfilter berdasarkan Dafduk/Capil, jenis kasus, dan klasifikasi BTL/TDP. Daftar dan panel detail menampilkan deskripsi serta templat. Templat bisa disalin; tanggal tenggat dinamis dihitung saat ditampilkan/disalin.
- Token tenggat adalah `{{TANGGAL_TENGGAT}}`. Tenggat hanya untuk BTL dan durasinya 1–30 hari kerja. Perhitungan mengikuti tanggal Asia/Jakarta, melewati Sabtu, Minggu, dan hari libur nasional. Cuti bersama tetap dihitung sebagai hari kerja.
- Jika kalender untuk salah satu tahun yang diperlukan belum ditandai lengkap, aplikasi menampilkan pemberitahuan bahwa kalender belum tersedia, bukan menebak tanggal.
- Admin dan mentor yang mendapat divisi dapat menambah, mengubah, serta mengarsipkan/memulihkan kasus pada divisi yang diizinkan. Dari tampilan arsip, pengelola juga dapat menghapus permanen SOP yang sudah diarsipkan setelah konfirmasi; tindakan ini tidak dapat dipulihkan. Pengguna Magang hanya melihat kasus aktif sesuai aksesnya. Arsip disembunyikan dari pengguna Magang.
- Tombol Riwayat SOP pada panel detail membuka riwayat SOP yang sedang dipilih. Admin dan mentor sesuai divisi dapat melihat pelaku, waktu WIB, serta nilai sebelum/sesudah untuk setiap perubahan. Catatan audit tetap tersimpan setelah SOP dihapus.
- Kalender hari libur tersimpan di `HolidayCalendar` dan `NationalHoliday`. Tidak ada UI untuk mengelola kalender; kalender harus dipelihara dari SKB resmi melalui perubahan database/migrasi terkontrol, termasuk tahun baru.
- Rute utama: `/sop-directory`; `/sop-directory/[id]/history` menampilkan riwayat satu SOP; `/sop-management` mengarahkan kembali ke direktori. Form tambah/edit ada di `/sop-management/new` dan `/sop-management/[id]/edit`.

### Manajemen akun

Hanya `ADMIN` yang dapat membuka `/account-management` dan menjalankan aksi akun. Admin dapat mencari/memfilter daftar, membuat akun, mengubah nama/email/role/divisi mentor, mengaktifkan/menonaktifkan akun, mereset kata sandi, dan mengimpor akun Magang dari Excel.

- Role: `ADMIN`, `MENTOR`, `MAGANG`.
- `MENTOR` harus diberi sedikitnya satu divisi SOP: `DAFDUK`, `CAPIL`, atau keduanya. Mentor hanya dapat membaca dan mengelola SOP pada divisinya. Mentor belum mendapatkan menu/izin manajemen akun.
- `MAGANG` dapat membaca SOP Dafduk dan Capil aktif.
- Kata sandi minimal 8 karakter, disimpan sebagai hash bcrypt. Admin menyampaikan kata sandi awal/reset secara terpisah; aplikasi tidak mengirim email.
- Akun sendiri tidak dapat dinonaktifkan. Admin aktif terakhir tidak dapat dinonaktifkan atau diturunkan rolenya. Akun tidak dihapus permanen dari UI.
- Impor memakai `.xlsx` dengan kolom `Nama` dan `Email`; file maksimum 5 MB, maksimum 500 baris. Layar menampilkan pratinjau dan kesalahan baris (wajib, format, duplikat di berkas/database). Role otomatis `MAGANG`; admin menetapkan dan mengonfirmasi satu kata sandi awal untuk batch. Email yang sudah ada dilewati dan dicek ulang saat impor.
- Rute tambahan: `/account-management/new`, `/account-management/[id]/edit`, `/account-management/import`, `/account-management/template` (unduh templat XLSX).

### Halaman lain

- `/` adalah beranda dengan kartu bidang layanan dan memerlukan sesi aktif.
- `/tentang` menerangkan tujuan dan batas aplikasi.
- `/login` adalah halaman masuk.
- `/admin` saat ini hanya mengarahkan admin kembali ke beranda; bukan dashboard administrasi terpisah.

## 4. Hak akses ringkas

| Peran | Panduan Dafduk/Capil | SOP aktif | Kelola SOP | Kelola akun |
|---|---|---|---|---|
| ADMIN | Semua | Semua | Semua divisi; arsip/pulihkan | Ya |
| MENTOR | Halaman panduan yang dapat dibuka pengguna login | Divisi yang ditetapkan | Divisi yang ditetapkan; arsip/pulihkan | Tidak |
| MAGANG | Halaman panduan yang dapat dibuka pengguna login | Semua SOP aktif | Tidak | Tidak |

Izin SOP berasal dari `getSopAccess` di `src/lib/sopAccess.ts`. Perubahan izin harus diperiksa pada halaman dan server action sekaligus. Sesi JWT membaca kembali data akun/role aktif pada callback JWT di `auth.ts`.

Riwayat SOP diatur server-side dengan izin yang sama seperti pengelolaan SOP. Log per SOP disimpan di model `SopAuditLog`; log menyimpan snapshot pelaku agar nama/email tetap dapat dikenali jika akun kelak dihapus, dan tidak memiliki foreign key ke `SopCase` agar catatan penghapusan tidak ikut hilang.

## 5. Peta direktori dan berkas

### Akar proyek

- `auth.ts` — konfigurasi NextAuth, validasi kredensial, sesi, role, dan status aktif.
- `package.json` / `package-lock.json` — perintah npm dan dependensi.
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs` — konfigurasi Next.js, TypeScript, dan ESLint.
- `prisma.config.ts` — lokasi schema/migrasi dan URL database dari environment.
- `.env` — konfigurasi rahasia lokal; **jangan dibaca/dibagikan atau dicatat dalam dokumentasi**. `.gitignore` mengabaikan file env.
- `backup_guidebook.sql` — dump SQL cadangan yang ada di repo; perlakukan sebagai data sensitif dan jangan menganggapnya sebagai cara deploy resmi tanpa meninjau isinya.
- `layout-changes.diff` — berkas diff tersimpan; periksa relevansinya sebelum digunakan kembali.
- `.next/`, `node_modules/`, `src/generated/prisma/`, `tsconfig.tsbuildinfo` — hasil build/dependensi/generasi lokal, bukan sumber utama yang diedit.
- `outputs/` — hasil keluaran lokal; bukan bagian kode aplikasi.

### `src/app/` — rute halaman dan endpoint

- `layout.tsx`, `globals.css`, `favicon.ico` — kerangka HTML global, gaya, ikon.
- `page.tsx` — beranda.
- `login/page.tsx` — login.
- `dafduk/page.tsx`, `dafduk/[service]/page.tsx` — daftar dan halaman layanan Dafduk.
- `dafduk/[service]/klasifikasi/[region]/page.tsx` — alur klasifikasi Pindah Keluar.
- `dafduk/[service]/finalisasi/page.tsx` — placeholder tahap finalisasi.
- `capil/page.tsx` — halaman Capil.
- `sop-directory/page.tsx` — mengambil kasus, kalender, dan izin SOP untuk direktori.
- `sop-management/page.tsx`, `sop-management/actions.ts`, `sop-management/new/page.tsx`, `sop-management/[id]/edit/page.tsx` — server actions serta form pengelolaan SOP.
- `account-management/page.tsx`, `account-management/actions.ts`, `account-management/new/page.tsx`, `account-management/[id]/edit/page.tsx`, `account-management/import/page.tsx`, `account-management/template/route.ts` — manajemen akun, impor, dan unduhan templat.
- `admin/page.tsx`, `tentang/page.tsx` — pengalihan admin dan informasi aplikasi.
- `api/auth/[...nextauth]/route.ts` — handler route NextAuth.

### `src/components/` — tampilan dan alur UI

- `layout/` — sidebar, navigasi seluler, header/profil, dan layout bersama.
- `home/ServiceCard.tsx` — kartu layanan pada beranda.
- `auth/LogoutButton.tsx` — tombol keluar.
- `ui/` — komponen umum: ikon, breadcrumb, toast, kartu pilihan, navigasi langkah, intro, dan transisi halaman.
- `dafduk/` — pilihan layanan, klasifikasi Pindah Keluar, verifikasi dokumen.
- `capil/` — pemilih layanan dan modul langkah Capil.
- `capil/kematian/` — kategori, langkah verifikasi, panel hasil, kartu, data, dan aturan Kematian.
- `capil/kelahiran/` — kategori, langkah verifikasi, panel hasil, kartu, data, dan aturan Kelahiran.
- `sop/` — direktori, filter, daftar/detail kasus, form, badge, tipe/data lama, dan perhitungan tenggat.
- `accounts/` — daftar/form akun, reset dan ubah sandi, impor akun Magang.

### `src/lib/`, `src/types/`, dan database

- `src/lib/prisma.ts` — Prisma Client bersama.
- `src/lib/sopCases.ts` — baca kasus, impor data awal lama sekali, pemetaan record.
- `src/lib/sopAudit.ts` — pembuatan log audit dan perbandingan nilai SOP lama/baru.
- `src/lib/sopAccess.ts` — hak akses SOP mentor/admin/magang dan pemetaan divisi.
- `src/lib/holidayCalendar.ts` — mengambil data hari libur dan tahun kalender lengkap.
- `src/lib/internImport.ts` — parsing, validasi, dan pratinjau workbook impor.
- `src/components/sop/sopDeadline.ts` — tanggal hari kerja dan penggantian token templat.
- `src/types/next-auth.d.ts` — perluasan tipe session/JWT.
- `prisma/schema.prisma` — model Role, User, UserSopDivision, SopCase, SopAuditLog, SopDataMigration, HolidayCalendar, NationalHoliday.
- `prisma/migrations/` — migrasi SQL versi database; jangan mengedit migrasi lama yang telah digunakan di lingkungan bersama.
- `prisma/seed.js` — menyiapkan tiga role awal.
- `prisma/create-admin.js` — membuat akun admin interaktif.
- `public/` — aset statis Next.js bawaan dan aset publik.
- `docs/` — catatan sprint dan panduan ini.

## 6. Model data

- `Role` dan `User`: akun, hash kata sandi, role, status aktif.
- `UserSopDivision`: relasi banyak-ke-banyak sederhana untuk divisi SOP mentor.
- `SopCase`: kategori/jenis kasus, judul, klasifikasi, deskripsi, templat, kata kunci, durasi tenggat, urutan, status arsip.
- `SopDataMigration`: penanda bahwa impor satu kali data SOP statis telah dijalankan.
- `HolidayCalendar` dan `NationalHoliday`: tahun, sumber, kelengkapan kalender, dan tanggal hari libur.

Perubahan schema biasanya membutuhkan migrasi database dan regenerasi Prisma Client. Folder `src/generated/prisma` dibuat oleh generator dan diabaikan Git; jangan mengedit file hasil generasi secara manual.

## 7. Alur aman saat mengubah proyek

1. Tentukan halaman/fitur dari `src/app/`, lalu ikuti komponen dan fungsi `src/lib/` yang dipakai.
2. Untuk aturan hasil verifikasi, baca logika **dan** file data terkait. Aturan operasional harus dikonfirmasi terhadap sumber resmi pemilik proses.
3. Untuk izin, periksa rendering halaman dan server action. Jangan mengandalkan menyembunyikan tombol/menu.
4. Untuk perubahan data, perbarui schema melalui migrasi baru; pertahankan data yang sudah ada dan tinjau dampak migrasi.
5. Untuk perubahan struktur SOP, ingat bahwa data awal hanya diimpor satu kali. Mengubah `sopCases.ts` tidak otomatis menimpa record yang sudah ada di database.
6. Untuk kalender hari libur, rujuk SKB resmi, catat sumber, dan tandai tahun lengkap hanya setelah datanya diverifikasi.
7. Perbarui panduan ini dan catatan sprint jika fitur, batas, role, perintah, atau struktur berkas berubah.

Perintah yang tersedia untuk pemeriksaan manual: `npm run lint` dan `npm run build`. Proyek saat ini belum mendefinisikan script test otomatis di `package.json`.

## 8. Batas dan pekerjaan yang perlu diperhatikan penerus

- Verifikasi Pindah Datang, beberapa klasifikasi Pindah Keluar, serta finalisasi SIAK masih belum dibuat.
- Kategori kelahiran bayi dewasa belum mempunyai alur verifikasi tersambung.
- Kalender libur tidak memiliki UI; pemeliharaan tiap tahun harus dilakukan terencana dari sumber resmi.
- Kalender yang belum lengkap menyebabkan token tenggat menampilkan pesan ketersediaan kalender.
- Tidak ada audit log untuk perubahan akun/SOP dan tidak ada undangan atau reset sandi melalui email.
- Manajemen akun tidak menghapus akun permanen. SOP yang sudah diarsipkan dapat dipulihkan atau dihapus permanen oleh pengelola dengan izin pada divisinya.
- Dokumen sprint `docs/sop-management-sprint.md` dan `docs/account-management-sprint.md` adalah catatan checkpoint historis; status di tabelnya mungkin tertinggal dari fitur saat ini. Gunakan kode dan panduan ini untuk kondisi implementasi terbaru.
- Pastikan `DATABASE_URL` menunjuk database yang benar sebelum menjalankan migrasi, seed, atau skrip admin.

## 9. Konteks singkat untuk AI pengembang

Gunakan teks berikut ketika memulai sesi bantuan AI baru:

> Proyek ini adalah GUIDEBOOK ADMINDUK, aplikasi internal panduan operasional Disdukcapil Sidoarjo, bukan integrasi PLAVON/SIAK. Stack: Next.js App Router, React, TypeScript, NextAuth JWT, Prisma, MySQL. Baca `docs/PANDUAN-PENGEMBANG.md` lebih dulu. Ikuti pola route di `src/app`, UI di `src/components`, aturan bersama di `src/lib`, dan schema/migrasi di `prisma`. Jaga pemeriksaan role di server actions, jangan membocorkan `.env` atau data sensitif, jangan mengubah migrasi lama yang telah diterapkan, dan jangan menganggap placeholder sebagai fitur selesai. Konfirmasikan aturan layanan dengan sumber resmi sebelum mengubah logika operasional. Setelah perubahan yang memengaruhi perilaku atau struktur, perbarui dokumentasi.
