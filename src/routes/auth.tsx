import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";

const search = z.object({ next: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Sign in — Sakhi Cycle" },
      { name: "description", content: "Sign in to book gynaecologist appointments and manage your clinic requests." },
      { property: "og:title", content: "Sign in — Sakhi Cycle" },
      { property: "og:description", content: "Sign in to book appointments and manage clinic requests." },
    ],
  }),
  component: AuthPage,
});

function safeNext(n?: string) {
  return n && n.startsWith("/") && !n.startsWith("//") ? n : "/doctors";
}

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: safeNext(next), replace: true });
  }, [user, next, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "up") {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
      if (error) setMsg(error.message);
      else if (!data.session) setMsg("Check your inbox to confirm your email, then sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    }
    setBusy(false);
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) setMsg(String(r.error.message ?? r.error));
  }

  return (
    <AppShell>
      <div className="max-w-md mx-auto card-3d rounded-3xl p-6 sm:p-8">
        <div className="h-14 w-14 mx-auto rounded-full gradient-warm shadow-glow flex items-center justify-center mb-4">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <h1 className="font-display text-2xl text-center">{mode === "in" ? "Welcome back" : "Create your account"}</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">For patients booking appointments and doctors managing their clinic.</p>
        <button onClick={google} className="w-full py-3 rounded-full glass font-semibold text-sm hover:bg-white btn-3d">Continue with Google</button>
        <div className="text-center text-xs text-muted-foreground my-4">or</div>
        <form onSubmit={submit} className="space-y-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="w-full px-4 py-3 rounded-full bg-white/60 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="w-full px-4 py-3 rounded-full bg-white/60 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          <button disabled={busy} className="w-full py-3 rounded-full gradient-warm text-white font-semibold shadow-soft btn-3d disabled:opacity-60">
            {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"}
          </button>
        </form>
        {msg && <p className="text-sm text-center mt-3 text-primary">{msg}</p>}
        <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="w-full mt-4 text-xs text-primary hover:underline">
          {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </AppShell>
  );
}
