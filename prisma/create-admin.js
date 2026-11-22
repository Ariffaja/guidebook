
const { PrismaClient } = require("../src/generated/prisma");
const bcrypt = require("bcryptjs");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const prisma = new PrismaClient();

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    const name = await rl.question("Nama Admin: ");
    const email = await rl.question("Email Admin: ");
    const password = await rl.question("Password Admin: ");

    if (!name.trim() || !email.trim() || password.length < 8) {
      throw new Error("Nama dan email wajib diisi. Password minimal 8 karakter.");
    }

    const adminRole = await prisma.role.findUnique({
      where: { name: "ADMIN" },
    });

    if (!adminRole) {
      throw new Error("Role ADMIN belum tersedia. Jalankan seed terlebih dahulu.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: passwordHash,
        roleId: adminRole.id,
      },
    });

    console.log("Akun Admin berhasil dibuat.");
  } finally {
    rl.close();
  }
}

main()
  .catch((error) => {
    console.error("Gagal membuat akun:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
