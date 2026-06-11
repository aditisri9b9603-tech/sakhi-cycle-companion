import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { affirmationOfDay, computeInsights, getProfile, type CycleProfile, type CycleInsight } from "@/lib/cycle";
import { CycleRing } from "@/components/CycleRing";
import { ArrowRight, Activity, MessageCircle, Apple, Music, Sparkles, Heart, Stethoscope, Users, Play } from "lucide-react";
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
      <section className="relative overflow-hidden rounded-3xl card-3d p-5 sm:p-8 md:p-10 mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Hello {profile?.nickname ?? "beautiful"}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display leading-tight mb-3">
              Bloom in every <span className="gradient-text">phase</span> of you.
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 max-w-md">
              Track your cycle, talk to <strong>Sakhi AI</strong>, find a buddy, and care for yourself with warm, science-backed guidance.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/track" className="inline-flex items-center gap-2 px-5 py-3 rounded-full gradient-warm text-white font-semibold shadow-glow hover:scale-105 transition btn-3d">
                {profile ? "Open my cycle" : "Set up my cycle"} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/chat" className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass font-semibold hover:bg-white transition">
                <MessageCircle className="h-4 w-4" /> Chat with Sakhi
              </Link>
            </div>
          </div>
          <div className="relative">
            <img src={heroImg} alt="Soft floating orbs and blossoms" width={1536} height={1024} className="rounded-3xl shadow-glow w-full h-auto object-cover aspect-[3/2]" />
            <div className="absolute -bottom-4 left-2 right-2 sm:-left-4 sm:right-auto glass rounded-2xl p-3 sm:p-4 sm:max-w-[220px] animate-float">
              <div className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground mb-1">Today's affirmation</div>
              <div className="text-xs sm:text-sm font-medium leading-snug">{affirmation}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="card-3d rounded-3xl p-5 sm:p-6 md:p-8 mb-6 md:mb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full gradient-warm blur-3xl opacity-30 animate-float pointer-events-none" />
        {insight && profile ? (
          <div className="relative grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-6 md:gap-8 items-center">
            <div className="flex justify-center">
              <CycleRing insight={insight} size={240} />
            </div>
            <div className="min-w-0 grid gap-4 sm:grid-cols-2">
              <Stat label="Phase" value={`${insight.phaseEmoji} ${insight.phase}`} hint={insight.phaseDescription} wide />
              <Stat label="Next period" value={`${insight.daysToNextPeriod} days`} hint={insight.nextPeriodDate} />
              <Stat label="Cycle day" value={`${insight.dayOfCycle} / ${profile.cycleLength}`} hint="Today" />
              <Stat label="Fertile window" value={insight.fertileWindowStart} hint={`to ${insight.fertileWindowEnd}`} />
              <Stat label="Ovulation" value={insight.ovulationDate} hint="Predicted" />
            </div>
          </div>
        ) : (
          <div className="relative text-center py-6">
            <div className="h-16 w-16 mx-auto rounded-full gradient-warm shadow-glow flex items-center justify-center mb-4 animate-breathe">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-display text-2xl mb-2">Set up your cycle</h2>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">Add your last period date and average cycle length to unlock predictions, insights and phase-aware tips.</p>
            <Link to="/track" className="inline-flex items-center gap-2 px-5 py-3 rounded-full gradient-warm text-white font-semibold shadow-glow btn-3d">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: "/track", icon: Activity, title: "Cycle Tracker", desc: "Log mood, flow, symptoms." },
          { to: "/chat", icon: MessageCircle, title: "Sakhi AI", desc: "Ask anything, gently." },
          { to: "/lifestyle", icon: Apple, title: "Lifestyle & Diet", desc: "Phase-aware nutrition." },
          { to: "/products", icon: Play, title: "Period Products", desc: "How-to videos & guides." },
          { to: "/doctors", icon: Stethoscope, title: "24/7 Gynaec", desc: "Specialists near you." },
          { to: "/forum", icon: Users, title: "Anonymous Forum", desc: "Share — no names." },
          { to: "/buddy", icon: Heart, title: "Buddy System", desc: "A cycle pen-pal." },
          { to: "/vibes", icon: Music, title: "Good Vibes", desc: "Music, affirmations, play." },
        ].map((card) => (
          <Link key={card.to} to={card.to} className="group card-3d rounded-2xl p-5 hover:shadow-glow hover:-translate-y-1 transition-all min-w-0">
            <div className="h-11 w-11 rounded-xl gradient-warm flex items-center justify-center text-white shadow-soft mb-3 group-hover:scale-110 transition">
              <card.icon className="h-5 w-5" />
            </div>
            <div className="font-display text-lg mb-1 truncate">{card.title}</div>
            <div className="text-sm text-muted-foreground">{card.desc}</div>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}

function Stat({ label, value, hint, wide }: { label: string; value: string; hint?: string; wide?: boolean }) {
  return (
    <div className={`glass rounded-2xl p-4 min-w-0 ${wide ? "sm:col-span-2" : ""}`}>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      <div className="font-display text-lg sm:text-xl gradient-text truncate capitalize">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{hint}</div>}
    </div>
  );
}
