import type { CycleInsight } from "@/lib/cycle";

export function CycleRing({ insight, size = 220 }: { insight: CycleInsight; size?: number }) {
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  const offset = c - (insight.cyclePercent / 100) * c;
  const color = {
    menstrual: "oklch(0.65 0.2 15)",
    follicular: "oklch(0.78 0.15 130)",
    ovulation: "oklch(0.78 0.16 60)",
    luteal: "oklch(0.7 0.16 320)",
  }[insight.phase];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full gradient-warm blur-2xl opacity-40 animate-breathe" />
      <svg width={size} height={size} className="-rotate-90 relative">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.18 350)" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(0.92 0.04 30 / 0.6)" strokeWidth="10" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="url(#ringGrad)" strokeWidth="10" fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 800ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-4xl mb-1">{insight.phaseEmoji}</div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Day</div>
        <div className="font-display text-4xl gradient-text leading-none">{insight.dayOfCycle}</div>
        <div className="text-[11px] text-muted-foreground mt-1 capitalize">{insight.phase} phase</div>
      </div>
    </div>
  );
}
