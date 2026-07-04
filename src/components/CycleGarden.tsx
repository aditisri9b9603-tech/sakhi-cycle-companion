import { useMemo } from "react";
import type { CycleInsight } from "@/lib/cycle";
import { Sprout } from "lucide-react";

type Props = {
  totalLogs: number;
  streakDays: number;
  insight: CycleInsight | null;
};

// A soft SVG "garden" that grows as the user logs.
// - 1 sprout unlocked per 2 logs (up to 12 plants).
// - Blooms open once total logs ≥ 6; deeper bloom past 20.
// - Ground/sky tint follows the current phase for gentle continuity with the app.
export function CycleGarden({ totalLogs, streakDays, insight }: Props) {
  const plants = Math.min(12, Math.max(1, Math.floor(totalLogs / 2) + 1));
  const stage: "seedling" | "bud" | "bloom" | "lush" =
    totalLogs >= 20 ? "lush" : totalLogs >= 10 ? "bloom" : totalLogs >= 4 ? "bud" : "seedling";

  const phase = insight?.phase ?? "follicular";
  const palette = useMemo(() => {
    switch (phase) {
      case "menstrual":  return { sky: "#ffe4ec", sky2: "#ffd0dd", ground: "#f7c6c9", flower: "#e94b6a", leaf: "#7bb26b" };
      case "follicular": return { sky: "#fff3e0", sky2: "#ffe1c3", ground: "#f7d8a9", flower: "#ff8a5c", leaf: "#8fc57b" };
      case "ovulation":  return { sky: "#fff8d6", sky2: "#ffe9a8", ground: "#f7e0a5", flower: "#f6b93b", leaf: "#8fc57b" };
      case "luteal":     return { sky: "#eadcff", sky2: "#d8c4ff", ground: "#e7c9f0", flower: "#a771e0", leaf: "#7bb26b" };
    }
  }, [phase]);

  const w = 640;
  const h = 220;
  const groundY = h - 60;

  const slots = Array.from({ length: plants }, (_, i) => {
    const x = 40 + (i * (w - 80)) / Math.max(1, plants - 1 || 1);
    const height = 30 + ((i * 13) % 30);
    return { x, height };
  });

  return (
    <div className="card-3d rounded-3xl p-5 sm:p-6 relative overflow-hidden">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-emerald-600" />
            <h3 className="font-display text-lg sm:text-xl">Your cycle garden</h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Every day you log, another plant sprouts. Keep tending — she blooms with you.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Stage</div>
          <div className="font-display text-sm sm:text-base capitalize gradient-text">{stage}</div>
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40 sm:h-52 rounded-2xl shadow-soft" role="img" aria-label="A softly growing garden">
        <defs>
          <linearGradient id="gardenSky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={palette.sky} />
            <stop offset="100%" stopColor={palette.sky2} />
          </linearGradient>
          <linearGradient id="gardenGround" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={palette.ground} />
            <stop offset="100%" stopColor="#e6b58c" />
          </linearGradient>
        </defs>
        {/* Sky */}
        <rect x="0" y="0" width={w} height={h} fill="url(#gardenSky)" />
        {/* Sun */}
        <circle cx={w - 60} cy="46" r="22" fill="#fff2a8" opacity="0.85" />
        <circle cx={w - 60} cy="46" r="34" fill="#fff2a8" opacity="0.28" />
        {/* Rolling hills */}
        <path d={`M0 ${groundY - 20} Q ${w * 0.25} ${groundY - 55} ${w * 0.5} ${groundY - 20} T ${w} ${groundY - 20} L ${w} ${h} L 0 ${h} Z`} fill="url(#gardenGround)" />
        {/* Ground */}
        <rect x="0" y={groundY} width={w} height={h - groundY} fill="url(#gardenGround)" />

        {/* Plants */}
        {slots.map((s, i) => (
          <Plant key={i} x={s.x} groundY={groundY} height={s.height} stage={stage} palette={palette} index={i} />
        ))}

        {/* Butterflies once blooming */}
        {stage !== "seedling" && stage !== "bud" && (
          <>
            <Butterfly x={w * 0.2} y={70} />
            <Butterfly x={w * 0.72} y={90} />
          </>
        )}
      </svg>

      <div className="grid grid-cols-3 gap-3 mt-4 text-center">
        <MiniStat label="Plants" value={`${plants}/12`} />
        <MiniStat label="Streak" value={`${streakDays}d`} />
        <MiniStat label="Total logs" value={`${totalLogs}`} />
      </div>
      <p className="text-[11px] text-muted-foreground mt-3">
        Next milestone: {totalLogs < 4 ? `${4 - totalLogs} more logs to sprout buds 🌱` : totalLogs < 10 ? `${10 - totalLogs} more logs to first bloom 🌸` : totalLogs < 20 ? `${20 - totalLogs} more logs for a lush garden ✨` : "Your garden is in full bloom. 🌷"}
      </p>
    </div>
  );
}

