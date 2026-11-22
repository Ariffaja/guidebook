import * as XLSX from "xlsx";
import { auth } from "../../../../auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || !session.user.isActive) return new Response("Sesi tidak aktif.", { status: 401 });
  if (session.user.role !== "ADMIN") return new Response("Tidak memiliki akses.", { status: 403 });

  const workbook = XLSX.utils.book_new();
  const accounts = XLSX.utils.aoa_to_sheet([["Nama", "Email"]]);
  accounts["!cols"] = [{ wch: 32 }, { wch: 38 }];
  accounts["!autofilter"] = { ref: "A1:B1" };
  XLSX.utils.book_append_sheet(workbook, accounts, "Akun Magang");

  const instructions = XLSX.utils.aoa_to_sheet([
    ["Templat Impor Akun Magang"],
    ["Isi nama dan email pada sheet Akun Magang. Satu baris untuk satu pengguna."],
    ["Jangan mengubah judul kolom Nama dan Email."],
    ["Role setiap akun hasil impor otomatis menjadi MAGANG."],
    ["Sandi awal dimasukkan admin pada halaman impor, tidak disimpan di file ini."],
    ["Hapus baris kosong sebelum mengunggah. Maksimal 500 akun per impor."],
  ]);
  instructions["!cols"] = [{ wch: 100 }];
  XLSX.utils.book_append_sheet(workbook, instructions, "Petunjuk");

  const file = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="templat-akun-magang.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
