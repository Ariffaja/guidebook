import { randomUUID } from "node:crypto";
import type { Prisma } from "@/generated/prisma";

export type SopAuditActor = {
  userId: number;
  name: string;
  email: string;
};

const sopAuditFields = [
  "category",
  "caseType",
  "ref",
  "title",
  "classification",
  "deadlineBusinessDays",
  "description",
  "template",
  "keywords",
] as const;

function jsonValue(value: unknown): Prisma.InputJsonValue | null {
  if (value === null || value === undefined) return null;
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export function getSopAuditChanges(
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null,
) {
  return sopAuditFields.flatMap((field) => {
    const oldValue = jsonValue(before?.[field]);
    const newValue = jsonValue(after?.[field]);
    if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return [];
    return [{ field, oldValue, newValue }];
  });
}

export async function createSopAuditLog(
  tx: Prisma.TransactionClient,
  input: {
    sopCaseId: string;
    sopTitle: string;
    category: string;
    action: "CREATE" | "UPDATE" | "ARCHIVE" | "RESTORE" | "DELETE";
    actor: SopAuditActor;
    details: Prisma.InputJsonValue;
  },
) {
  await tx.sopAuditLog.create({
    data: {
      id: randomUUID(),
      sopCaseId: input.sopCaseId,
      sopTitle: input.sopTitle,
      category: input.category,
      action: input.action,
      actorUserId: input.actor.userId,
      actorName: input.actor.name,
      actorEmail: input.actor.email,
      details: input.details,
      createdAt: new Date(),
    },
  });
}
