import Icon from "@/components/ui/Icon";
import {
  deathImageOptions,
  deathInputOptions,
  type ConditionOption,
  type DeathDocumentSelection,
  type DeathImageCondition,
  type DeathInputCondition,
  type DeathVerificationDocument,
} from "./deathVerificationData";
import type { DeathDocumentResult } from "./deathVerificationLogic";

const badgeConfig: Record<DeathDocumentResult, { label: string; badge: string }> = {
  pending: { label: "Belum Lengkap", badge: "bg-[#eceef0] text-[#424752]" },
  valid: { label: "Lengkap & Valid", badge: "bg-[#90efef] text-[#006e6e]" },
  tolak: { label: "Tidak Memenuhi", badge: "bg-[#ffdad6] text-[#93000a]" },
  perbaikan: { label: "Perlu Perbaikan", badge: "bg-[#ffdbcc] text-[#722b00]" },
};

function ConditionRadioGroup<T extends string>({
  name,
  label,
  value,
  options,
  onChange,
}: {
  name: string;
  label: string;
  value: T | "";
  options: ConditionOption<T>[];
  onChange: (value: T) => void;
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
            className={`flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 text-[12px] leading-snug transition-colors ${
              selected
                ? "border-[#9db6d4] bg-[#f2f6fb] text-[#191c1e]"
                : "border-[#e7eaee] bg-white text-[#424752] hover:border-[#b8c9df]"
            }`}
          >
            <input
              type="radio"
              name={name}
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

type DeathVerificationCardProps = {
  document: DeathVerificationDocument;
  selection: DeathDocumentSelection;
  result: DeathDocumentResult;
  onChange: (next: DeathDocumentSelection) => void;
};

/** Satu dokumen dengan dua kelompok radio terpisah: data PLAVON dan lampiran fisik. */
export default function DeathVerificationCard({
  document: doc,
  selection,
  result,
  onChange,
}: DeathVerificationCardProps) {
  const badge = badgeConfig[result];

  return (
    <section className="rounded-lg border border-[#e4e8ed] bg-white p-4 shadow-sm">
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
        <ConditionRadioGroup<DeathInputCondition>
          name={`death-input-${doc.id}`}
          label="Data teks PLAVON"
          value={selection.input}
          options={deathInputOptions}
          onChange={(input) => onChange({ ...selection, input })}
        />
        <ConditionRadioGroup<DeathImageCondition>
          name={`death-image-${doc.id}`}
          label="Lampiran fisik"
          value={selection.image}
          options={deathImageOptions}
          onChange={(image) => onChange({ ...selection, image })}
        />
      </div>
    </section>
  );
}
