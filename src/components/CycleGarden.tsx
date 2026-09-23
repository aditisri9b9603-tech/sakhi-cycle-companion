import { useEffect, useMemo, useState } from "react";
import type { CycleInsight } from "@/lib/cycle";
import { Sprout } from "lucide-react";

type Props = {
  totalLogs: number;
  streakDays: number;
  insight: CycleInsight | null;
};

type Stage = "seed" | "seedling" | "bud" | "bloom" | "lush";

const STAGES: { key: Stage; at: number; label: string; note: string }[] = [
  { key: "seed", at: 0, label: "Seed", note: "Log a day to wake the soil." },
  { key: "seedling", at: 2, label: "Seedling", note: "First green shoots." },
  { key: "bud", at: 6, label: "Budding", note: "Buds are forming." },
  { key: "bloom", at: 14, label: "Blooming", note: "Your garden is flowering." },
  { key: "lush", at: 28, label: "Lush", note: "Full bloom, butterflies and all." },
];

// Growth score rewards consistency (streak) alongside total logs, and the
// current cycle phase tints sky, soil, and petals.
function growthScore(totalLogs: number, streakDays: number) {
  return totalLogs + Math.min(14, streakDays) * 0.75;
}

export function CycleGarden({ totalLogs, streakDays, insight }: Props) {
  const score = growthScore(totalLogs, streakDays);
  const stageIndex = STAGES.reduce((acc, s, i) => (score >= s.at ? i : acc), 0);
  const stage = STAGES[stageIndex];
  const next = STAGES[stageIndex + 1];
  const progress = next ? Math.min(100, Math.round(((score - stage.at) / (next.at - stage.at)) * 100)) : 100;

  const plants = Math.min(12, Math.max(1, Math.round(score / 2.5) + 1));

  const phase = insight?.phase ?? "follicular";
  const palette = useMemo(() => {
    switch (phase) {
      case "menstrual":  return { sky: "#ffe4ec", sky2: "#ffd0dd", ground: "#f7c6c9", flower: "#e94b6a", leaf: "#7bb26b", sway: 7 };
      case "follicular": return { sky: "#fff3e0", sky2: "#ffe1c3", ground: "#f7d8a9", flower: "#ff8a5c", leaf: "#8fc57b", sway: 4.5 };
      case "ovulation":  return { sky: "#fff8d6", sky2: "#ffe9a8", ground: "#f7e0a5", flower: "#f6b93b", leaf: "#8fc57b", sway: 3.2 };
      case "luteal":     return { sky: "#eadcff", sky2: "#d8c4ff", ground: "#e7c9f0", flower: "#a771e0", leaf: "#7bb26b", sway: 6 };
    }
  }, [phase]);

  // Animate plants in one by one when the score changes.
  const [grown, setGrown] = useState(0);
  useEffect(() => {
    setGrown(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setGrown(i);
      if (i >= plants) clearInterval(id);
    }, 110);
    return () => clearInterval(id);
  }, [plants, stage.key]);

  const w = 640;
  const h = 220;
  const groundY = h - 60;

  const slots = Array.from({ length: plants }, (_, i) => {
    const x = 40 + (i * (w - 80)) / Math.max(1, plants - 1 || 1);
    const height = 30 + ((i * 13) % 30) + stageIndex * 4;
    return { x, height };
  });

  return (
    <div className="card-3d rounded-3xl p-5 sm:p-6 relative overflow-hidden">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-emerald-600 animate-float" />
            <h3 className="font-display text-lg sm:text-xl">Your cycle garden</h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Logging grows it, streaks grow it faster, and your {phase} phase sets the colours.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Stage</div>
          <div className="font-display text-sm sm:text-base gradient-text">{stage.label}</div>
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40 sm:h-52 rounded-2xl shadow-soft" role="img" aria-label={`A ${stage.label.toLowerCase()} garden reflecting your ${phase} phase`}>
        <defs>
          <linearGradient id="gardenSky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={palette.sky}>
              <animate attributeName="stop-color" values={`${palette.sky};${palette.sky2};${palette.sky}`} dur="12s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor={palette.sky2} />
          </linearGradient>
          <linearGradient id="gardenGround" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={palette.ground} />
            <stop offset="100%" stopColor="#e6b58c" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={w} height={h} fill="url(#gardenSky)" />

        {/* Sun with a soft pulse */}
        <circle cx={w - 60} cy="46" r="22" fill="#fff2a8" opacity="0.85" />
        <circle cx={w - 60} cy="46" r="34" fill="#fff2a8" opacity="0.28">
          <animate attributeName="r" values="34;40;34" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.28;0.14;0.28" dur="6s" repeatCount="indefinite" />
        </circle>

        {/* Drifting clouds */}
        <g opacity="0.55" fill="#ffffff">
          <g>
            <animateTransform attributeName="transform" type="translate" from="-120 0" to={`${w + 120} 0`} dur="34s" repeatCount="indefinite" />
            <ellipse cx="0" cy="40" rx="26" ry="12" />
            <ellipse cx="20" cy="44" rx="18" ry="10" />
          </g>
          <g opacity="0.7">
            <animateTransform attributeName="transform" type="translate" from="-220 0" to={`${w + 60} 0`} dur="52s" repeatCount="indefinite" />
            <ellipse cx="0" cy="72" rx="20" ry="9" />
            <ellipse cx="16" cy="75" rx="14" ry="7" />
          </g>
        </g>

        <path d={`M0 ${groundY - 20} Q ${w * 0.25} ${groundY - 55} ${w * 0.5} ${groundY - 20} T ${w} ${groundY - 20} L ${w} ${h} L 0 ${h} Z`} fill="url(#gardenGround)" />
        <rect x="0" y={groundY} width={w} height={h - groundY} fill="url(#gardenGround)" />

        {slots.map((s, i) => (
          <Plant key={i} x={s.x} groundY={groundY} height={s.height} stage={stage.key} palette={palette} index={i} visible={i < grown} />
        ))}

        {(stage.key === "bloom" || stage.key === "lush") && (
          <>
            <Butterfly x={w * 0.2} y={70} dur={9} />
            <Butterfly x={w * 0.72} y={90} dur={12} />
            {stage.key === "lush" && <Butterfly x={w * 0.45} y={58} dur={7} />}
          </>
        )}

        {/* Menstrual phase gets gentle nourishing rain */}
        {phase === "menstrual" && (
          <g opacity="0.35" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round">
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={i} x1={20 + i * 44} y1={-10} x2={14 + i * 44} y2={4}>
                <animate attributeName="y1" values="-10;170" dur={`${2 + (i % 4) * 0.4}s`} repeatCount="indefinite" />
                <animate attributeName="y2" values="4;184" dur={`${2 + (i % 4) * 0.4}s`} repeatCount="indefinite" />
              </line>
            ))}
          </g>
        )}
      </svg>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
          <span>{stage.note}</span>
          <span>{next ? `${progress}% to ${next.label}` : "Fully grown"}</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div className="h-full gradient-warm rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 text-center">
        <MiniStat label="Plants" value={`${plants}/12`} />
        <MiniStat label="Streak" value={`${streakDays}d`} />
        <MiniStat label="Total logs" value={`${totalLogs}`} />
      </div>
    </div>
  );
}

