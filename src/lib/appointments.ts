import { addDays, format, parseISO } from "date-fns";

export type Appointment = {
  id: string;
  doctorName: string;
  clinic: string;
  city: string;
  phone: string;
  date: string; // yyyy-MM-dd
  slot: string; // "10:30"
  mode: "clinic" | "online";
  reason: string;
  name: string;
  contact: string;
  createdAt: string;
  status: "requested" | "cancelled";
};

const KEY = "sakhi:v1:appointments";

export function getAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Appointment[]) : [];
    return list.sort((a, b) => (a.date + a.slot < b.date + b.slot ? -1 : 1));
  } catch {
    return [];
  }
}

export function saveAppointment(a: Appointment) {
  const list = getAppointments().filter((x) => x.id !== a.id);
  list.push(a);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("sakhi:appointments"));
}

export function cancelAppointment(id: string) {
  const list = getAppointments().map((a) => (a.id === id ? { ...a, status: "cancelled" as const } : a));
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("sakhi:appointments"));
}

export function removeAppointment(id: string) {
  const list = getAppointments().filter((a) => a.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("sakhi:appointments"));
}

/** Parse an hours string like "24×7", "9am–9pm", "10am–6pm" into [startHour, endHour]. */
export function parseHours(hours: string): { start: number; end: number; allDay: boolean } {
  if (/24/.test(hours)) return { start: 0, end: 24, allDay: true };
  const m = hours.match(/(\d{1,2})\s*(am|pm)\s*[–\-—]\s*(\d{1,2})\s*(am|pm)/i);
  if (!m) return { start: 9, end: 18, allDay: false };
  const to24 = (h: number, ap: string) => {
    const l = ap.toLowerCase();
    if (l === "am") return h === 12 ? 0 : h;
    return h === 12 ? 12 : h + 12;
  };
  return { start: to24(+m[1], m[2]), end: to24(+m[3], m[4]), allDay: false };
}

export type DaySlots = { date: string; label: string; weekday: string; slots: string[]; closed: boolean };

/**
 * Deterministic availability for the next `days` days.
 * 24×7 doctors keep a night emergency block; others follow their listed hours.
 * Sunday is closed for non-24×7 clinics.
 */
export function buildAvailability(hours: string, phone: string, days = 7, from = new Date()): DaySlots[] {
  const { start, end, allDay } = parseHours(hours);
  const seedBase = phone.replace(/\D/g, "").slice(-5) || "12345";
  const out: DaySlots[] = [];

  for (let i = 0; i < days; i++) {
    const d = addDays(from, i);
    const date = format(d, "yyyy-MM-dd");
    const isSunday = d.getDay() === 0;
    if (isSunday && !allDay) {
      out.push({ date, label: format(d, "d MMM"), weekday: format(d, "EEE"), slots: [], closed: true });
      continue;
    }

    const s = allDay ? 8 : start;
    const e = allDay ? 21 : end;
    const slots: string[] = [];
    for (let h = s; h < e; h++) {
      for (const min of [0, 30]) {
        // Deterministic pseudo-booking so some slots appear taken.
        const seed = (+seedBase + i * 37 + h * 13 + min) % 10;
        if (seed < 4) continue;
        slots.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
      }
    }
    if (allDay) slots.push("22:00", "23:30");

    // Hide slots already in the past for today.
    const filtered =
      i === 0
        ? slots.filter((t) => {
            const [hh, mm] = t.split(":").map(Number);
            const now = new Date();
            return hh * 60 + mm > now.getHours() * 60 + now.getMinutes() + 30;
          })
        : slots;

    out.push({ date, label: format(d, "d MMM"), weekday: format(d, "EEE"), slots: filtered, closed: filtered.length === 0 });
  }
  return out;
}

export function prettySlot(date: string, slot: string) {
  const [h, m] = slot.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${format(parseISO(date), "EEE d MMM")} · ${hh}:${String(m).padStart(2, "0")} ${ap}`;
}
