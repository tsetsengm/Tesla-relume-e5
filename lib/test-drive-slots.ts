/**
 * Test-drive booking rules and slot math — shared by the server (validation) and the booking form (display).
 * Change the schedule here. Times are Ulaanbaatar time (UTC+8, no daylight saving).
 */
export const TEST_DRIVE_DEPOSIT = 20_000; // ₮
/** First and last slot start hours: 10:00 … 18:00, each slot is one hour (last one ends 19:00) */
export const OPEN_HOUR = 10;
export const LAST_START_HOUR = 18;
/** 0 = Sunday … 6 = Saturday — Monday to Saturday */
export const WORK_DAYS = [1, 2, 3, 4, 5, 6];
/** How many days ahead can be booked, today included */
export const DAYS_AHEAD = 14;
/** A slot today must start at least this many hours from now */
export const MIN_LEAD_HOURS = 2;
/** An unpaid booking holds its hour this long, then the hour frees up again */
export const HOLD_MINUTES = 15;

/** Booking page link; a model slug preselects that car */
export const testDriveHref = (model?: string | boolean) => (typeof model === "string" ? `/test-drive?model=${model}` : "/test-drive");

const UB_OFFSET_MS = 8 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

const WEEKDAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];
const WEEKDAYS_SHORT = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"];

/** Every bookable slot start from `now` on, as ISO strings (UTC), in order. Taken slots are not removed here. */
export function allSlots(now: Date): string[] {
  const ub = new Date(now.getTime() + UB_OFFSET_MS); // UTC fields of `ub` = Ulaanbaatar wall clock
  const earliest = now.getTime() + MIN_LEAD_HOURS * HOUR_MS;
  const slots: string[] = [];
  for (let d = 0; d < DAYS_AHEAD; d++) {
    const day = new Date(Date.UTC(ub.getUTCFullYear(), ub.getUTCMonth(), ub.getUTCDate() + d));
    if (!WORK_DAYS.includes(day.getUTCDay())) continue;
    for (let h = OPEN_HOUR; h <= LAST_START_HOUR; h++) {
      const start = day.getTime() + h * HOUR_MS - UB_OFFSET_MS;
      if (start >= earliest) slots.push(new Date(start).toISOString());
    }
  }
  return slots;
}

/** Ulaanbaatar calendar parts of a slot */
export function slotParts(iso: string) {
  const ub = new Date(new Date(iso).getTime() + UB_OFFSET_MS);
  const month = ub.getUTCMonth() + 1;
  const date = ub.getUTCDate();
  const hour = ub.getUTCHours();
  const weekday = ub.getUTCDay();
  return {
    /** "2026-11-24" — groups slots by day */
    dayKey: `${ub.getUTCFullYear()}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`,
    month,
    date,
    weekday: WEEKDAYS[weekday],
    weekdayShort: WEEKDAYS_SHORT[weekday],
    /** "14:00–15:00" */
    time: `${String(hour).padStart(2, "0")}:00–${String(hour + 1).padStart(2, "0")}:00`,
  };
}

/** "11/24 (Даваа) 14:00–15:00" */
export function formatSlot(iso: string) {
  const p = slotParts(iso);
  return `${p.month}/${p.date} (${p.weekday}) ${p.time}`;
}

/** Same instant? (Postgres returns "+00:00", JS "Z") */
export const sameSlot = (a: string, b: string) => new Date(a).getTime() === new Date(b).getTime();
