import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AFFIRMATIONS, affirmationOfDay } from "@/lib/cycle";
import { useEffect, useState } from "react";
import { Music, RefreshCw, Sparkles, Wind, Flower2 } from "lucide-react";

export const Route = createFileRoute("/vibes")({
  head: () => ({ meta: [{ title: "Good Vibes — Sakhi Cycle" }, { name: "description", content: "Spotify playlists, daily affirmations and tiny mindful games to lift your day." }] }),
  component: VibesPage,
});

const PHASE_PLAYLISTS = [
  { name: "Soft Period Days", desc: "Warm, slow songs to curl up with.", id: "37i9dQZF1DWZqd5JICZI0u" },
  { name: "Calm Vibes", desc: "Quiet focus and deep rest.", id: "37i9dQZF1DWVV27DiNWxkR" },
  { name: "Feel-Good Pop", desc: "Lift your ovulation energy.", id: "37i9dQZF1DX3rxVfibe1L0" },
  { name: "Lo-Fi Beats", desc: "Cozy background warmth.", id: "37i9dQZF1DWWQRwui0ExPn" },
];

const BOLLYWOOD_PLAYLISTS = [
  { name: "Bollywood Butter", desc: "Smooth, soulful Bollywood for soft days.", id: "37i9dQZF1DX0XUfTFmNBRM" },
  { name: "Bollywood Acoustic", desc: "Unplugged warmth for slow mornings.", id: "37i9dQZF1DX1i3hvzHpcQV" },
  { name: "Hot Hits Hindi", desc: "Today's biggest Hindi tracks.", id: "37i9dQZF1DX0XUsuxWHRQd" },
  { name: "Bollywood Romance", desc: "Cozy love songs for your luteal lounge.", id: "37i9dQZF1DX5q67ZpWyRrZ" },
  { name: "Bollywood Dance", desc: "Move it out — for high-energy follicular days.", id: "37i9dQZF1DX08jcQJXDnEQ" },
  { name: "Indie India", desc: "Soft indie gems for thinking days.", id: "37i9dQZF1DX5q5UVtnsXcU" },
];

const TSWIFT_PLAYLISTS = [
  { name: "This Is Taylor Swift", desc: "Her essentials, all eras.", id: "37i9dQZF1DX5KpP2LN299J" },
  { name: "Taylor Swift Radio", desc: "Songs in her orbit.", id: "37i9dQZF1E4uKuiC4hVAFQ" },
  { name: "Folklore & Evermore", desc: "Cozy cardigan-core for cramp days.", id: "37i9dQZF1DX7gIoKXt0gmx" },
  { name: "1989 (Taylor's Version)", desc: "Pop sparkle for ovulation energy.", id: "37i9dQZF1DWUoY6Ih7vsxr" },
];

