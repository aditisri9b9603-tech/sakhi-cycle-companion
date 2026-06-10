import { addDays, differenceInDays, format, parseISO, startOfDay } from "date-fns";

export type CycleProfile = {
  nickname: string;
  lastPeriodStart: string;
  cycleLength: number;
  periodLength: number;
  city?: string;
};

export type LogEntry = {
  date: string;
  mood?: "happy" | "calm" | "sad" | "anxious" | "irritable" | "energetic";
  energy?: 1 | 2 | 3 | 4 | 5;
  flow?: "spotting" | "light" | "medium" | "heavy";
  symptoms?: string[];
  sleepHours?: number;
  waterCups?: number;
  intimacy?: boolean;
  notes?: string;
  updatedAt?: string;
};

const PROFILE_KEY = "sakhi:v2:profile";
const LOG_KEY = "sakhi:v2:logs";
const LEGACY_PROFILE = "sakhi:profile";
const LEGACY_LOG = "sakhi:log";

function migrate() {
  if (typeof window === "undefined") return;
  try {
    if (!localStorage.getItem(PROFILE_KEY) && localStorage.getItem(LEGACY_PROFILE)) {
      localStorage.setItem(PROFILE_KEY, localStorage.getItem(LEGACY_PROFILE)!);
    }
    if (!localStorage.getItem(LOG_KEY) && localStorage.getItem(LEGACY_LOG)) {
      localStorage.setItem(LOG_KEY, localStorage.getItem(LEGACY_LOG)!);
    }
  } catch {}
}

export function getProfile(): CycleProfile | null {
  if (typeof window === "undefined") return null;
  migrate();
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as CycleProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: CycleProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent("sakhi:profile"));
}

