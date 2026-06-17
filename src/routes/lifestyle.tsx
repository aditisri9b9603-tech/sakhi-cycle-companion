import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";
import { Apple, Moon, Dumbbell, Coffee, Play } from "lucide-react";

export const Route = createFileRoute("/lifestyle")({
  head: () => ({ meta: [{ title: "Lifestyle & Diet — Sakhi Cycle" }, { name: "description", content: "Phase-aware nutrition, movement, sleep and self-care videos for every part of your cycle." }] }),
  component: LifestylePage,
});

const PHASES = [
  {
    name: "Menstrual (Day 1–5)", emoji: "🌹", color: "from-rose-300 to-pink-400",
    eat: ["Iron-rich: spinach, dates, beetroot, ragi", "Warm soups, kichdi, congee", "Ginger & cinnamon tea", "Dark chocolate (70%+)"],
    avoid: ["Caffeine excess", "Very cold foods", "High salt processed snacks"],
    move: ["Gentle yoga: child's pose, supta baddha konasana", "Walks in nature", "Stretching, restorative poses"],
    rest: ["Sleep 8–9 hrs", "Hot water bottle on lower belly", "Early bedtime routine"],
    videos: [
      { id: "kmWbOC8Fbb0", title: "Period-friendly yin yoga (15 min)", desc: "Gentle poses to ease cramps and lower-back ache. Mat optional, blanket recommended." },
      { id: "_GnIQTOouHE", title: "Anti-cramp warm meal: ginger kichdi", desc: "20-minute one-pot meal — iron, magnesium, and warmth in every bite." },
    ],
  },
  {
    name: "Follicular (Day 6–13)", emoji: "🌱", color: "from-amber-200 to-rose-300",
    eat: ["Fresh greens, sprouts, seeds (flax, pumpkin)", "Fermented foods: yogurt, kimchi", "Lean proteins: eggs, tofu, fish", "Citrus & berries"],
    avoid: ["Heavy fried foods", "Sugar crashes"],
    move: ["High energy: HIIT, dance, running", "Try a new workout", "Strength training"],
    rest: ["Productive mornings", "Creative brainstorming time"],
    videos: [
      { id: "kmWbOC8Fbb0", title: "Energising follicular HIIT (20 min)", desc: "Channel rising oestrogen into a sweaty cardio session — no equipment needed." },
      { id: "_GnIQTOouHE", title: "Seed-cycling for hormones", desc: "Why flax + pumpkin seeds now, and sesame + sunflower later." },
    ],
  },
  {
    name: "Ovulation (Day 14 ±2)", emoji: "✨", color: "from-fuchsia-300 to-rose-400",
    eat: ["Cruciferous veg: broccoli, cauliflower", "Zinc: pumpkin seeds, cashews", "Antioxidant berries", "Plenty of water"],
    avoid: ["Skipping meals"],
    move: ["Peak workouts, group classes", "Social cardio"],
    rest: ["Channel high energy into connection & big asks"],
    videos: [
      { id: "kmWbOC8Fbb0", title: "Strength + dance ovulation flow", desc: "Confidence is at its peak — use it. 25-minute high-energy routine." },
      { id: "_GnIQTOouHE", title: "Cruciferous bowl for hormonal balance", desc: "Quick lunch supporting natural oestrogen detox pathways." },
    ],
  },
  {
    name: "Luteal (Day 15–28)", emoji: "🌙", color: "from-pink-200 to-amber-300",
    eat: ["Complex carbs: sweet potato, oats, quinoa", "Magnesium: bananas, almonds, dark chocolate", "Calcium: dairy/leafy greens", "B6: chickpeas, salmon"],
    avoid: ["Alcohol", "High sodium (bloating)", "Sugar spikes"],
    move: ["Pilates, moderate strength", "Long walks", "Yoga flows"],
    rest: ["Wind down earlier", "Journaling, baths, candle-lit dinners"],
    videos: [
      { id: "kmWbOC8Fbb0", title: "PMS-friendly pilates (15 min)", desc: "Low impact, mood-lifting flow when energy starts dipping." },
      { id: "_GnIQTOouHE", title: "Magnesium-rich evening tea + ritual", desc: "Wind-down routine and recipe to ease tension before bed." },
    ],
  },
];

function LifestylePage() {
  const [openVideo, setOpenVideo] = useState<{ id: string; title: string } | null>(null);

  return (
    <AppShell>
      <h1 className="text-3xl md:text-4xl font-display mb-2">Live in <span className="gradient-text">rhythm</span> with your cycle</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl text-sm sm:text-base">Phase-aware care with real videos for every part of your cycle. Tap any clip to watch.</p>

      <div className="grid lg:grid-cols-2 gap-5">
        {PHASES.map((p) => (
          <div key={p.name} className="card-3d rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl shadow-soft`}>{p.emoji}</div>
              <h2 className="font-display text-xl">{p.name}</h2>
            </div>

            <div className="space-y-2 mb-4">
              {p.videos.map((v) => (
                <button key={v.id + v.title} onClick={() => setOpenVideo(v)} className="w-full text-left glass rounded-2xl p-3 flex items-start gap-3 hover:bg-white transition btn-3d">
                  <div className="h-10 w-10 shrink-0 rounded-xl gradient-warm flex items-center justify-center text-white shadow-soft"><Play className="h-4 w-4" /></div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm leading-snug">{v.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{v.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <Block icon={<Apple className="h-4 w-4" />} title="Nourish" items={p.eat} />
            <Block icon={<Coffee className="h-4 w-4" />} title="Avoid" items={p.avoid} />
            <Block icon={<Dumbbell className="h-4 w-4" />} title="Move" items={p.move} />
            <Block icon={<Moon className="h-4 w-4" />} title="Rest" items={p.rest} />
          </div>
        ))}
      </div>

      {openVideo && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setOpenVideo(null)}>
          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="glass-strong rounded-3xl p-3">
              <div className="flex items-center justify-between px-2 pb-2">
                <div className="font-display text-base truncate">{openVideo.title}</div>
                <button onClick={() => setOpenVideo(null)} className="text-sm px-3 py-1 rounded-full glass">Close</button>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${openVideo.id}?rel=0&autoplay=1`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Block({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1.5">{icon}{title}</div>
      <ul className="text-sm text-foreground/80 space-y-1">
        {items.map((i) => <li key={i} className="flex gap-2"><span className="text-primary mt-1">•</span><span>{i}</span></li>)}
      </ul>
    </div>
  );
}
