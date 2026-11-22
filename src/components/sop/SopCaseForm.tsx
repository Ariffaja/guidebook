"use client";

import Link from "next/link";
import { useActionState, useRef, useState, type KeyboardEvent } from "react";
import Icon from "@/components/ui/Icon";
import { createSopCase, updateSopCase } from "@/app/sop-management/actions";
import type { SopCase, SopCategory, SopCaseType } from "./sopTypes";
import { SOP_DEADLINE_TOKEN } from "./sopDeadline";

const caseTypes: Record<SopCategory, { value: SopCaseType; label: string }[]> = {
  dafduk: [
    { value: "pindah-datang", label: "Pindah Datang" },
    { value: "pindah-keluar", label: "Pindah Keluar" },
  ],
  capil: [
    { value: "kematian", label: "Kematian" },
    { value: "kelahiran", label: "Kelahiran" },
  ],
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#c2c6d4] bg-white px-3.5 py-2.5 text-sm text-[#191c1e] outline-none transition focus:border-[#0056B3] focus:ring-2 focus:ring-[#0056B3]/15";

export default function SopCaseForm({ initial }: { initial?: SopCase }) {
  const isEditing = Boolean(initial);
  const action = initial ? updateSopCase.bind(null, initial.id) : createSopCase;
  const [state, formAction, pending] = useActionState(action, {});
  const [category, setCategory] = useState<SopCategory>(initial?.category ?? "dafduk");
  const [caseType, setCaseType] = useState<string>(initial?.caseType ?? "");
  const [classification, setClassification] = useState(initial?.classification ?? "");
  const [deadlineEnabled, setDeadlineEnabled] = useState(Boolean(initial?.deadlineBusinessDays));
  const [deadlineDays, setDeadlineDays] = useState(String(initial?.deadlineBusinessDays ?? 1));
  const classificationRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const templateRef = useRef<HTMLTextAreaElement>(null);

  function handleClassificationKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % 2;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index + 1) % 2;
    if (nextIndex === null) return;
    event.preventDefault();
    setClassification(nextIndex === 0 ? "BTL" : "TDP");
    classificationRefs.current[nextIndex]?.focus();
  }

  function changeCategory(value: SopCategory) {
    setCategory(value);
    if (!caseTypes[value].some((item) => item.value === caseType)) setCaseType("");
  }

  function chooseClassification(value: "BTL" | "TDP") {
    const next = classification === value ? "" : value;
    setClassification(next);
    if (next !== "BTL") setDeadlineEnabled(false);
  }

  function insertDeadlineToken() {
    const textarea = templateRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value = `${textarea.value.slice(0, start)}${SOP_DEADLINE_TOKEN}${textarea.value.slice(end)}`;
    textarea.focus();
    textarea.setSelectionRange(start + SOP_DEADLINE_TOKEN.length, start + SOP_DEADLINE_TOKEN.length);
  }

  return (
    <div className="mx-auto w-full max-w-3xl pb-8">
      <Link
        href="/sop-directory"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#0056B3] hover:text-[#003F87]"
      >
        <Icon name="arrow_back" className="text-[18px]" />
        Kembali ke SOP Directory
      </Link>

      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-[32px] sm:leading-10">
          {isEditing ? "Edit Kasus" : "Tambah Kasus"}
        </h1>
        <p className="mt-1 text-sm text-[#59616d]">
          {isEditing ? "Perbarui informasi kasus dan templat respons." : "Isi informasi kasus dan templat respons yang akan ditampilkan di SOP Directory."}
        </p>
      </div>

      <form action={formAction} className="space-y-5 rounded-xl border border-[#e0e3e5] bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-[#424752]">
            Kategori utama <span className="text-red-700">*</span>
            <select
              name="category"
              value={category}
              onChange={(event) => changeCategory(event.target.value as SopCategory)}
              className={inputClass}
              required
            >
              <option value="dafduk">Dafduk — Pendaftaran Penduduk</option>
              <option value="capil">Capil — Pencatatan Sipil</option>
            </select>
          </label>

          <label className="block text-sm font-semibold text-[#424752]">
            Jenis kasus <span className="text-red-700">*</span>
            <select
              name="caseType"
              value={caseType}
              onChange={(event) => setCaseType(event.target.value)}
              className={inputClass}
              required
            >
              <option value="" disabled>Pilih jenis kasus</option>
              {caseTypes[category].map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-[#424752]">
            Klasifikasi hasil <span className="text-red-700">*</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-3" role="radiogroup" aria-label="Klasifikasi hasil" aria-required="true">
            {(["BTL", "TDP"] as const).map((value) => (
              <button
                key={value}
                ref={(node) => {
                  classificationRefs.current[value === "BTL" ? 0 : 1] = node;
                }}
                type="button"
                role="radio"
                aria-checked={classification === value}
                tabIndex={classification === value || (!classification && value === "BTL") ? 0 : -1}
                onKeyDown={(event) => handleClassificationKeyDown(event, value === "BTL" ? 0 : 1)}
                onClick={() => chooseClassification(value)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  classification === value
                    ? value === "BTL"
                      ? "border-amber-500 bg-amber-100 text-amber-950"
                      : "border-red-500 bg-red-100 text-red-950"
                    : "border-[#c2c6d4] text-[#191c1e] hover:bg-[#f7f9fb]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    classification === value
                      ? value === "BTL" ? "border-amber-700" : "border-red-700"
                      : "border-[#727784]"
                  }`}
                >
                  {classification === value && (
                    <span className={`h-2 w-2 rounded-full ${value === "BTL" ? "bg-amber-700" : "bg-red-700"}`} />
                  )}
                </span>
                <span>{value}</span>
                <span className="text-xs font-normal text-[#727784]">
                  {value === "BTL" ? "Berkas Tidak Lengkap" : "Tidak Dapat Diproses"}
                </span>
              </button>
            ))}
          </div>
          <input type="hidden" name="classification" value={classification} />
          {!classification && <p className="mt-1.5 text-xs text-[#727784]">Pilih BTL atau TDP.</p>}
        </fieldset>

        {classification === "BTL" && (
          <fieldset className="rounded-lg border border-[#e0e3e5] bg-[#f7f9fb] p-4">
            <legend className="px-1 text-sm font-semibold text-[#424752]">Tenggat kelengkapan berkas</legend>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-[#191c1e]">
              <input
                type="checkbox"
                name="hasDeadline"
                checked={deadlineEnabled}
                onChange={(event) => setDeadlineEnabled(event.target.checked)}
                className="mt-0.5 accent-[#0056B3]"
              />
              <span>Gunakan tanggal tenggat yang dihitung otomatis</span>
            </label>
            {deadlineEnabled && (
              <div className="mt-3 max-w-xs">
                <label htmlFor="deadlineBusinessDays" className="block text-sm font-medium text-[#424752]">
                  Batas waktu (hari kerja)
                </label>
                <input
                  id="deadlineBusinessDays"
                  name="deadlineBusinessDays"
                  type="number"
                  min={1}
                  max={30}
                  required
                  value={deadlineDays}
                  onChange={(event) => setDeadlineDays(event.target.value)}
                  className={inputClass}
                />
              </div>
            )}
          </fieldset>
        )}

        <label className="block text-sm font-semibold text-[#424752]">
          Judul kasus <span className="text-red-700">*</span>
          <input
            name="title"
            type="text"
            defaultValue={initial?.title ?? ""}
            maxLength={255}
            required
            placeholder="Contoh: Lampiran Surat Kematian Tidak Terbaca"
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-semibold text-[#424752]">
          Deskripsi / kondisi kasus
          <textarea
            name="description"
            defaultValue={initial?.description ?? ""}
            rows={4}
            className={inputClass}
            placeholder="Jelaskan kondisi yang menyebabkan kasus ini digunakan."
          />
        </label>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="template" className="text-sm font-semibold text-[#424752]">
              Templat respons operator <span className="text-red-700">*</span>
            </label>
            {classification === "BTL" && deadlineEnabled && (
              <button
                type="button"
                onClick={insertDeadlineToken}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#9bb8dc] bg-white px-3 py-2 text-xs font-semibold text-[#0056B3] shadow-sm transition-colors hover:border-[#0056B3] hover:bg-[#edf4ff] hover:text-[#003F87] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
              >
                <Icon name="event" className="text-[16px]" />
                Sisipkan tanggal tenggat
              </button>
            )}
          </div>
          <textarea
            ref={templateRef}
            id="template"
            name="template"
            defaultValue={initial?.template ?? ""}
            rows={9}
            required
            className={`${inputClass} font-mono text-[13px] leading-relaxed`}
            placeholder="Ketik templat respons operator..."
          />
          {classification === "BTL" && deadlineEnabled && (
            <p className="mt-1 text-xs text-[#727784]">
              Letakkan {SOP_DEADLINE_TOKEN} pada bagian tanggal di kalimat tenggat.
            </p>
          )}
        </div>

        {state.error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
            {state.error}
          </p>
        )}

        <div className="flex justify-end gap-2 border-t border-[#eceef0] pt-5">
          <Link
            href="/sop-directory"
            className="rounded-lg border border-[#c2c6d4] px-4 py-2.5 text-sm font-medium text-[#424752] hover:bg-[#f2f4f6]"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={pending || !classification}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0056B3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#003F87] disabled:cursor-wait disabled:opacity-60"
          >
            <Icon name={pending ? "hourglass_empty" : "save"} className="text-[18px]" />
            {pending ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Simpan Kasus"}
          </button>
        </div>
      </form>
    </div>
  );
}
