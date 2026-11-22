export const SOP_DEADLINE_TOKEN = "{{TANGGAL_TENGGAT}}";

function jakartaToday(now: Date): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "0";
  return new Date(Date.UTC(Number(part("year")), Number(part("month")) - 1, Number(part("day"))));
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Adds working days using Asia/Jakarta dates, skipping weekends and official national holidays. */
export function getSopDeadline(
  days: number,
  holidays: readonly string[],
  completeYears: readonly number[],
  now: Date = new Date(),
): string | null {
  if (!Number.isInteger(days) || days < 1 || days > 30) return null;

  const date = jakartaToday(now);
  const holidaySet = new Set(holidays);
  const readyYears = new Set(completeYears);
  let remaining = days;

  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (!readyYears.has(date.getUTCFullYear())) return null;
    const weekday = date.getUTCDay();
    if (weekday === 0 || weekday === 6) continue;

    if (holidaySet.has(isoDate(date))) continue;
    remaining -= 1;
  }

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  return `${formattedDate} pukul 12.00 WIB`;
}

export function renderSopTemplate(
  template: string | undefined,
  days: number | null | undefined,
  holidays: readonly string[],
  completeYears: readonly number[],
): string | undefined {
  if (!template || !days || !template.includes(SOP_DEADLINE_TOKEN)) return template;
  const deadline = getSopDeadline(days, holidays, completeYears);
  return template.replaceAll(SOP_DEADLINE_TOKEN, deadline ?? "[kalender libur nasional belum tersedia]");
}
