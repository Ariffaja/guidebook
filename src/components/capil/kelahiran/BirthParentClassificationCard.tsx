"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import {
  classifyBirthParentStatus,
  isValidClassificationDate,
  todayInJakarta,
  type BirthParentClassification,
} from "./birthVerificationLogic";

export default function BirthParentClassificationCard({
  onClassificationChange,
  subjectLabel = "bayi",
}: {
  onClassificationChange: (classification: BirthParentClassification | null) => void;
  subjectLabel?: string;
}) {
  const [birthDate, setBirthDate] = useState("");
  const [marriageDate, setMarriageDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [marriageTime, setMarriageTime] = useState("");

  const birthDateValid = isValidClassificationDate(birthDate);
  const marriageDateValid = isValidClassificationDate(marriageDate);
  const today = todayInJakarta();
  const sameDate = Boolean(birthDateValid && marriageDateValid && birthDate === marriageDate);
  const classification = classifyBirthParentStatus(
    birthDate,
    marriageDate,
    sameDate ? birthTime : "",
    sameDate ? marriageTime : "",
  );

  function notifyClassification(
    nextBirthDate: string,
    nextMarriageDate: string,
    nextBirthTime = birthTime,
    nextMarriageTime = marriageTime,
  ) {
    onClassificationChange(
      classifyBirthParentStatus(
        nextBirthDate,
        nextMarriageDate,
        nextBirthDate === nextMarriageDate ? nextBirthTime : "",
        nextBirthDate === nextMarriageDate ? nextMarriageTime : "",
      ),
    );
  }

  function changeBirthDate(value: string) {
    setBirthDate(value);
    if (value !== marriageDate) {
      setBirthTime("");
      setMarriageTime("");
      notifyClassification(value, marriageDate, "", "");
    } else {
      notifyClassification(value, marriageDate);
    }
  }

  function changeMarriageDate(value: string) {
    setMarriageDate(value);
    if (value !== birthDate) {
      setBirthTime("");
      setMarriageTime("");
      notifyClassification(birthDate, value, "", "");
    } else {
      notifyClassification(birthDate, value);
    }
  }

  function changeBirthTime(value: string) {
    setBirthTime(value);
    notifyClassification(birthDate, marriageDate, value, marriageTime);
  }

  function changeMarriageTime(value: string) {
    setMarriageTime(value);
    notifyClassification(birthDate, marriageDate, birthTime, value);
  }

  return (
    <section className="mb-5 rounded-xl border border-[#c7d8ee] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf4ff] text-[#0056B3]">
          <Icon name="family_restroom" className="text-[20px]" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-[#191c1e]">Penentuan Klasifikasi Anak</h2>
          <p className="mt-1 text-xs leading-relaxed text-[#59616d]">
            Masukkan tanggal peristiwa dari dokumen yang diperiksa. Untuk perkawinan, gunakan tanggal perkawinan yang tercantum pada buku/kutipan nikah, bukan tanggal dokumen diterbitkan.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold text-[#424752]">
          Tanggal lahir {subjectLabel}
          <input
            type="date"
            min="1900-01-01"
            max={today}
            value={birthDate}
            onChange={(event) => changeBirthDate(event.target.value)}
            className="mt-1.5 block min-h-10 w-full rounded-lg border border-[#c2c6d4] bg-white px-3 text-sm font-normal text-[#191c1e] focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20"
          />
        </label>
        <label className="text-xs font-semibold text-[#424752]">
          Tanggal perkawinan orang tua
          <input
            type="date"
            min="1900-01-01"
            max={today}
            value={marriageDate}
            onChange={(event) => changeMarriageDate(event.target.value)}
            className="mt-1.5 block min-h-10 w-full rounded-lg border border-[#c2c6d4] bg-white px-3 text-sm font-normal text-[#191c1e] focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20"
          />
        </label>
      </div>

      {sameDate && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="mb-3 text-xs leading-relaxed text-amber-950">
            Kedua peristiwa terjadi pada tanggal yang sama. Masukkan waktu dari dokumen untuk menentukan urutannya.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#424752]">
              Waktu lahir bayi
              <input
                type="time"
                step="1"
                value={birthTime}
                onChange={(event) => changeBirthTime(event.target.value)}
                className="mt-1.5 block min-h-10 w-full rounded-lg border border-[#c2c6d4] bg-white px-3 text-sm font-normal text-[#191c1e] focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20"
              />
            </label>
            <label className="text-xs font-semibold text-[#424752]">
              Waktu perkawinan
              <input
                type="time"
                step="1"
                value={marriageTime}
                onChange={(event) => changeMarriageTime(event.target.value)}
                className="mt-1.5 block min-h-10 w-full rounded-lg border border-[#c2c6d4] bg-white px-3 text-sm font-normal text-[#191c1e] focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20"
              />
            </label>
          </div>
        </div>
      )}

      <div aria-live="polite" className={`mt-4 rounded-lg border p-3 ${classification ? "border-[#b7e9e5] bg-[#e8faf8]" : "border-[#e0e3e5] bg-[#f7f9fb]"}`}>
        {classification ? (
          <>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#59616d]">Hasil klasifikasi</p>
            <p className="mt-1 text-sm font-bold text-[#075c58]">
              {classification === "asi" ? "Anak Seorang Ibu (ASI)" : "Anak Ibu dan Ayah"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#424752]">
              {sameDate
                ? classification === "asi"
                  ? `${subjectLabel[0].toUpperCase()}${subjectLabel.slice(1)} lahir pukul ${birthTime}, sebelum perkawinan pukul ${marriageTime}.`
                  : `Perkawinan pukul ${marriageTime}, pada atau sebelum ${subjectLabel} lahir pukul ${birthTime}.`
                : classification === "asi"
                  ? `${subjectLabel[0].toUpperCase()}${subjectLabel.slice(1)} lahir pada ${birthDate}, sebelum tanggal perkawinan ${marriageDate}.`
                  : `Perkawinan pada ${marriageDate}, sebelum tanggal lahir ${subjectLabel} ${birthDate}.`}
            </p>
          </>
        ) : (
          <p className="text-xs leading-relaxed text-[#59616d]">
            {!birthDate || !marriageDate
              ? "Isi tanggal lahir dan tanggal perkawinan terlebih dahulu."
              : !birthDateValid || !marriageDateValid
                ? "Periksa kembali tanggal. Tahun harus lengkap dan tanggal tidak boleh lebih dari hari ini."
              : sameDate && (!birthTime || !marriageTime)
                ? "Tanggal sama. Isi waktu lahir dan waktu perkawinan terlebih dahulu."
                : sameDate
                  ? "Tanggal sama. Lengkapi waktu lahir dan waktu perkawinan untuk melihat klasifikasi."
                  : "Kedua tanggal sudah terisi. Klasifikasi akan ditampilkan otomatis."}
          </p>
        )}
      </div>
    </section>
  );
}
