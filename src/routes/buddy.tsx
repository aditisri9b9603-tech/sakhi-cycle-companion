import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { Heart, Shuffle, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/buddy")({
  head: () => ({ meta: [{ title: "Cycle Buddy — Sakhi Cycle" }, { name: "description", content: "Get paired with a cycle buddy for gentle accountability and warmth." }] }),
  component: BuddyPage,
});

type Buddy = { name: string; bio: string; phase: string; vibe: string; emoji: string };

const POOL: Buddy[] = [
  { name: "Petal", bio: "Yoga teacher, plant mom, terrible at remembering to drink water.", phase: "Luteal", vibe: "Cozy", emoji: "🌷" },
  { name: "Willow", bio: "Med student. Loves chai, lo-fi, and warm baths.", phase: "Follicular", vibe: "Bookish", emoji: "🍃" },
  { name: "Ember", bio: "Designer working on PMS-friendly routines. Big into journaling.", phase: "Menstrual", vibe: "Reflective", emoji: "🔥" },
  { name: "Lark", bio: "Marathoner. Tracking how cycle affects my training.", phase: "Ovulation", vibe: "High energy", emoji: "🐦" },
  { name: "Sage", bio: "Therapist. Quiet support, no fixing.", phase: "Luteal", vibe: "Calm", emoji: "🌿" },
  { name: "Iris", bio: "PCOS sister. Loves food and gentle movement.", phase: "Follicular", vibe: "Warm", emoji: "💜" },
];

const KEY = "sakhi:buddy";

function BuddyPage() {
  const [buddy, setBuddy] = useState<Buddy | null>(null);
  useEffect(() => { try { const r = localStorage.getItem(KEY); if (r) setBuddy(JSON.parse(r)); } catch {} }, []);

  function pair() {
    const b = POOL[Math.floor(Math.random() * POOL.length)];
    setBuddy(b); localStorage.setItem(KEY, JSON.stringify(b));
  }

  return (
    <AppShell>
      <h1 className="text-3xl md:text-4xl font-display mb-2">Your cycle <span className="gradient-text">buddy</span></h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">A gentle accountability friend who's also tracking her cycle. Check in, share a win, vent a little. You're not alone in this.</p>

      {!buddy ? (
        <div className="glass rounded-3xl p-10 text-center">
          <div className="h-20 w-20 mx-auto rounded-full gradient-warm shadow-glow flex items-center justify-center text-4xl mb-4 animate-breathe">💞</div>
          <h2 className="font-display text-2xl mb-2">Find your match</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">We'll pair you with someone whose vibe complements yours. Pseudonymous — your identity stays private.</p>
          <button onClick={pair} className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-warm text-white font-semibold shadow-glow hover:scale-105 transition">
            <Heart className="h-4 w-4" /> Pair me up
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          <div className="glass rounded-3xl p-6 md:col-span-2">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-3xl gradient-warm flex items-center justify-center text-4xl shadow-glow shrink-0">{buddy.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display text-2xl">{buddy.name}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary">{buddy.phase} phase</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/40">{buddy.vibe}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{buddy.bio}</p>
                <div className="flex gap-2 mt-4">
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full gradient-warm text-white text-sm font-semibold shadow-soft"><MessageCircle className="h-3.5 w-3.5" /> Send a check-in</button>
                  <button onClick={pair} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass text-sm font-semibold hover:bg-white"><Shuffle className="h-3.5 w-3.5" /> Re-pair</button>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="font-display text-lg mb-3">This week's prompts</div>
            <ul className="space-y-2 text-sm">
              <li className="p-2 rounded-lg bg-secondary/60">🌷 What's one tiny win this cycle?</li>
              <li className="p-2 rounded-lg bg-secondary/60">🍵 Share a comfort ritual.</li>
              <li className="p-2 rounded-lg bg-secondary/60">📓 One thing your body taught you today.</li>
            </ul>
          </div>
        </div>
      )}
    </AppShell>
  );
}
