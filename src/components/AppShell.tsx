import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, Heart, MessageCircle, Users, UserRound, Sparkles, Apple, Play, Stethoscope, Music } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Home", icon: Heart },
  { to: "/track", label: "Cycle", icon: Activity },
  { to: "/chat", label: "Sakhi AI", icon: MessageCircle },
  { to: "/lifestyle", label: "Lifestyle", icon: Apple },
  { to: "/products", label: "Products", icon: Play },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/forum", label: "Forum", icon: Users },
  { to: "/buddy", label: "Buddy", icon: UserRound },
  { to: "/vibes", label: "Vibes", icon: Music },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="relative min-h-screen">
      <div className="bloom-orb animate-float" style={{ width: 380, height: 380, top: -60, left: -80, background: "oklch(0.85 0.12 30)" }} />
      <div className="bloom-orb animate-float" style={{ width: 420, height: 420, top: 200, right: -100, background: "oklch(0.82 0.13 350)", animationDelay: "2s" }} />
      <div className="bloom-orb animate-float" style={{ width: 300, height: 300, bottom: 0, left: "30%", background: "oklch(0.86 0.1 60)", animationDelay: "4s" }} />

      <header className="sticky top-0 z-40 glass-strong border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full gradient-warm blur-md opacity-70 group-hover:opacity-100 transition" />
              <div className="relative h-9 w-9 rounded-full gradient-warm shadow-glow flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="leading-tight">
              <div className="font-display text-xl gradient-text">Sakhi Cycle</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">your gentle companion</div>
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
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-8 pb-28 lg:pb-12">{children}</main>

      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-50 glass-strong rounded-full px-2 py-2">
        <div className="flex items-center justify-between overflow-x-auto gap-1 scrollbar-none">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center justify-center min-w-[58px] px-2 py-1.5 rounded-2xl text-[10px] font-medium transition ${
                  active ? "bg-primary text-primary-foreground" : "text-foreground/65"
                }`}
              >
                <Icon className="h-4 w-4 mb-0.5" />
                <span className="leading-none">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
