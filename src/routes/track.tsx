import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useMemo, useState } from "react";
import { computeAnalytics, computeInsights, deleteLog, exportAll, getLogs, getProfile, importAll, saveLog, saveProfile, type CycleProfile, type LogEntry } from "@/lib/cycle";
import { format, addDays, parseISO, startOfDay, differenceInDays } from "date-fns";
import { Save, Sparkles, Download, Upload, Trash2, Flame, Droplet, Moon, Activity, Flower2, Trophy } from "lucide-react";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Cycle Tracker — Sakhi Cycle" }, { name: "description", content: "Set up your cycle and log mood, flow, and symptoms with smart insights." }] }),
  component: TrackPage,
});

const MOODS = ["happy", "calm", "sad", "anxious", "irritable", "energetic"] as const;
const FLOWS = ["spotting", "light", "medium", "heavy"] as const;
const SYMPTOMS = ["cramps", "headache", "bloating", "fatigue", "acne", "tender breasts", "back pain", "cravings", "nausea", "dizziness", "insomnia"];

function TrackPage() {
  const [profile, setProfile] = useState<CycleProfile | null>(null);
  const [draft, setDraft] = useState<CycleProfile>({ nickname: "", lastPeriodStart: format(new Date(), "yyyy-MM-dd"), cycleLength: 28, periodLength: 5, city: "" });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [log, setLog] = useState<LogEntry>({ date: selectedDate, symptoms: [] });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (p) { setProfile(p); setDraft(p); }
    setLogs(getLogs());
  }, []);

  useEffect(() => {
    const existing = logs.find((l) => l.date === selectedDate);
    setLog(existing ?? { date: selectedDate, symptoms: [] });
  }, [selectedDate, logs]);

  const insight = profile ? computeInsights(profile) : null;
  const analytics = useMemo(() => computeAnalytics(), [logs]);

  function handleSaveProfile() {
    saveProfile(draft);
    setProfile(draft);
    flash("Cycle saved 🌷");
  }
  function handleSaveLog() {
    saveLog(log);
    setLogs(getLogs());
    flash("Log saved ✨");
  }
  function toggleSymptom(s: string) {
    const list = log.symptoms ?? [];
    setLog({ ...log, symptoms: list.includes(s) ? list.filter((x) => x !== s) : [...list, s] });
  }
  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }
  function handleExport() {
    const data = exportAll();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `sakhi-backup-${format(new Date(), "yyyy-MM-dd")}.json`; a.click();
    URL.revokeObjectURL(url);
  }
  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importAll(String(reader.result));
      flash(res.msg);
      if (res.ok) { const p = getProfile(); if (p) { setProfile(p); setDraft(p); } setLogs(getLogs()); }
    };
    reader.readAsText(file);
  }
  function handleDelete() {
    if (!confirm(`Delete log for ${selectedDate}?`)) return;
    deleteLog(selectedDate);
    setLogs(getLogs());
    flash("Log deleted");
  }

  return (
    <AppShell>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-display mb-2">Your <span className="gradient-text">cycle</span></h1>
      <p className="text-muted-foreground mb-6 text-sm sm:text-base">Set your cycle once, then log how you feel each day. All data stays on your device.</p>

      {insight && (
        <div className="card-3d rounded-3xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3"><Sparkles className="h-5 w-5 text-primary" /><h2 className="font-display text-lg sm:text-xl">Today's insights</h2></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Day" value={`${insight.dayOfCycle}/${profile!.cycleLength}`} />
            <Stat label="Phase" value={`${insight.phaseEmoji} ${insight.phase}`} />
            <Stat label="Next period" value={`${insight.daysToNextPeriod}d`} />
            <Stat label="Ovulation" value={insight.ovulationDate.slice(5)} />
          </div>
          <p className="text-sm text-muted-foreground mt-4">{insight.phaseDescription}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <div className="card-3d rounded-3xl p-5 sm:p-6">
          <h2 className="font-display text-lg sm:text-xl mb-4">{profile ? "Update your cycle" : "Set up your cycle"}</h2>
          <div className="space-y-4">
            <Field label="Nickname (just for you)">
              <input value={draft.nickname} onChange={(e) => setDraft({ ...draft, nickname: e.target.value })} placeholder="e.g. Sakhi" className="inp" />
            </Field>
            <Field label="First day of your last period">
              <input type="date" value={draft.lastPeriodStart} onChange={(e) => setDraft({ ...draft, lastPeriodStart: e.target.value })} className="inp" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={`Cycle length: ${draft.cycleLength} days`}>
                <input type="range" min={21} max={40} value={draft.cycleLength} onChange={(e) => setDraft({ ...draft, cycleLength: +e.target.value })} className="w-full accent-primary" />
              </Field>
              <Field label={`Period length: ${draft.periodLength} days`}>
                <input type="range" min={2} max={10} value={draft.periodLength} onChange={(e) => setDraft({ ...draft, periodLength: +e.target.value })} className="w-full accent-primary" />
              </Field>
            </div>
            <Field label="Your city (for nearby gynaec list)">
              <input value={draft.city ?? ""} onChange={(e) => setDraft({ ...draft, city: e.target.value })} placeholder="e.g. Mumbai" className="inp" />
            </Field>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleSaveProfile} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-warm text-white font-semibold shadow-soft btn-3d">
                <Save className="h-4 w-4" /> Save cycle
              </button>
              <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full glass text-sm font-semibold">
                <Download className="h-4 w-4" /> Export
              </button>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full glass text-sm font-semibold cursor-pointer">
                <Upload className="h-4 w-4" /> Import
                <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
              </label>
            </div>
          </div>
        </div>

        <div className="card-3d rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="font-display text-lg sm:text-xl">Daily log</h2>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} max={format(new Date(), "yyyy-MM-dd")} className="inp w-auto" />
          </div>

          <Section title="Mood">
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <Pill key={m} active={log.mood === m} onClick={() => setLog({ ...log, mood: m })}>{m}</Pill>
              ))}
            </div>
          </Section>

          <Section title={`Energy: ${log.energy ?? "—"}/5`}>
            <input type="range" min={1} max={5} value={log.energy ?? 3} onChange={(e) => setLog({ ...log, energy: +e.target.value as LogEntry["energy"] })} className="w-full accent-primary" />
          </Section>

          <Section title="Flow">
            <div className="flex flex-wrap gap-2">
              {FLOWS.map((f) => (
                <Pill key={f} active={log.flow === f} onClick={() => setLog({ ...log, flow: f })}>{f}</Pill>
              ))}
              {log.flow && <button onClick={() => setLog({ ...log, flow: undefined })} className="text-xs text-muted-foreground hover:text-primary">clear</button>}
            </div>
          </Section>

          <Section title="Symptoms">
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map((s) => (
                <Pill key={s} active={log.symptoms?.includes(s)} onClick={() => toggleSymptom(s)}>{s}</Pill>
              ))}
            </div>
          </Section>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <Field label="Sleep (hrs)">
              <input type="number" min={0} max={14} step={0.5} value={log.sleepHours ?? ""} onChange={(e) => setLog({ ...log, sleepHours: e.target.value ? +e.target.value : undefined })} className="inp" />
            </Field>
            <Field label="Water (cups)">
              <input type="number" min={0} max={20} value={log.waterCups ?? ""} onChange={(e) => setLog({ ...log, waterCups: e.target.value ? +e.target.value : undefined })} className="inp" />
            </Field>
          </div>

          <Field label="Notes">
            <textarea value={log.notes ?? ""} onChange={(e) => setLog({ ...log, notes: e.target.value })} rows={3} className="inp resize-none" placeholder="A line for future-you…" />
          </Field>

          <div className="flex gap-2 mt-2">
            <button onClick={handleSaveLog} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-warm text-white font-semibold shadow-soft btn-3d">
              <Save className="h-4 w-4" /> Save log
            </button>
            {logs.some((l) => l.date === selectedDate) && (
              <button onClick={handleDelete} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <KPI icon={Flame} label="Streak" value={`${analytics.streakDays}d`} />
        <KPI icon={Activity} label="Total logs" value={`${analytics.totalLogs}`} />
        <KPI icon={Moon} label="Avg sleep" value={analytics.avgSleep ? `${analytics.avgSleep}h` : "—"} />
        <KPI icon={Droplet} label="Avg water" value={analytics.avgWater ? `${analytics.avgWater}c` : "—"} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6 mt-6">
        <Heatmap logs={logs} onPick={setSelectedDate} profile={profile} />
        <div className="card-3d rounded-3xl p-5">
          <h3 className="font-display text-lg mb-3">30-day energy trend</h3>
          <Sparkline data={analytics.moodTrend.map((t) => t.energy)} />
          <h4 className="font-display text-sm mt-5 mb-2">Most common symptoms</h4>
          {analytics.topSymptoms.length === 0 ? (
            <p className="text-xs text-muted-foreground">Log a few days to see patterns.</p>
          ) : (
            <ul className="space-y-1.5">
              {analytics.topSymptoms.map((s) => (
                <li key={s.name} className="flex items-center gap-2 text-sm">
                  <span className="capitalize w-28">{s.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full gradient-warm" style={{ width: `${(s.count / analytics.topSymptoms[0].count) * 100}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-6 text-right">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Garden logs={logs} />

      {toast && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full gradient-warm text-white text-sm shadow-glow">{toast}</div>
      )}

      <style>{`.inp{width:100%;padding:.6rem .9rem;border-radius:.75rem;background:oklch(1 0 0 / 0.6);border:1px solid var(--border);font-size:.9rem;outline:none}.inp:focus{box-shadow:0 0 0 3px oklch(0.62 0.16 15 / 0.25)}`}</style>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>{children}</label>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mb-3"><div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{title}</div>{children}</div>;
}
function Pill({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`px-3 py-1.5 rounded-full text-sm capitalize transition ${active ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary text-foreground/70 hover:bg-accent"}`}>{children}</button>;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div className="glass rounded-xl p-3"><div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div><div className="font-display text-lg sm:text-xl gradient-text capitalize truncate">{value}</div></div>;
}
function KPI({ icon: Icon, label, value }: { icon: typeof Flame; label: string; value: string }) {
  return (
    <div className="card-3d rounded-2xl p-4 flex items-center gap-3">
      <div className="h-10 w-10 shrink-0 rounded-xl gradient-warm flex items-center justify-center text-white shadow-soft"><Icon className="h-5 w-5" /></div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-display text-xl truncate">{value}</div>
      </div>
    </div>
  );
}

function Heatmap({ logs, onPick, profile }: { logs: LogEntry[]; onPick: (d: string) => void; profile: CycleProfile | null }) {
  const today = startOfDay(new Date());
  const days = Array.from({ length: 90 }, (_, i) => format(addDays(today, -(89 - i)), "yyyy-MM-dd"));
  const start = profile ? parseISO(profile.lastPeriodStart) : null;

  function intensity(d: string): number {
    const l = logs.find((x) => x.date === d);
    if (!l) return 0;
    const flowScore = l.flow === "heavy" ? 4 : l.flow === "medium" ? 3 : l.flow === "light" ? 2 : l.flow === "spotting" ? 1 : 0;
    const symScore = Math.min(4, l.symptoms?.length ?? 0);
    return Math.max(flowScore, symScore);
  }
  function isPredictedPeriod(d: string): boolean {
    if (!profile || !start) return false;
    const day = differenceInDays(parseISO(d), start);
    if (day < 0) return false;
    const cycleDay = ((day % profile.cycleLength) + profile.cycleLength) % profile.cycleLength + 1;
    return cycleDay <= profile.periodLength;
  }

  return (
    <div className="card-3d rounded-3xl p-5">
      <h3 className="font-display text-lg mb-1">90-day overview</h3>
      <p className="text-xs text-muted-foreground mb-3">Darker = stronger flow or more symptoms. Tap any day to edit.</p>
      <div className="grid grid-cols-[repeat(15,_minmax(0,1fr))] sm:grid-cols-[repeat(15,_minmax(0,1fr))] md:grid-cols-[repeat(15,_minmax(0,1fr))] gap-1.5">
        {days.map((d) => {
          const i = intensity(d);
          const pred = isPredictedPeriod(d);
          const bg = i === 0
            ? (pred ? "oklch(0.92 0.06 15 / 0.5)" : "oklch(0.95 0.02 40 / 0.6)")
            : `oklch(${0.85 - i * 0.08} ${0.08 + i * 0.04} 15)`;
          return (
            <button key={d} onClick={() => onPick(d)} title={`${d}${i ? ` · intensity ${i}` : ""}`}
              className="aspect-square rounded-md hover:ring-2 ring-primary/40 transition" style={{ background: bg }} />
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-3">
        <span>{days[0]}</span>
        <div className="flex items-center gap-1">
          <span>less</span>
          {[0, 1, 2, 3, 4].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-sm" style={{ background: i === 0 ? "oklch(0.95 0.02 40 / 0.6)" : `oklch(${0.85 - i * 0.08} ${0.08 + i * 0.04} 15)` }} />)}
          <span>more</span>
        </div>
        <span>today</span>
      </div>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const w = 320, h = 60;
  const max = 5;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <defs>
        <linearGradient id="sparkGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.18 10)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="oklch(0.72 0.18 10)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill="url(#sparkGrad)" />
      <polyline points={pts} fill="none" stroke="oklch(0.62 0.18 15)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const MOOD_COLORS: Record<string, string> = {
  happy: "oklch(0.85 0.15 60)", calm: "oklch(0.85 0.1 220)", energetic: "oklch(0.82 0.13 150)",
  sad: "oklch(0.72 0.08 250)", anxious: "oklch(0.78 0.06 280)", irritable: "oklch(0.7 0.15 20)",
};

function Garden({ logs }: { logs: LogEntry[] }) {
  const flowers = logs.slice(0, 60);
  const dates = new Set(logs.map((l) => l.date));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    if (dates.has(d.toISOString().slice(0, 10))) streak++; else break;
  }
  const badges = [
    { unlocked: logs.length >= 1, label: "First Bloom", icon: "🌱" },
    { unlocked: logs.length >= 7, label: "Week of Care", icon: "🌸" },
    { unlocked: streak >= 7, label: "7-day Streak", icon: "🔥" },
    { unlocked: logs.length >= 30, label: "Wellness Tree", icon: "🌳" },
    { unlocked: logs.length >= 60, label: "Rare Lotus", icon: "🪷" },
    { unlocked: streak >= 21, label: "Garden Keeper", icon: "🦋" },
  ];
  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Flower2 className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl sm:text-2xl">Your <span className="gradient-text">Mood Garden</span></h2>
      </div>
      <p className="text-muted-foreground text-sm mb-4">Every log plants a flower. Consistency grows a garden.</p>
      <div className="card-3d rounded-3xl p-5 sm:p-7 relative overflow-hidden min-h-[200px] mb-4">
        <div className="absolute inset-x-0 bottom-0 h-20" style={{ background: "linear-gradient(to top, oklch(0.85 0.08 140 / 0.5), transparent)" }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="firefly" style={{ left: `${(i * 37) % 100}%`, top: `${20 + (i * 19) % 60}%`, animationDelay: `${i * 0.7}s` }} />
        ))}
        {flowers.length === 0 ? (
          <div className="text-center py-8">
            <Flower2 className="h-10 w-10 mx-auto mb-2 text-primary animate-breathe" />
            <p className="text-muted-foreground text-sm">Save your first daily log to plant a flower.</p>
          </div>
        ) : (
          <div className="relative grid grid-cols-8 sm:grid-cols-12 gap-2.5">
            {flowers.map((l, i) => {
              const color = MOOD_COLORS[l.mood ?? "calm"] ?? MOOD_COLORS.calm;
              return <div key={l.date + i} title={`${l.date} · ${l.mood ?? "calm"}`}
                className="aspect-square rounded-full animate-breathe shadow-soft"
                style={{ background: `radial-gradient(circle at 30% 30%, white, ${color})`, animationDelay: `${(i % 8) * 0.2}s` }} />;
            })}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="h-4 w-4 text-primary" />
        <h3 className="font-display text-base">Achievements</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {badges.map((b) => (
          <div key={b.label} className={`card-3d rounded-2xl p-3 text-center transition ${b.unlocked ? "" : "opacity-40 grayscale"}`}>
            <div className="text-2xl mb-1">{b.icon}</div>
            <div className="text-xs font-display">{b.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
