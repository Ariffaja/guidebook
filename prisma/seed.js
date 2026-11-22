
const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      name: "ADMIN",
      description: "Pengelola utama aplikasi",
    },
    {
      name: "MENTOR",
      description: "Pengelola konten panduan dan SOP",
    },
    {
      name: "MAGANG",
      description: "Pengguna yang mengakses panduan operasional",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }

  console.log("Data role berhasil disiapkan.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
