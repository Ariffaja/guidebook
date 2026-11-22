import { prisma } from "@/lib/prisma";

export async function getHolidayCalendarData() {
  const [holidays, calendars] = await Promise.all([
    prisma.nationalHoliday.findMany({ select: { date: true } }),
    prisma.holidayCalendar.findMany({ where: { isComplete: true }, select: { year: true } }),
  ]);
  return {
    holidays: holidays.map(({ date }) => date.toISOString().slice(0, 10)),
    completeYears: calendars.map(({ year }) => year),
  };
}