export function getLogs(): LogEntry[] {
  if (typeof window === "undefined") return [];
  migrate();
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? (JSON.parse(raw) as LogEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveLog(entry: LogEntry) {
  const e = { ...entry, updatedAt: new Date().toISOString() };
  const logs = getLogs().filter((l) => l.date !== e.date);
  logs.push(e);
  logs.sort((a, b) => (a.date < b.date ? 1 : -1));
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  window.dispatchEvent(new CustomEvent("sakhi:logs"));
}

export function deleteLog(date: string) {
  const logs = getLogs().filter((l) => l.date !== date);
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  window.dispatchEvent(new CustomEvent("sakhi:logs"));
}

export function exportAll(): string {
  return JSON.stringify({ profile: getProfile(), logs: getLogs(), exportedAt: new Date().toISOString() }, null, 2);
}

export function importAll(raw: string): { ok: boolean; msg: string } {
  try {
    const data = JSON.parse(raw);
    if (data.profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile));
    if (Array.isArray(data.logs)) localStorage.setItem(LOG_KEY, JSON.stringify(data.logs));
    window.dispatchEvent(new CustomEvent("sakhi:profile"));
    window.dispatchEvent(new CustomEvent("sakhi:logs"));
    return { ok: true, msg: "Imported successfully" };
  } catch (e) {
    return { ok: false, msg: "Invalid backup file" };
  }
}

export type CycleInsight = {
  dayOfCycle: number;
  phase: "menstrual" | "follicular" | "ovulation" | "luteal";
  phaseEmoji: string;
  phaseDescription: string;
  daysToNextPeriod: number;
  nextPeriodDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  ovulationDate: string;
  cyclePercent: number;
};

export function computeInsights(p: CycleProfile, today = new Date()): CycleInsight {
  const start = parseISO(p.lastPeriodStart);
  const t = startOfDay(today);
  let dayOfCycle = differenceInDays(t, start) + 1;
  while (dayOfCycle > p.cycleLength) dayOfCycle -= p.cycleLength;
  if (dayOfCycle < 1) dayOfCycle += p.cycleLength;

  const ovulationDay = p.cycleLength - 14;
  let phase: CycleInsight["phase"] = "follicular";
  let phaseEmoji = "🌱";
  let phaseDescription = "";

  if (dayOfCycle <= p.periodLength) {
    phase = "menstrual"; phaseEmoji = "🌹";
    phaseDescription = "Rest, hydrate, and be gentle with yourself. Iron-rich foods help.";
  } else if (dayOfCycle < ovulationDay - 1) {
    phase = "follicular"; phaseEmoji = "🌱";
    phaseDescription = "Energy is rising. Great time for new projects and workouts.";
  } else if (dayOfCycle >= ovulationDay - 1 && dayOfCycle <= ovulationDay + 1) {
    phase = "ovulation"; phaseEmoji = "✨";
    phaseDescription = "Peak energy and confidence. Most fertile days of the cycle.";
  } else {
    phase = "luteal"; phaseEmoji = "🌙";
    phaseDescription = "Slow down, prioritize sleep, and nourish with warm foods.";
  }

  const cyclesPassed = Math.max(1, Math.ceil(differenceInDays(t, start) / p.cycleLength));
  const nextStart = addDays(start, cyclesPassed * p.cycleLength);
  const nextPeriodDate = format(nextStart, "yyyy-MM-dd");
  const daysToNextPeriod = Math.max(0, differenceInDays(nextStart, t));
  const ovulationDate = format(addDays(nextStart, -14), "yyyy-MM-dd");
  const fertileWindowStart = format(addDays(parseISO(ovulationDate), -5), "yyyy-MM-dd");
  const fertileWindowEnd = format(addDays(parseISO(ovulationDate), 1), "yyyy-MM-dd");

  return {
    dayOfCycle, phase, phaseEmoji, phaseDescription,
    daysToNextPeriod, nextPeriodDate, fertileWindowStart, fertileWindowEnd, ovulationDate,
    cyclePercent: Math.round((dayOfCycle / p.cycleLength) * 100),
  };
}

export type Analytics = {
  totalLogs: number;
  streakDays: number;
  avgSleep: number | null;
  avgWater: number | null;
  topSymptoms: { name: string; count: number }[];
  moodCounts: Record<string, number>;
  moodTrend: { date: string; energy: number }[];
};

export function computeAnalytics(): Analytics {
  const logs = getLogs();
  const today = startOfDay(new Date());
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = format(addDays(today, -i), "yyyy-MM-dd");
    if (logs.some((l) => l.date === d)) streak++;
    else if (i > 0) break;
  }
  const sleeps = logs.map((l) => l.sleepHours).filter((x): x is number => typeof x === "number");
  const waters = logs.map((l) => l.waterCups).filter((x): x is number => typeof x === "number");
  const symptomMap: Record<string, number> = {};
  logs.forEach((l) => l.symptoms?.forEach((s) => (symptomMap[s] = (symptomMap[s] ?? 0) + 1)));
  const moodCounts: Record<string, number> = {};
  logs.forEach((l) => { if (l.mood) moodCounts[l.mood] = (moodCounts[l.mood] ?? 0) + 1; });
  const trend: { date: string; energy: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = format(addDays(today, -i), "yyyy-MM-dd");
    const l = logs.find((x) => x.date === d);
    trend.push({ date: d, energy: l?.energy ?? 0 });
  }
  return {
    totalLogs: logs.length,
    streakDays: streak,
    avgSleep: sleeps.length ? +(sleeps.reduce((a, b) => a + b, 0) / sleeps.length).toFixed(1) : null,
    avgWater: waters.length ? +(waters.reduce((a, b) => a + b, 0) / waters.length).toFixed(1) : null,
    topSymptoms: Object.entries(symptomMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5),
    moodCounts,
    moodTrend: trend,
  };
}

export const AFFIRMATIONS = [
  "My body is wise. It knows what it needs.",
  "I honor my cycle as a source of strength, not shame.",
  "Rest is productive. I am allowed to slow down.",
  "I am worthy of softness and care.",
  "Every phase of my cycle is a phase of my power.",
  "My feelings are valid. My experiences matter.",
  "I bloom in my own season, in my own time.",
  "I listen to my body with love and curiosity.",
  "I am rooted, radiant, and deeply alive.",
  "Today, I choose tenderness over toughness.",
];

export function affirmationOfDay(): string {
  const day = Math.floor(Date.now() / 86400000);
  return AFFIRMATIONS[day % AFFIRMATIONS.length];
}

// AI chat daily quota
const QUOTA_KEY = "sakhi:chat:quota";
export const DAILY_QUOTA = 20;
export function getQuotaUsed(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = JSON.parse(localStorage.getItem(QUOTA_KEY) ?? "{}");
    const today = format(new Date(), "yyyy-MM-dd");
    return raw.date === today ? (raw.count ?? 0) : 0;
  } catch { return 0; }
}
export function bumpQuota() {
  const today = format(new Date(), "yyyy-MM-dd");
  const used = getQuotaUsed();
  localStorage.setItem(QUOTA_KEY, JSON.stringify({ date: today, count: used + 1 }));
}
