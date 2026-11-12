import Icon from "@/components/ui/Icon";
import { ClassificationBadge, CategoryBadge } from "./SopBadges";
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
};

export default function SopCaseList({ cases, tokens, selectedId, onSelect, onReset }: SopCaseListProps) {
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
            <button
              type="button"
              onClick={() => onSelect(c.id)}
              aria-current={selected ? "true" : undefined}
              className={`relative w-full overflow-hidden rounded-lg border p-4 text-left shadow-sm transition-all hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3] ${
                selected ? "border-[#0056B3] bg-[#f4f8ff]" : "border-[#c2c6d4]/40 bg-white"
              }`}
            >
              {selected && <span className="absolute bottom-0 left-0 top-0 w-1.5 bg-[#0056B3]" />}
              <span className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={c.category} />
                  <ClassificationBadge classification={c.classification} />
                  {c.ref && c.category !== "capil" && (
                    <span className="text-[11px] font-medium text-[#727784]">{c.ref}</span>
                  )}
                </span>
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
          </li>
        );
      })}
    </ul>
  );
}
