import { prisma } from "@/lib/prisma";
import { sopCases as legacyCases } from "@/components/sop/sopCases";
import type { SopCase } from "@/components/sop/sopTypes";
import type { SopCategory } from "@/components/sop/sopTypes";

let legacyImport: Promise<void> | null = null;

/** Import initial records once so the move from the old code-based directory is lossless. */
async function ensureInitialCases() {
  if (!legacyImport) {
    legacyImport = (async () => {
      try {
        await prisma.$transaction(async (tx) => {
          const migrationKey = "initial-static-sop-cases-v1";
          if (await tx.sopDataMigration.findUnique({ where: { key: migrationKey } })) return;

          if ((await tx.sopCase.count()) === 0) {
            await tx.sopCase.createMany({
              data: legacyCases.map((item, index) => ({
                id: item.id,
                sortOrder: index,
                updatedAt: new Date(),
                category: item.category,
                caseType: item.caseType ?? null,
                ref: item.ref ?? null,
                title: item.title,
                classification: item.classification ?? null,
                description: item.description ?? null,
                template: item.template ?? null,
                keywords: item.keywords ?? undefined,
              })),
              skipDuplicates: true,
            });
          }

          await tx.sopDataMigration.create({ data: { key: migrationKey } });
        });
      } catch (error) {
        // Another server instance may have completed this one-time import concurrently.
        if (!(error && typeof error === "object" && "code" in error && error.code === "P2002")) {
          throw error;
        }
      }
    })().catch((error) => {
      legacyImport = null;
      throw error;
    });
  }

  await legacyImport;
}

export async function getSopCases(categories?: SopCategory[], archived = false): Promise<SopCase[]> {
  await ensureInitialCases();
  if (categories && categories.length === 0) return [];
  const records = await prisma.sopCase.findMany({
    where: {
      isArchived: archived,
      ...(categories ? { category: { in: categories } } : {}),
    },
    orderBy: { sortOrder: "asc" },
  });

  return records.map((record) => ({
    id: record.id,
    category: record.category as SopCase["category"],
    caseType: (record.caseType as SopCase["caseType"]) ?? null,
    ref: record.ref ?? undefined,
    title: record.title,
    classification: (record.classification as SopCase["classification"]) ?? undefined,
    deadlineBusinessDays: record.deadlineBusinessDays ?? null,
    description: record.description ?? undefined,
    template: record.template ?? undefined,
    keywords: Array.isArray(record.keywords) ? record.keywords.map(String) : undefined,
    isArchived: record.isArchived,
  }));
}
