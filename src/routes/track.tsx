import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { computeInsights, getLogs, getProfile, saveLog, saveProfile, type CycleProfile, type LogEntry } from "@/lib/cycle";
import { format } from "date-fns";
import { Save, Sparkles } from "lucide-react";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Cycle Tracker — Sakhi Cycle" }, { name: "description", content: "Set up your cycle and log mood, flow, and symptoms." }] }),
  component: TrackPage,
});

const MOODS = ["happy", "calm", "sad", "anxious", "irritable", "energetic"] as const;
const FLOWS = ["spotting", "light", "medium", "heavy"] as const;
const SYMPTOMS = ["cramps", "headache", "bloating", "fatigue", "acne", "tender breasts", "back pain", "cravings"];

function TrackPage() {
  const [profile, setProfile] = useState<CycleProfile | null>(null);
  const [draft, setDraft] = useState<CycleProfile>({ nickname: "", lastPeriodStart: format(new Date(), "yyyy-MM-dd"), cycleLength: 28, periodLength: 5, city: "" });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const today = format(new Date(), "yyyy-MM-dd");
  const todayLog = logs.find((l) => l.date === today) ?? { date: today, symptoms: [] as string[] };
  const [log, setLog] = useState<LogEntry>(todayLog);

  useEffect(() => {
    const p = getProfile();
    if (p) { setProfile(p); setDraft(p); }
    const l = getLogs();
    setLogs(l);
    const t = l.find((x) => x.date === today);
    if (t) setLog(t);
  }, [today]);

  const insight = profile ? computeInsights(profile) : null;

  function handleSaveProfile() {
    saveProfile(draft);
    setProfile(draft);
  }
  function handleSaveLog() {
    saveLog(log);
    setLogs(getLogs());
  }
  function toggleSymptom(s: string) {
    const list = log.symptoms ?? [];
    setLog({ ...log, symptoms: list.includes(s) ? list.filter((x) => x !== s) : [...list, s] });
  }

  return (
    <AppShell>
      <h1 className="text-3xl md:text-4xl font-display mb-2">Your <span className="gradient-text">cycle</span></h1>
      <p className="text-muted-foreground mb-6">Set your cycle once, then log how you feel each day. All data stays on your device.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-xl mb-4">{profile ? "Update your cycle" : "Set up your cycle"}</h2>
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
            <button onClick={handleSaveProfile} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-warm text-white font-semibold shadow-soft">
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-xl mb-1">How are you today?</h2>
          <p className="text-xs text-muted-foreground mb-4">{format(new Date(), "EEEE, MMM d")}</p>

          <div className="mb-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Mood</div>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button key={m} onClick={() => setLog({ ...log, mood: m })}
                  className={`px-3 py-1.5 rounded-full text-sm capitalize transition ${log.mood === m ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-accent"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Flow</div>
            <div className="flex flex-wrap gap-2">
              {FLOWS.map((f) => (
                <button key={f} onClick={() => setLog({ ...log, flow: f })}
                  className={`px-3 py-1.5 rounded-full text-sm capitalize transition ${log.flow === f ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-accent"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Symptoms</div>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map((s) => (
                <button key={s} onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${log.symptoms?.includes(s) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-accent"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Field label="Notes">
            <textarea value={log.notes ?? ""} onChange={(e) => setLog({ ...log, notes: e.target.value })} rows={3} className="inp resize-none" placeholder="A line for future-you…" />
          </Field>

          <button onClick={handleSaveLog} className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-warm text-white font-semibold shadow-soft">
            <Save className="h-4 w-4" /> Save today
          </button>
        </div>
      </div>

      {insight && (
        <div className="mt-6 glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3"><Sparkles className="h-5 w-5 text-primary" /><h2 className="font-display text-xl">Insights</h2></div>
          <div className="grid sm:grid-cols-4 gap-4 text-center">
            <Stat label="Day" value={`${insight.dayOfCycle}`} />
            <Stat label="Phase" value={`${insight.phaseEmoji} ${insight.phase}`} />
            <Stat label="Next period" value={`${insight.daysToNextPeriod}d`} />
            <Stat label="Ovulation" value={insight.ovulationDate.slice(5)} />
          </div>
          <p className="text-sm text-muted-foreground mt-4">{insight.phaseDescription}</p>
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-6 glass rounded-2xl p-6">
          <h2 className="font-display text-xl mb-3">Recent log</h2>
          <div className="space-y-2 max-h-72 overflow-auto">
            {logs.slice(0, 14).map((l) => (
              <div key={l.date} className="flex flex-wrap items-center gap-2 text-sm py-2 border-b border-border/40 last:border-0">
                <div className="font-mono text-xs w-24">{l.date}</div>
                {l.mood && <span className="px-2 py-0.5 rounded-full bg-accent/40 text-xs">{l.mood}</span>}
                {l.flow && <span className="px-2 py-0.5 rounded-full bg-primary/15 text-xs">{l.flow}</span>}
                {l.symptoms?.map((s) => <span key={s} className="px-2 py-0.5 rounded-full bg-secondary text-xs">{s}</span>)}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`.inp{width:100%;padding:.6rem .9rem;border-radius:.75rem;background:oklch(1 0 0 / 0.6);border:1px solid var(--border);font-size:.9rem;outline:none}.inp:focus{box-shadow:0 0 0 3px oklch(0.62 0.16 15 / 0.25)}`}</style>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>{children}</label>;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div className="glass rounded-xl p-3"><div className="text-xs text-muted-foreground uppercase">{label}</div><div className="font-display text-xl gradient-text capitalize">{value}</div></div>;
}
