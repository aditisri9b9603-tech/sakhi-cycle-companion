import { addDays, differenceInDays, format, parseISO, startOfDay } from "date-fns";

export type CycleProfile = {
  nickname: string;
  lastPeriodStart: string; // ISO date
  cycleLength: number; // default 28
  periodLength: number; // default 5
  city?: string;
};

export type LogEntry = {
  date: string;
  mood?: "happy" | "calm" | "sad" | "anxious" | "irritable" | "energetic";
  flow?: "spotting" | "light" | "medium" | "heavy";
  symptoms?: string[];
  notes?: string;
};

const PROFILE_KEY = "sakhi:profile";
const LOG_KEY = "sakhi:log";

export function getProfile(): CycleProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as CycleProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: CycleProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function getLogs(): LogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? (JSON.parse(raw) as LogEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveLog(entry: LogEntry) {
  const logs = getLogs().filter((l) => l.date !== entry.date);
  logs.push(entry);
  logs.sort((a, b) => (a.date < b.date ? 1 : -1));
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
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
    phase = "menstrual";
    phaseEmoji = "🌹";
    phaseDescription = "Rest, hydrate, and be gentle with yourself. Iron-rich foods help.";
  } else if (dayOfCycle < ovulationDay - 1) {
    phase = "follicular";
    phaseEmoji = "🌱";
    phaseDescription = "Energy is rising. Great time for new projects and workouts.";
  } else if (dayOfCycle >= ovulationDay - 1 && dayOfCycle <= ovulationDay + 1) {
    phase = "ovulation";
    phaseEmoji = "✨";
    phaseDescription = "Peak energy and confidence. Most fertile days of the cycle.";
  } else {
    phase = "luteal";
    phaseEmoji = "🌙";
    phaseDescription = "Slow down, prioritize sleep, and nourish with warm foods.";
  }

  const nextStart = addDays(start, Math.ceil(differenceInDays(t, start) / p.cycleLength) * p.cycleLength || p.cycleLength);
  const nextPeriodDate = format(nextStart, "yyyy-MM-dd");
  const daysToNextPeriod = differenceInDays(nextStart, t);
  const ovulationDate = format(addDays(nextStart, -14), "yyyy-MM-dd");
  const fertileWindowStart = format(addDays(parseISO(ovulationDate), -5), "yyyy-MM-dd");
  const fertileWindowEnd = format(addDays(parseISO(ovulationDate), 1), "yyyy-MM-dd");

  return {
    dayOfCycle,
    phase,
    phaseEmoji,
    phaseDescription,
    daysToNextPeriod,
    nextPeriodDate,
    fertileWindowStart,
    fertileWindowEnd,
    ovulationDate,
    cyclePercent: Math.round((dayOfCycle / p.cycleLength) * 100),
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
