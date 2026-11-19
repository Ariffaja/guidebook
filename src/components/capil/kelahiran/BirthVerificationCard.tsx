import Icon from "@/components/ui/Icon";
import type {
  ConditionOption,
  DocumentSelection,
  ImageCondition,
  InputCondition,
  VerificationDocument,
} from "./birthVerificationData";
import type { DocumentResult } from "./birthVerificationLogic";

const badgeConfig: Record<DocumentResult, { label: string; badge: string }> = {
  pending: { label: "Belum Lengkap", badge: "bg-[#eceef0] text-[#424752] font-medium" },
  valid: { label: "Lengkap & Valid", badge: "bg-[#90efef] text-[#006e6e] font-semibold" },
  tolak: { label: "Tidak Memenuhi", badge: "bg-[#ffdad6] text-[#93000a] font-semibold" },
  perbaikan: { label: "Perlu Perbaikan", badge: "bg-[#ffdbcc] text-[#722b00] font-semibold" },
};

function ConditionRadioGroup<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: T | "";
  options: ConditionOption<T>[];
  onChange: (value: T | "") => void;
}) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-1.5">
      <legend className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#59616d]">
        {label}
      </legend>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={`flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 text-[11px] leading-snug transition-colors ${
              selected
                ? "border-[#9db6d4] bg-[#f2f6fb] text-[#191c1e]"
                : "border-[#e7eaee] bg-white text-[#424752] hover:border-[#b8c9df]"
            }`}
          >
            <input
              type="radio"
              name={id}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 shrink-0 accent-[#0056B3]"
            />
            <span>{option.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

type BirthVerificationCardProps = {
  document: VerificationDocument;
  selection: DocumentSelection;
  result: DocumentResult;
  onChange: (next: DocumentSelection) => void;
};

/** Satu dokumen dengan dua kelompok radio: data PLAVON dan lampiran fisik. */
export default function BirthVerificationCard({
  document: doc,
  selection,
  result,
  onChange,
}: BirthVerificationCardProps) {
  const badge = badgeConfig[result];

  return (
    <section className="rounded-xl border border-[#e4e8ed] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#eceef0] pb-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#e6e8ea] text-[#003F87]">
            <Icon name={doc.icon} className="text-[19px]" />
          </span>
          <h2 className="text-sm font-bold text-[#191c1e]">
            {doc.id}. {doc.title}
          </h2>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${badge.badge}`}>
          {badge.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ConditionRadioGroup<InputCondition>
          id={`input-cond-${doc.id}`}
          label="Data teks PLAVON"
          value={selection.input}
          options={doc.inputOptions}
          onChange={(input) => onChange({ ...selection, input })}
        />
        <ConditionRadioGroup<ImageCondition>
          id={`image-cond-${doc.id}`}
          label="Lampiran fisik"
          value={selection.image}
          options={doc.imageOptions}
          onChange={(image) => onChange({ ...selection, image })}
        />
      </div>
    </section>
  );
}
