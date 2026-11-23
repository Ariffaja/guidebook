import { prisma } from "@/lib/prisma";
import type { SopCategory } from "@/components/sop/sopTypes";

export type SopDivisionKey = "DAFDUK" | "CAPIL";

export type SopAccess = {
  role: string;
  categories: SopCategory[];
  canManage: boolean;
};

export async function getSopAccess(userId: number): Promise<SopAccess | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isActive: true,
      role: { select: { name: true } },
      sopDivisions: { select: { division: true } },
    },
  });

  if (!user?.isActive) return null;

  const role = user.role.name;
  const categories =
    role === "ADMIN" || role === "MAGANG"
      ? (["dafduk", "capil"] as SopCategory[])
      : role === "MENTOR"
        ? user.sopDivisions.flatMap<SopCategory>(({ division }) =>
            division === "DAFDUK" ? ["dafduk"] : division === "CAPIL" ? ["capil"] : [],
          )
        : [];

  return {
    role,
    categories,
    canManage: role === "ADMIN" || (role === "MENTOR" && categories.length > 0),
  };
}

export function isSopDivisionKey(value: string): value is SopDivisionKey {
  return value === "DAFDUK" || value === "CAPIL";
}

export function categoryForDivision(division: SopDivisionKey): SopCategory {
  return division === "DAFDUK" ? "dafduk" : "capil";
}
