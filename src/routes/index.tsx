import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { affirmationOfDay, computeInsights, getProfile, type CycleProfile, type CycleInsight } from "@/lib/cycle";
import { ArrowRight, Activity, MessageCircle, Apple, Music, Sparkles, Heart, Stethoscope, Users } from "lucide-react";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sakhi Cycle — Your Gentle Period & Wellness Companion" },
      { name: "description", content: "Sakhi Cycle is a warm femtech app for cycle tracking, AI guidance, anonymous community, lifestyle care, and round-the-clock gynaec support." },
      { property: "og:title", content: "Sakhi Cycle — Your Gentle Period & Wellness Companion" },
      { property: "og:description", content: "Track your cycle, talk to Sakhi AI, find a buddy, and bloom in every phase." },
    ],
  }),
  component: Home,
});

function Home() {
  const [profile, setProfile] = useState<CycleProfile | null>(null);
  const [insight, setInsight] = useState<CycleInsight | null>(null);
  const affirmation = affirmationOfDay();

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    if (p) setInsight(computeInsights(p));
  }, []);

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10 mb-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Hello {profile?.nickname ?? "beautiful"}
            </div>
            <h1 className="text-4xl md:text-5xl font-display leading-tight mb-3">
              Bloom in every <span className="gradient-text">phase</span> of you.
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-md">
              Track your cycle, talk to <strong>Sakhi AI</strong>, find a buddy, and care for yourself with warm, science-backed guidance.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/track" className="inline-flex items-center gap-2 px-5 py-3 rounded-full gradient-warm text-white font-semibold shadow-glow hover:scale-105 transition">
                {profile ? "Open my cycle" : "Set up my cycle"} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/chat" className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass font-semibold hover:bg-white transition">
                <MessageCircle className="h-4 w-4" /> Chat with Sakhi
              </Link>
            </div>
          </div>
          <div className="relative">
            <img src={heroImg} alt="Soft floating orbs and blossoms" width={1536} height={1024} className="rounded-3xl shadow-glow w-full h-auto object-cover aspect-[3/2]" />
            <div className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 max-w-[220px] hidden sm:block">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Today's affirmation</div>
              <div className="text-sm font-medium leading-snug">{affirmation}</div>
            </div>
          </div>
        </div>
      </section>

      {insight && profile && (
        <section className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-2xl p-5 md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Today</div>
                <div className="text-2xl font-display">{insight.phaseEmoji} {insight.phase} phase</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-display gradient-text">Day {insight.dayOfCycle}</div>
                <div className="text-xs text-muted-foreground">of {profile.cycleLength}</div>
              </div>
            </div>
            <p className="text-sm text-foreground/80 mb-4">{insight.phaseDescription}</p>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full gradient-warm transition-all" style={{ width: `${insight.cyclePercent}%` }} />
            </div>
            <div className="mt-3 text-xs text-muted-foreground">Next period in <strong className="text-foreground">{insight.daysToNextPeriod} days</strong> ({insight.nextPeriodDate})</div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Fertile window</div>
            <div className="text-lg font-semibold">{insight.fertileWindowStart}</div>
            <div className="text-sm text-muted-foreground">to {insight.fertileWindowEnd}</div>
            <div className="mt-3 text-xs">Ovulation: <strong>{insight.ovulationDate}</strong></div>
          </div>
        </section>
      )}

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { to: "/track", icon: Activity, title: "Cycle Tracker", desc: "Log mood, flow, symptoms. Smart predictions.", grad: "from-rose-200 to-pink-300" },
          { to: "/chat", icon: MessageCircle, title: "Sakhi AI", desc: "Ask anything about your cycle — gently, privately.", grad: "from-peach-200 to-rose-300" },
          { to: "/lifestyle", icon: Apple, title: "Lifestyle & Diet", desc: "Phase-aware nutrition, movement, and rest.", grad: "from-amber-200 to-rose-300" },
          { to: "/products", icon: Heart, title: "Period Products", desc: "Pads, cups, tampons — how-to videos & guides.", grad: "from-pink-200 to-fuchsia-300" },
          { to: "/doctors", icon: Stethoscope, title: "24/7 Gynaec", desc: "Nearby specialists you can reach anytime.", grad: "from-rose-300 to-amber-200" },
          { to: "/forum", icon: Users, title: "Anonymous Forum", desc: "Share, ask, support — no names, no shame.", grad: "from-fuchsia-200 to-pink-300" },
          { to: "/buddy", icon: Heart, title: "Buddy System", desc: "Pair up with a cycle buddy for accountability.", grad: "from-rose-200 to-peach-300" },
          { to: "/vibes", icon: Music, title: "Good Vibes", desc: "Playlists, affirmations, and tiny games.", grad: "from-amber-200 to-fuchsia-200" },
        ].map((card) => (
          <Link key={card.to} to={card.to} className="group glass rounded-2xl p-5 hover:shadow-glow hover:-translate-y-1 transition-all">
            <div className={`h-11 w-11 rounded-xl gradient-warm flex items-center justify-center text-white shadow-soft mb-3 group-hover:scale-110 transition`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div className="font-display text-lg mb-1">{card.title}</div>
            <div className="text-sm text-muted-foreground">{card.desc}</div>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