function VibesPage() {
  const [affirmation, setAffirmation] = useState(affirmationOfDay());
  const [tab, setTab] = useState<"music" | "affirm" | "breathe" | "matcher">("music");
  const [musicTab, setMusicTab] = useState<"phase" | "bolly" | "tswift">("phase");
  const playlists = musicTab === "phase" ? PHASE_PLAYLISTS : musicTab === "bolly" ? BOLLYWOOD_PLAYLISTS : TSWIFT_PLAYLISTS;

  return (
    <AppShell>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-display mb-2">Your daily <span className="gradient-text">vibes</span></h1>
      <p className="text-muted-foreground mb-6 text-sm sm:text-base">Music, mantras, and tiny moments of play.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {([["music", "Playlists", Music], ["affirm", "Affirmations", Sparkles], ["breathe", "Breathe", Wind], ["matcher", "Mood Match", Flower2]] as const).map(([k, label, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition btn-3d ${
            tab === k ? "bg-primary text-primary-foreground shadow-soft" : "glass hover:bg-white"
          }`}><Icon className="h-4 w-4" />{label}</button>
        ))}
      </div>

      {tab === "music" && (
        <>
          <div className="inline-flex gap-1 p-1 rounded-full glass mb-5 flex-wrap">
            {([["phase", "For Your Phase"], ["bolly", "Bollywood"], ["tswift", "Taylor Swift"]] as const).map(([k, label]) => (
              <button key={k} onClick={() => setMusicTab(k)} className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition ${
                musicTab === k ? "gradient-warm text-white shadow-soft" : "text-foreground/70 hover:text-foreground"
              }`}>{label}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {playlists.map((p) => (
              <div key={p.id} className="card-3d rounded-3xl p-4 hover:-translate-y-1 transition-transform">
                <div className="mb-2 min-w-0">
                  <div className="font-display text-lg truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.desc}</div>
                </div>
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${p.id}?utm_source=generator&theme=0`}
                  width="100%" height="352" frameBorder={0}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy" className="rounded-xl"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "affirm" && (
        <div className="card-3d rounded-3xl p-8 sm:p-10 text-center max-w-2xl mx-auto">
          <div className="h-16 w-16 mx-auto rounded-full gradient-warm shadow-glow flex items-center justify-center mb-6 animate-breathe">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <p className="font-display text-xl sm:text-2xl md:text-3xl leading-snug mb-6">"{affirmation}"</p>
          <button onClick={() => setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)])}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-warm text-white font-semibold shadow-soft btn-3d">
            <RefreshCw className="h-4 w-4" /> Another one
          </button>
        </div>
      )}

      {tab === "breathe" && <BreatheGame />}
      {tab === "matcher" && <MoodMatch />}
    </AppShell>
  );
}

function BreatheGame() {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [count, setCount] = useState(4);
  const [running, setRunning] = useState(true);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (count > 1) { const t = setTimeout(() => setCount(count - 1), 1000); return () => clearTimeout(t); }
    const t = setTimeout(() => {
      if (phase === "in") { setPhase("hold"); setCount(4); }
      else if (phase === "hold") { setPhase("out"); setCount(6); }
      else { setPhase("in"); setCount(4); setCycles((c) => c + 1); }
    }, 1000);
    return () => clearTimeout(t);
  }, [count, phase, running]);

  const scale = phase === "in" ? 1.4 : phase === "hold" ? 1.4 : 1;
  const label = phase === "in" ? "Breathe in" : phase === "hold" ? "Hold" : "Breathe out";

  return (
    <div className="card-3d rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto">
      <div className="font-display text-xl mb-1">4-4-6 Box Breath</div>
      <p className="text-muted-foreground text-sm mb-8">A calming rhythm for cramps, anxiety and overwhelm.</p>
      <div className="relative h-64 flex items-center justify-center">
        <div className="absolute h-64 w-64 rounded-full gradient-warm blur-2xl opacity-40" />
        <div className="relative h-40 w-40 rounded-full gradient-warm shadow-glow flex items-center justify-center text-white transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${scale})` }}>
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest opacity-90">{label}</div>
            <div className="font-display text-5xl">{count}</div>
          </div>
        </div>
      </div>
      <div className="mt-6 text-xs text-muted-foreground">Cycles completed: <strong className="text-foreground">{cycles}</strong></div>
      <button onClick={() => setRunning(!running)} className="mt-4 px-5 py-2 rounded-full glass font-semibold text-sm hover:bg-white">
        {running ? "Pause" : "Resume"}
      </button>
    </div>
  );
}

const MOOD_PROMPTS = [
  { mood: "Tense", suggestion: "Try the 4-4-6 breath, or a warm chamomile tea." },
  { mood: "Tired", suggestion: "Lie down, legs up the wall for 5 minutes. Skip the to-do list." },
  { mood: "Sad", suggestion: "Soft music, a hand on your heart, and your favorite snack. You're held." },
  { mood: "Angry", suggestion: "Walk briskly for 10 minutes — let the body move what the mind can't." },
  { mood: "Hopeful", suggestion: "Write down 3 tiny intentions. Plant seeds now." },
  { mood: "Joyful", suggestion: "Share it. Text someone you love. Joy compounds." },
];

function MoodMatch() {
  const [picked, setPicked] = useState<typeof MOOD_PROMPTS[number] | null>(null);
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card-3d rounded-3xl p-6 sm:p-8">
        <div className="font-display text-xl mb-1 text-center">How do you feel right now?</div>
        <p className="text-muted-foreground text-sm text-center mb-6">Tap a mood — Sakhi will suggest one tiny act of care.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MOOD_PROMPTS.map((m) => (
            <button key={m.mood} onClick={() => setPicked(m)} className={`p-4 rounded-2xl transition btn-3d ${
              picked?.mood === m.mood ? "gradient-warm text-white shadow-glow" : "glass hover:bg-white"
            }`}>
              <div className="font-display text-lg">{m.mood}</div>
            </button>
          ))}
        </div>
        {picked && (
          <div className="mt-6 p-5 rounded-2xl gradient-warm text-white shadow-glow text-center animate-breathe">
            <Sparkles className="h-5 w-5 mx-auto mb-2" />
            <p className="text-base leading-relaxed">{picked.suggestion}</p>
          </div>
        )}
      </div>
    </div>
  );
}