function Plant({ x, groundY, height, stage, palette, index, visible }: {
  x: number; groundY: number; height: number;
  stage: Stage;
  palette: { flower: string; leaf: string; sway: number };
  index: number;
  visible: boolean;
}) {
  const topY = groundY - height;
  const size = stage === "seed" ? 0 : stage === "seedling" ? 5 : stage === "bud" ? 7 : stage === "bloom" ? 10 : 12;
  const showFlower = stage === "bloom" || stage === "lush";
  const showBud = stage === "bud";
  const doubleFlower = stage === "lush";
  const sway = palette.sway;
  const dur = 4 + (index % 5) * 0.6;

  return (
    <g style={{ opacity: visible ? 1 : 0, transition: "opacity 500ms ease-out" }}>
      <g style={{ transformOrigin: `${x}px ${groundY}px`, transform: visible ? "scaleY(1)" : "scaleY(0.05)", transition: "transform 700ms cubic-bezier(.22,1,.36,1)" }}>
        <g>
          <animateTransform attributeName="transform" type="rotate" values={`-${sway} ${x} ${groundY}; ${sway} ${x} ${groundY}; -${sway} ${x} ${groundY}`} dur={`${dur}s`} repeatCount="indefinite" />
          <line x1={x} y1={groundY} x2={x} y2={topY} stroke={palette.leaf} strokeWidth={2.5} strokeLinecap="round" />
          <ellipse cx={x - 6} cy={topY + height * 0.55} rx={6} ry={3} fill={palette.leaf} transform={`rotate(-30 ${x - 6} ${topY + height * 0.55})`} />
          <ellipse cx={x + 6} cy={topY + height * 0.35} rx={6} ry={3} fill={palette.leaf} transform={`rotate(30 ${x + 6} ${topY + height * 0.35})`} />

          {showFlower && (
            <g transform={`translate(${x} ${topY})`}>
              <g>
                <animateTransform attributeName="transform" type="scale" values="0.94;1.06;0.94" dur={`${dur + 1}s`} repeatCount="indefinite" additive="sum" />
                {Array.from({ length: 6 }).map((_, i) => {
                  const angle = (i * 360) / 6;
                  return <circle key={i} cx={Math.cos((angle * Math.PI) / 180) * size} cy={Math.sin((angle * Math.PI) / 180) * size} r={size * 0.75} fill={palette.flower} opacity="0.9" />;
                })}
                <circle cx={0} cy={0} r={size * 0.55} fill="#fff8d6" />
                {doubleFlower && (
                  <g opacity="0.7">
                    {Array.from({ length: 6 }).map((_, i) => {
                      const angle = (i * 360) / 6 + 30;
                      return <circle key={i} cx={Math.cos((angle * Math.PI) / 180) * (size * 0.6)} cy={Math.sin((angle * Math.PI) / 180) * (size * 0.6)} r={size * 0.5} fill={palette.flower} />;
                    })}
                  </g>
                )}
              </g>
            </g>
          )}

          {showBud && (
            <g transform={`translate(${x} ${topY})`}>
              <ellipse cx={0} cy={-2} rx={size * 0.55} ry={size * 0.85} fill={palette.flower} opacity="0.8" />
              <ellipse cx={0} cy={2} rx={size * 0.7} ry={size * 0.5} fill={palette.leaf} />
            </g>
          )}

          {(stage === "seedling" || stage === "seed") && (
            <g transform={`translate(${x} ${topY})`}>
              <ellipse cx={-3} cy={0} rx={4} ry={2} fill={palette.leaf} transform="rotate(-45)" />
              <ellipse cx={3} cy={0} rx={4} ry={2} fill={palette.leaf} transform="rotate(45)" />
            </g>
          )}
        </g>
      </g>
      <path d={`M ${x - 4} ${groundY} q 4 -6 4 0 M ${x + 4} ${groundY} q -4 -6 -4 0`} stroke={palette.leaf} strokeWidth={1} fill="none" opacity={0.7 + (index % 3) * 0.1} />
    </g>
  );
}

function Butterfly({ x, y, dur }: { x: number; y: number; dur: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <animateTransform attributeName="transform" type="translate"
        values={`${x} ${y}; ${x + 40} ${y - 18}; ${x - 20} ${y + 14}; ${x} ${y}`} dur={`${dur}s`} repeatCount="indefinite" />
      <g>
        <animateTransform attributeName="transform" type="scale" values="1 1; 0.4 1; 1 1" dur="0.5s" repeatCount="indefinite" additive="sum" />
        <ellipse cx={-5} cy={0} rx={5} ry={3.5} fill="#ff8fb1" opacity="0.85" />
        <ellipse cx={5} cy={0} rx={5} ry={3.5} fill="#ff8fb1" opacity="0.85" />
      </g>
      <circle cx={0} cy={0} r={1.4} fill="#333" />
    </g>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-base sm:text-lg gradient-text">{value}</div>
    </div>
  );
}