function Plant({ x, groundY, height, stage, palette, index }: {
  x: number; groundY: number; height: number;
  stage: "seedling" | "bud" | "bloom" | "lush";
  palette: { flower: string; leaf: string };
  index: number;
}) {
  const topY = groundY - height;
  const size = stage === "seedling" ? 5 : stage === "bud" ? 7 : stage === "bloom" ? 10 : 12;
  const petalCount = 6;
  const showFlower = stage !== "seedling";
  const doubleFlower = stage === "lush";

  return (
    <g>
      {/* Stem */}
      <line x1={x} y1={groundY} x2={x} y2={topY} stroke={palette.leaf} strokeWidth={2.5} strokeLinecap="round" />
      {/* Leaves */}
      <ellipse cx={x - 6} cy={topY + height * 0.55} rx={6} ry={3} fill={palette.leaf} transform={`rotate(-30 ${x - 6} ${topY + height * 0.55})`} />
      <ellipse cx={x + 6} cy={topY + height * 0.35} rx={6} ry={3} fill={palette.leaf} transform={`rotate(30 ${x + 6} ${topY + height * 0.35})`} />
      {/* Flower head */}
      {showFlower ? (
        <g transform={`translate(${x} ${topY})`}>
          {Array.from({ length: petalCount }).map((_, i) => {
            const angle = (i * 360) / petalCount;
            return <circle key={i} cx={Math.cos((angle * Math.PI) / 180) * size} cy={Math.sin((angle * Math.PI) / 180) * size} r={size * 0.75} fill={palette.flower} opacity="0.9" />;
          })}
          <circle cx={0} cy={0} r={size * 0.55} fill="#fff8d6" />
          {doubleFlower && (
            <g opacity="0.7">
              {Array.from({ length: petalCount }).map((_, i) => {
                const angle = (i * 360) / petalCount + 30;
                return <circle key={i} cx={Math.cos((angle * Math.PI) / 180) * (size * 0.6)} cy={Math.sin((angle * Math.PI) / 180) * (size * 0.6)} r={size * 0.5} fill={palette.flower} />;
              })}
            </g>
          )}
        </g>
      ) : (
        // seedling
        <g transform={`translate(${x} ${topY})`}>
          <ellipse cx={-3} cy={0} rx={4} ry={2} fill={palette.leaf} transform="rotate(-45)" />
          <ellipse cx={3} cy={0} rx={4} ry={2} fill={palette.leaf} transform="rotate(45)" />
        </g>
      )}
      {/* Tiny grass tuft at base for depth */}
      <path d={`M ${x - 4} ${groundY} q 4 -6 4 0 M ${x + 4} ${groundY} q -4 -6 -4 0`} stroke={palette.leaf} strokeWidth={1} fill="none" opacity={0.7 + (index % 3) * 0.1} />
    </g>
  );
}

function Butterfly({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={-5} cy={0} rx={5} ry={3.5} fill="#ff8fb1" opacity="0.85" />
      <ellipse cx={5} cy={0} rx={5} ry={3.5} fill="#ff8fb1" opacity="0.85" />
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
