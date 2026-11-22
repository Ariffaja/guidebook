
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  guidebookPrisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.guidebookPrisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.guidebookPrisma = prisma;
}
