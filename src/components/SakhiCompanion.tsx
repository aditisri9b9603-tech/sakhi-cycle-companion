import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { affirmationOfDay } from "@/lib/cycle";

const TIPS = [
  "Sip some warm water 🌸",
  "A gentle stretch can ease cramps.",
  "You're doing beautifully today.",
  "Need to talk? I'm one tap away.",
  "Tiny acts of care, big love.",
];

export function SakhiCompanion() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState(() => TIPS[0]);

  useEffect(() => {
    const i = setInterval(() => setTip(TIPS[Math.floor(Math.random() * TIPS.length)]), 8000);
    return () => clearInterval(i);
  }, []);

  if (pathname === "/chat") return null;

  return (
    <div className="fixed z-40 bottom-24 right-4 lg:bottom-6 lg:right-6 flex flex-col items-end gap-2">
      {open && (
        <div className="glass-strong rounded-2xl p-3 max-w-[220px] animate-splash-in shadow-glow">
          <div className="flex items-start gap-2">
            <p className="text-xs leading-snug flex-1">{tip} <br /><span className="text-muted-foreground italic">{affirmationOfDay()}</span></p>
            <button onClick={() => setOpen(false)} aria-label="close" className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
          </div>
          <Link to="/chat" className="mt-2 block text-center text-xs font-semibold px-3 py-1.5 rounded-full gradient-warm text-white shadow-soft">Chat with Sakhi</Link>
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)} aria-label="Sakhi companion"
        className="relative h-14 w-14 rounded-full gradient-warm shadow-glow flex items-center justify-center animate-float btn-3d">
        <span className="absolute inset-0 rounded-full gradient-warm blur-md opacity-70 animate-breathe" />
        <Sparkles className="relative h-6 w-6 text-white" />
      </button>
    </div>
  );
}
