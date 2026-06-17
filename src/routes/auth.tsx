import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Sparkles, Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Sakhi Cycle" }, { name: "description", content: "Sign in to save your cycle, chats, and forum posts across devices." }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/" }); });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
        if (error) throw error;
        setError("Check your email to confirm, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      }
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally { setBusy(false); }
  }

  async function google() {
    setBusy(true); setError(null);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) { setError(String(r.error)); setBusy(false); }
  }

  return (
    <AppShell>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="h-16 w-16 mx-auto rounded-full gradient-warm shadow-glow flex items-center justify-center mb-4 animate-breathe">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-3xl mb-1">{mode === "signin" ? "Welcome back" : "Join Sakhi"}</h1>
          <p className="text-sm text-muted-foreground">Save your cycle, chats and community across devices.</p>
        </div>

        <div className="card-3d rounded-3xl p-6">
          <button onClick={google} disabled={busy} className="w-full mb-4 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-border font-semibold text-sm hover:bg-secondary transition btn-3d">
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Email</div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-full bg-white/70 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </label>
            <label className="block">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Password</div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-full bg-white/70 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </label>
            {error && <div className="text-xs text-destructive">{error}</div>}
            <button type="submit" disabled={busy} className="w-full px-5 py-3 rounded-full gradient-warm text-white font-semibold shadow-glow btn-3d disabled:opacity-50">
              {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-xs text-muted-foreground hover:text-primary">
            {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
