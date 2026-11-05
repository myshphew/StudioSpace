/** Currency, date, and time formatting for the Danish-approved ৳ (BDT) context. */

export function formatBDT(amount: number, options?: { compact?: boolean }) {
  if (options?.compact && amount >= 1000) {
    return `৳${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  }
  return `৳${amount.toLocaleString("en-US")}`;
}

/** `2026-03-14` → `Mar 14, 2026`. */
export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(
    "en-US",
    opts ?? { month: "short", day: "numeric", year: "numeric" },
  );
}

/** `2026-03-14` → `Sat, Mar 14`. */
export function formatShortDate(iso: string) {
  return formatDate(iso, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** `14:30` → `2:30 PM` */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour} ${ampm}` : `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** `14:30` (start) + hours → `17:30` */
export function addHours(hhmm: string, hours: number) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + hours * 60;
  const wrapped = ((total % 1440) + 1440) % 1440;
  const hh = Math.floor(wrapped / 60);
  const mm = wrapped % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function endLabel(start: string, hours: number) {
  return `${formatTime(start)} – ${formatTime(addHours(start, hours))}`;
}

export function todayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDaysISO(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/** Weekday of an ISO date, 0 = Sunday … 6 = Saturday. */
export function weekdayOf(iso: string) {
  return new Date(`${iso}T00:00:00`).getDay();
}

/** Minutes between `HH:mm` times (a-b, positive when a is later). */
export function minutesBetween(a: string, b: string) {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return (ah * 60 + am) - (bh * 60 + bm);
}

export function minutesOf(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function pluralize(n: number, singular: string, plural: string) {
  return n === 1 ? `${n} ${singular}` : `${n} ${plural}`;
}

/** Deterministic booking reference. */
export function bookingReference(seq: number) {
  const year = new Date().getFullYear();
  return `SS-${year}-${String(seq).padStart(4, "0")}`;
}
