import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, Heart, MessageCircle, Users, UserRound, Sparkles, Apple, Play, Stethoscope, Music, Menu, X, Flower2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Splash } from "@/components/Splash";
import { SakhiCompanion } from "@/components/SakhiCompanion";

const NAV = [
  { to: "/", label: "Home", icon: Heart },
  { to: "/track", label: "Cycle", icon: Activity },
  { to: "/chat", label: "Sakhi AI", icon: MessageCircle },
  { to: "/garden", label: "Garden", icon: Flower2 },
  { to: "/lifestyle", label: "Lifestyle", icon: Apple },
  { to: "/products", label: "Products", icon: Play },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/forum", label: "Forum", icon: Users },
  { to: "/buddy", label: "Buddy", icon: UserRound },
  { to: "/vibes", label: "Vibes", icon: Music },
] as const;

const BOTTOM_PRIMARY = NAV.filter((n) => ["/", "/track", "/garden", "/chat"].includes(n.to));

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <Splash />
      <div aria-hidden className="fixed inset-0 starfield pointer-events-none opacity-60" />
      <div className="bloom-orb animate-float" style={{ width: 380, height: 380, top: -60, left: -80, background: "oklch(0.85 0.12 30)" }} />
      <div className="bloom-orb animate-float" style={{ width: 420, height: 420, top: 200, right: -100, background: "oklch(0.82 0.13 350)", animationDelay: "2s" }} />
      <div className="bloom-orb animate-float" style={{ width: 300, height: 300, bottom: 0, left: "30%", background: "oklch(0.86 0.1 60)", animationDelay: "4s" }} />

      <header className="sticky top-0 z-40 glass-strong border-b">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 group min-w-0">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full gradient-warm blur-md opacity-70 group-hover:opacity-100 transition" />
              <div className="relative h-9 w-9 rounded-full gradient-warm shadow-glow flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="leading-tight min-w-0">
              <div className="font-display text-lg sm:text-xl gradient-text truncate">Sakhi Cycle</div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground truncate">your gentle companion</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = pathname === to || (to !== "/" && pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    active ? "bg-primary text-primary-foreground shadow-soft" : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <button onClick={() => setMenuOpen(true)} className="lg:hidden h-10 w-10 shrink-0 rounded-full glass flex items-center justify-center" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-xs glass-strong p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="font-display text-xl gradient-text">Menu</div>
              <button onClick={() => setMenuOpen(false)} className="h-9 w-9 rounded-full glass flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>
            <nav className="space-y-1">
              {NAV.map(({ to, label, icon: Icon }) => {
                const active = pathname === to || (to !== "/" && pathname.startsWith(to));
                return (
                  <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium ${active ? "bg-primary text-primary-foreground shadow-soft" : "hover:bg-secondary"}`}>
                    <Icon className="h-4 w-4" />{label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <main className="relative mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-6 md:py-8 pb-32 lg:pb-12">{children}</main>

      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 glass-strong rounded-3xl px-2 py-2 safe-bottom">
        <div className="flex items-center justify-around gap-1">
          {BOTTOM_PRIMARY.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <Link key={to} to={to}
                className={`flex flex-col items-center justify-center flex-1 min-h-[52px] px-2 py-1.5 rounded-2xl text-[10px] font-medium transition ${
                  active ? "bg-primary text-primary-foreground shadow-soft" : "text-foreground/65"
                }`}>
                <Icon className="h-5 w-5 mb-0.5" />
                <span className="leading-none">{label}</span>
              </Link>
            );
          })}
          <button onClick={() => setMenuOpen(true)} className="flex flex-col items-center justify-center flex-1 min-h-[52px] px-2 py-1.5 rounded-2xl text-[10px] font-medium text-foreground/65">
            <Menu className="h-5 w-5 mb-0.5" />
            <span className="leading-none">More</span>
          </button>
        </div>
      </nav>
      <SakhiCompanion />
    </div>
  );
}
