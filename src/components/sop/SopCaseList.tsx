import Icon from "@/components/ui/Icon";
import { CaseTypeBadge, ClassificationBadge, CategoryBadge } from "./SopBadges";
import { getTemplateSnippet, splitByTokens } from "./sopFilter";
import type { SopCase } from "./sopTypes";

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  return (
    <>
      {splitByTokens(text, tokens).map((segment, index) =>
        segment.match ? (
          <mark key={index} className="rounded bg-[#ffe9a8] px-0.5 text-inherit">
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}

type SopCaseListProps = {
  cases: SopCase[];
  tokens: string[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReset: () => void;
  onEdit?: (sopCase: SopCase) => void;
  onArchive?: (sopCase: SopCase) => void;
  onRestore?: (sopCase: SopCase) => void;
};

export default function SopCaseList({
  cases,
  tokens,
  selectedId,
  onSelect,
  onReset,
  onEdit,
  onArchive,
  onRestore,
}: SopCaseListProps) {
  if (cases.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg bg-white p-10 text-center shadow-sm">
        <Icon name="search_off" className="text-[32px] text-[#727784]" />
        <p className="text-sm text-[#424752]">
          Tidak ada catatan yang cocok dengan pencarian atau filter saat ini.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="rounded bg-[#eceef0] px-4 py-2 text-xs font-semibold text-[#191c1e] transition-colors hover:bg-[#e6e8ea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
        >
          Atur Ulang Pencarian dan Filter
        </button>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {cases.map((c) => {
        const selected = c.id === selectedId;
        const snippet = getTemplateSnippet(c, tokens);
        return (
          <li key={c.id}>
            <div
              className={`relative overflow-hidden rounded-lg border shadow-sm transition-all hover:-translate-y-0.5 hover:scale-[1.01] hover:border-[#0056B3] hover:shadow-md ${
                selected ? "border-[#0056B3] bg-[#f4f8ff]" : "border-[#c2c6d4]/40 bg-white"
              }`}
            >
              {selected && <span className="absolute bottom-0 left-0 top-0 w-1.5 bg-[#0056B3]" />}
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-current={selected ? "true" : undefined}
                className="block w-full cursor-pointer p-4 text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#0056B3]"
              >
                <span className="mb-2 flex flex-wrap items-center gap-2">
                  <CategoryBadge category={c.category} />
                  <CaseTypeBadge caseType={c.caseType} />
                  <ClassificationBadge classification={c.classification} />
                </span>
                <span className="block text-sm font-semibold leading-snug text-[#191c1e]">
                  <Highlight text={c.title} tokens={tokens} />
                </span>
                {snippet && (
                  <span className="mt-1.5 block text-xs leading-relaxed text-[#424752]">
                    <span className="font-semibold">Cocok di templat: </span>
                    <Highlight text={snippet} tokens={tokens} />
                  </span>
                )}
              </button>
              {(onEdit || onArchive || onRestore) && (
                <div className="flex justify-end gap-3 border-t border-[#eceef0] px-4 py-2.5">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(c)}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#0056B3] hover:text-[#003F87] focus-visible:outline-2 focus-visible:outline-[#0056B3]"
                    >
                      <Icon name="edit" className="text-[16px]" />
                      Edit
                    </button>
                  )}
                  {onArchive && (
                    <button
                      type="button"
                      onClick={() => onArchive(c)}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#59616d] hover:text-[#191c1e] focus-visible:outline-2 focus-visible:outline-[#0056B3]"
                    >
                      <Icon name="archive" className="text-[16px]" />
                      Arsipkan
                    </button>
                  )}
                  {onRestore && (
                    <button
                      type="button"
                      onClick={() => onRestore(c)}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#0056B3] hover:text-[#003F87] focus-visible:outline-2 focus-visible:outline-[#0056B3]"
                    >
                      <Icon name="unarchive" className="text-[16px]" />
                      Kembalikan
                    </button>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
