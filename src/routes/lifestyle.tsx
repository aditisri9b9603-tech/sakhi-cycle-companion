import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Apple, Moon, Dumbbell, Coffee } from "lucide-react";

export const Route = createFileRoute("/lifestyle")({
  head: () => ({ meta: [{ title: "Lifestyle & Diet — Sakhi Cycle" }, { name: "description", content: "Phase-aware nutrition, movement, sleep and self-care for every part of your cycle." }] }),
  component: LifestylePage,
});

const PHASES = [
  {
    name: "Menstrual (Day 1–5)", emoji: "🌹", color: "from-rose-300 to-pink-400",
    eat: ["Iron-rich: spinach, dates, beetroot, ragi", "Warm soups, kichdi, congee", "Ginger & cinnamon tea", "Dark chocolate (70%+)"],
    avoid: ["Caffeine excess", "Very cold foods", "High salt processed snacks"],
    move: ["Gentle yoga: child's pose, supta baddha konasana", "Walks in nature", "Stretching, restorative poses"],
    rest: ["Sleep 8–9 hrs", "Hot water bottle on lower belly", "Early bedtime routine"],
  },
  {
    name: "Follicular (Day 6–13)", emoji: "🌱", color: "from-amber-200 to-rose-300",
    eat: ["Fresh greens, sprouts, seeds (flax, pumpkin)", "Fermented foods: yogurt, kimchi", "Lean proteins: eggs, tofu, fish", "Citrus & berries"],
    avoid: ["Heavy fried foods", "Sugar crashes"],
    move: ["High energy: HIIT, dance, running", "Try a new workout", "Strength training"],
    rest: ["Productive mornings", "Creative brainstorming time"],
  },
  {
    name: "Ovulation (Day 14 ±2)", emoji: "✨", color: "from-fuchsia-300 to-rose-400",
    eat: ["Cruciferous veg: broccoli, cauliflower", "Zinc: pumpkin seeds, cashews", "Antioxidant berries", "Plenty of water"],
    avoid: ["Skipping meals"],
    move: ["Peak workouts, group classes", "Social cardio"],
    rest: ["Channel high energy into connection & big asks"],
  },
  {
    name: "Luteal (Day 15–28)", emoji: "🌙", color: "from-pink-200 to-amber-300",
    eat: ["Complex carbs: sweet potato, oats, quinoa", "Magnesium: bananas, almonds, dark chocolate", "Calcium: dairy/leafy greens", "B6: chickpeas, salmon"],
    avoid: ["Alcohol", "High sodium (bloating)", "Sugar spikes"],
    move: ["Pilates, moderate strength", "Long walks", "Yoga flows"],
    rest: ["Wind down earlier", "Journaling, baths, candle-lit dinners"],
  },
];

function LifestylePage() {
  return (
    <AppShell>
      <h1 className="text-3xl md:text-4xl font-display mb-2">Live in <span className="gradient-text">rhythm</span> with your cycle</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">Your body needs different things at different times. Here's gentle, evidence-informed care for every phase.</p>

      <div className="grid lg:grid-cols-2 gap-5">
        {PHASES.map((p) => (
          <div key={p.name} className="glass rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl shadow-soft`}>{p.emoji}</div>
              <h2 className="font-display text-xl">{p.name}</h2>
            </div>
            <Block icon={<Apple className="h-4 w-4" />} title="Nourish" items={p.eat} />
            <Block icon={<Coffee className="h-4 w-4" />} title="Avoid" items={p.avoid} />
            <Block icon={<Dumbbell className="h-4 w-4" />} title="Move" items={p.move} />
            <Block icon={<Moon className="h-4 w-4" />} title="Rest" items={p.rest} />
          </div>
        ))}
      </div>
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
