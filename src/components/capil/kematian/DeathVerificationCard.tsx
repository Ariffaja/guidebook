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

const badgeConfig: Record<DeathDocumentResult, { label: string; badge: string; dot: string }> = {
  pending: { label: "Belum Lengkap", badge: "bg-[#eceef0] text-[#424752] font-medium", dot: "bg-[#727784]" },
  valid: { label: "Lengkap & Valid", badge: "bg-[#90efef] text-[#006e6e] font-semibold", dot: "bg-[#006a6a]" },
  tolak: { label: "Tidak Memenuhi", badge: "bg-[#ffdad6] text-[#93000a] font-semibold", dot: "bg-[#ba1a1a]" },
  perbaikan: { label: "Perlu Perbaikan", badge: "bg-[#ffdbcc] text-[#351000] font-semibold", dot: "bg-[#722b00]" },
};

const selectClass =
  "w-full cursor-pointer appearance-none rounded bg-white px-3.5 py-2.5 pr-10 text-sm text-[#191c1e] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003F87]/40";

function ConditionSelect<T extends string>({
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
    <>
      <label htmlFor={id} className="text-[13px] font-medium text-[#424752]">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={selectClass}
          value={value}
          onChange={(event) => onChange(event.target.value as T | "")}
        >
          <option value="">Pilih kondisi</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="expand_more"
          className="pointer-events-none absolute right-3 top-2.5 text-[20px] text-[#727784]"
        />
      </div>
    </>
  );
}

type DeathVerificationCardProps = {
  document: DeathVerificationDocument;
  selection: DeathDocumentSelection;
  result: DeathDocumentResult;
  onChange: (next: DeathDocumentSelection) => void;
};

/** Kartu satu dokumen: pemeriksaan [INPUT] dan [GAMBAR] yang independen. */
export default function DeathVerificationCard({
  document: doc,
  selection,
  result,
  onChange,
}: DeathVerificationCardProps) {
  const badge = badgeConfig[result];

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3 pb-3 md:items-center">
        <div className="flex items-start gap-3 md:items-center">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#0056B3] text-sm font-bold text-white md:mt-0">
            {doc.id}
          </div>
          <div className="flex items-center gap-2">
            <Icon name={doc.icon} className="shrink-0 text-[22px] text-[#003F87]" />
            <span className="text-base font-semibold leading-snug text-[#191c1e]">{doc.title}</span>
          </div>
        </div>
        <span
          className={`flex shrink-0 items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs md:self-auto ${badge.badge}`}
        >
          <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
          {badge.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-1 md:grid-cols-2">
        <div className="flex flex-col gap-2 rounded bg-[#f2f4f6] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#003F87]">
              [INPUT] DATA TEKS PLAVON
            </span>
            <Icon name="keyboard" className="text-[16px] text-[#424752]/70" />
          </div>
          <ConditionSelect<DeathInputCondition>
            id={`death-input-cond-${doc.id}`}
            label="Kondisi Data Input"
            value={selection.input}
            options={deathInputOptions}
            onChange={(input) => onChange({ ...selection, input })}
          />
        </div>

        <div className="flex flex-col gap-2 rounded bg-[#f2f4f6] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006a6a]">
              [GAMBAR] LAMPIRAN FISIK
            </span>
            <Icon name="photo_library" className="text-[16px] text-[#424752]/70" />
          </div>
          <ConditionSelect<DeathImageCondition>
            id={`death-image-cond-${doc.id}`}
            label="Kondisi Berkas Fisik / Foto"
            value={selection.image}
            options={deathImageOptions}
            onChange={(image) => onChange({ ...selection, image })}
          />
        </div>
      </div>
    </div>
  );
}
