import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function Splash() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("sakhi.splash.seen");
  });
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!show) return;
    const t1 = setTimeout(() => setFade(true), 2200);
    const t2 = setTimeout(() => {
      sessionStorage.setItem("sakhi.splash.seen", "1");
      setShow(false);
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [show]);

  if (!show) return null;
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${fade ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.92 0.08 350), oklch(0.88 0.09 30) 50%, oklch(0.82 0.12 15))" }}>
      <div className="absolute inset-0 starfield pointer-events-none" />
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} className="petal" style={{ left: `${(i * 73) % 100}%`, animationDelay: `${(i % 7) * 0.3}s`, animationDuration: `${5 + (i % 4)}s` }} />
      ))}
      <div className="relative text-center px-6 animate-splash-in">
        <div className="relative mx-auto mb-6 h-28 w-28">
          <div className="absolute inset-0 rounded-full gradient-warm blur-2xl opacity-80 animate-breathe" />
          <div className="relative h-28 w-28 rounded-full gradient-warm shadow-glow flex items-center justify-center">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white drop-shadow mb-2">Sakhi Cycle</h1>
        <p className="text-white/90 text-sm sm:text-base">Your AI Companion for Menstrual Wellness</p>
      </div>
    </div>
  );
}
