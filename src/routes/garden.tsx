import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useMemo } from "react";
import { getLogs } from "@/lib/cycle";
import { Flower2, Trophy, Sparkles } from "lucide-react";

export const Route = createFileRoute("/garden")({
  head: () => ({ meta: [{ title: "Mood Garden — Sakhi Cycle" }, { name: "description", content: "Your self-care garden. Every log grows a flower." }] }),
  component: GardenPage,
});

const MOOD_COLORS: Record<string, string> = {
  joyful: "oklch(0.85 0.15 60)",
  hopeful: "oklch(0.82 0.13 150)",
  calm: "oklch(0.85 0.1 220)",
  tired: "oklch(0.78 0.06 280)",
  sad: "oklch(0.72 0.08 250)",
  tense: "oklch(0.7 0.15 20)",
  angry: "oklch(0.62 0.2 25)",
};

function GardenPage() {
  const logs = getLogs();
  const flowers = useMemo(() => logs.slice(-60), [logs]);
  const streak = useMemo(() => {
    const dates = new Set(logs.map((l) => l.date));
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      if (dates.has(d.toISOString().slice(0, 10))) s++; else break;
    }
    return s;
  }, [logs]);

  const badges = [
    { unlocked: logs.length >= 1, label: "First Bloom", icon: "🌱" },
    { unlocked: logs.length >= 7, label: "Week of Care", icon: "🌸" },
    { unlocked: streak >= 7, label: "7-day Streak", icon: "🔥" },
    { unlocked: logs.length >= 30, label: "Wellness Tree", icon: "🌳" },
    { unlocked: logs.length >= 60, label: "Rare Lotus", icon: "🪷" },
    { unlocked: streak >= 21, label: "Garden Keeper", icon: "🦋" },
  ];

  return (
    <AppShell>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-display mb-2">Your <span className="gradient-text">Mood Garden</span></h1>
      <p className="text-muted-foreground mb-6 text-sm sm:text-base">Every log plants a flower. Consistency grows a forest.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Flowers" value={`${logs.length}`} />
        <Stat label="Streak" value={`${streak} days`} />
        <Stat label="Badges" value={`${badges.filter(b => b.unlocked).length}/${badges.length}`} />
        <Stat label="Rare plants" value={logs.length >= 60 ? "🪷" : "—"} />
      </div>

      <section className="card-3d rounded-3xl p-5 sm:p-8 mb-6 relative overflow-hidden min-h-[280px]">
        <div className="absolute inset-x-0 bottom-0 h-20" style={{ background: "linear-gradient(to top, oklch(0.85 0.08 140 / 0.5), transparent)" }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="firefly" style={{ left: `${(i * 37) % 100}%`, top: `${20 + (i * 19) % 60}%`, animationDelay: `${i * 0.7}s` }} />
        ))}
        {flowers.length === 0 ? (
          <div className="text-center py-10">
            <Flower2 className="h-12 w-12 mx-auto mb-3 text-primary animate-breathe" />
            <p className="text-muted-foreground">Log your first day in <strong>Cycle</strong> to plant a flower.</p>
          </div>
        ) : (
          <div className="relative grid grid-cols-8 sm:grid-cols-12 gap-3">
            {flowers.map((l, i) => {
              const color = MOOD_COLORS[l.mood ?? "calm"] ?? MOOD_COLORS.calm;
              return (
                <div key={l.date + i} title={`${l.date} · ${l.mood ?? "calm"}`}
                  className="aspect-square rounded-full animate-breathe shadow-soft"
                  style={{ background: `radial-gradient(circle at 30% 30%, white, ${color})`, animationDelay: `${(i % 8) * 0.2}s` }} />
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl mb-3 flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" /> Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map((b) => (
            <div key={b.label} className={`card-3d rounded-2xl p-4 text-center transition ${b.unlocked ? "" : "opacity-50 grayscale"}`}>
              <div className="text-3xl mb-1">{b.icon}</div>
              <div className="font-display text-sm">{b.label}</div>
              {b.unlocked && <Sparkles className="h-3.5 w-3.5 mx-auto mt-1 text-primary" />}
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-3 text-center">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-lg gradient-text">{value}</div>
    </div>
  );
}
