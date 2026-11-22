# Sprint Checkpoint: Manajemen Akun

## Keputusan

- Menu dan seluruh aksi manajemen akun hanya untuk role `ADMIN`.
- Admin dapat melihat, mencari, dan memfilter akun; membuat akun; mengedit nama, email, dan role; mengaktifkan/menonaktifkan akun; serta mereset sandi.
- Role yang dapat dipilih: `ADMIN`, `MENTOR`, dan `MAGANG`. Hak akses yang sudah berjalan tetap dipertahankan; `MENTOR` belum mendapat akses ke SOP Management.
- Tambah dan edit memakai halaman terpisah. Penghapusan akun permanen tidak termasuk versi pertama.
- Admin menentukan sandi awal akun dan sandi reset (minimal 8 karakter), lalu menyampaikannya kepada pengguna secara terpisah. Kata sandi disimpan dalam bentuk hash.
- Pengguna dapat mengganti sandi dari menu profil dengan memasukkan sandi saat ini, sandi baru, dan konfirmasi sandi baru.
- Akun yang sedang digunakan tidak dapat dinonaktifkan atau diturunkan dari role ADMIN. Admin aktif terakhir tidak dapat dinonaktifkan atau diturunkan role-nya.

## Checkpoint

| # | Pekerjaan | Status |
|---|---|---|
| 1 | Tambah menu dan halaman daftar akun khusus admin | Selesai |
| 2 | Tambah akun dan edit profil/role di halaman terpisah | Selesai |
| 3 | Aktifkan/nonaktifkan akun dengan perlindungan admin terakhir | Selesai |
| 4 | Reset sandi oleh admin dan ubah sandi mandiri melalui profil | Selesai |
| 5 | Perbarui sesi dan batasi akses akun nonaktif/role terbaru | Selesai |
| 6 | Impor akun magang melalui templat Excel, pratinjau, validasi, dan sandi batch | Selesai |
| 7 | Verifikasi alur dan izin akses | Belum mulai |

## Catatan

- Perubahan role dan status harus segera tercermin pada sesi berikutnya.
- Tidak ada layanan email untuk mengirim sandi. Admin bertanggung jawab menyampaikan sandi awal/reset secara terpisah.
- Audit log perubahan akun dan alur undangan/reset lewat email belum termasuk versi pertama.

## Impor akun magang

- Admin perlu dapat mengunduh templat Excel, mengisinya untuk satu gelombang magang, lalu mengimpor banyak akun sekaligus.
- Templat XLSX berisi kolom nama dan email; role ditetapkan otomatis menjadi `MAGANG` agar isi berkas lebih sederhana.
- Sebelum membuat akun, tampilkan pratinjau dan hasil validasi per baris (data wajib kosong, format email, dan email yang sudah terdaftar); admin mengonfirmasi impor setelah meninjau hasilnya.
- Admin memasukkan dan mengonfirmasi satu sandi awal yang dipakai oleh semua akun pada impor tersebut. Sandi tidak disimpan di file Excel. Pengguna diminta menggantinya dari profil setelah masuk.
- Maksimum unggahan 5 MB dan 500 akun per batch.
