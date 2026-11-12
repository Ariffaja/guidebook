import { sopCategories, sopClassifications, type SopCase } from "./sopTypes";

export function CategoryBadge({ category }: { category: SopCase["category"] }) {
  const meta = sopCategories.find((item) => item.key === category);
  return (
    <span className="rounded bg-[#e6e8ea] px-2 py-0.5 text-[11px] font-semibold text-[#191c1e]">
      {meta?.label ?? category}
    </span>
  );
}

/** Lencana klasifikasi. Tidak menampilkan apa pun jika kasus tidak punya klasifikasi di sumber. */
export function ClassificationBadge({
  classification,
}: {
  classification: SopCase["classification"];
}) {
  if (!classification) return null;
  const meta = sopClassifications.find((item) => item.value === classification);
  return (
    <span
      title={meta?.hint}
      className={`rounded px-2 py-0.5 text-[11px] font-semibold ${meta?.badgeClass ?? ""}`}
    >
      {classification}
    </span>
  );
}
