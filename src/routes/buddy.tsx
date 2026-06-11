import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Heart, Shuffle, Send, Share2, Copy, Check, Phone } from "lucide-react";
import { bumpQuota, DAILY_QUOTA, getQuotaUsed } from "@/lib/cycle";

export const Route = createFileRoute("/buddy")({
  head: () => ({ meta: [{ title: "Cycle Buddy — Sakhi Cycle" }, { name: "description", content: "Get paired with a cycle buddy for gentle accountability and warmth." }] }),
  component: BuddyPage,
});

type Buddy = { name: string; bio: string; phase: string; vibe: string; emoji: string; persona: string };

const POOL: Buddy[] = [
  { name: "Petal", bio: "Yoga teacher, plant mom, terrible at remembering to drink water.", phase: "Luteal", vibe: "Cozy", emoji: "🌷", persona: "warm yoga teacher in her luteal phase, loves chai and slow mornings" },
  { name: "Willow", bio: "Med student. Loves chai, lo-fi, and warm baths.", phase: "Follicular", vibe: "Bookish", emoji: "🍃", persona: "thoughtful med student in her follicular phase, gentle and curious" },
  { name: "Ember", bio: "Designer working on PMS-friendly routines. Big into journaling.", phase: "Menstrual", vibe: "Reflective", emoji: "🔥", persona: "reflective designer on day 2 of her period, soft and supportive" },
  { name: "Lark", bio: "Marathoner. Tracking how cycle affects training.", phase: "Ovulation", vibe: "High energy", emoji: "🐦", persona: "high-energy marathoner near ovulation, cheerful and motivating" },
  { name: "Sage", bio: "Therapist. Quiet support, no fixing.", phase: "Luteal", vibe: "Calm", emoji: "🌿", persona: "calm therapist in luteal phase, listens more than speaks" },
  { name: "Iris", bio: "PCOS sister. Loves food and gentle movement.", phase: "Follicular", vibe: "Warm", emoji: "💜", persona: "warm PCOS sister, food-loving and encouraging" },
];

const KEY = "sakhi:buddy";
const WA_KEY = "sakhi:buddy:wa";
const CHAT_KEY = "sakhi:buddy:chat";

const WA_REGEX = /^\+\d{8,15}$/;

function BuddyPage() {
  const [buddy, setBuddy] = useState<Buddy | null>(null);
  const [wa, setWa] = useState("");
  const [waSaved, setWaSaved] = useState("");
  const [shareWa, setShareWa] = useState(false);
  const [copied, setCopied] = useState(false);
  const [waError, setWaError] = useState("");
  const [editingWa, setEditingWa] = useState(false);

  useEffect(() => {
    try { const r = localStorage.getItem(KEY); if (r) setBuddy(JSON.parse(r)); } catch {}
    try { const w = localStorage.getItem(WA_KEY); if (w) { setWaSaved(w); setWa(w); setShareWa(true); } } catch {}
  }, []);

  function pair() {
    const others = POOL.filter((b) => b.name !== buddy?.name);
    const b = others[Math.floor(Math.random() * others.length)];
    setBuddy(b); localStorage.setItem(KEY, JSON.stringify(b));
    try { localStorage.removeItem(CHAT_KEY); } catch {}
  }
  function saveWa(): boolean {
    const clean = wa.replace(/\s|-/g, "");
    if (!WA_REGEX.test(clean)) {
      setWaError("Use international format, e.g. +919876543210");
      return false;
    }
    setWaError("");
    localStorage.setItem(WA_KEY, clean); setWaSaved(clean); setEditingWa(false);
    return true;
  }
  function copyShare() {
    const link = waSaved ? `https://wa.me/${waSaved.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi! We got paired as cycle buddies on Sakhi Cycle 🌷")}` : "";
    if (!link) return;
    try { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  }
  function openWaWithBuddy() {
    if (!buddy) return;
    const text = encodeURIComponent(`Hey! I'm checking in as your Sakhi Cycle buddy (${buddy.name} vibe ${buddy.emoji}). Want to do a weekly check-in together? 🌷`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }

  return (
    <AppShell>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-display mb-2">Your cycle <span className="gradient-text">buddy</span></h1>
      <p className="text-muted-foreground mb-6 max-w-2xl text-sm sm:text-base">A gentle companion who's also tracking her cycle. Check in, share a win, vent a little — you're not alone in this.</p>

      {!buddy ? (
        <div className="card-3d rounded-3xl p-6 sm:p-10 text-center">
          <div className="h-20 w-20 mx-auto rounded-full gradient-warm shadow-glow flex items-center justify-center text-4xl mb-4 animate-breathe">💞</div>
          <h2 className="font-display text-2xl mb-2">Find your match</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">We'll pair you with someone whose vibe complements yours. Pseudonymous — your identity stays private.</p>

          <div className="max-w-md mx-auto mb-6 text-left">
            <label className="flex items-start gap-3 p-4 rounded-2xl glass cursor-pointer">
              <input type="checkbox" checked={shareWa} onChange={(e) => { setShareWa(e.target.checked); setWaError(""); }} className="mt-1 accent-primary" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">Enable optional WhatsApp connect</div>
                <div className="text-xs text-muted-foreground mt-0.5">Save your WhatsApp so you can invite a real friend later. Stays on this device.</div>
                {shareWa && (
                  <>
                    <input value={wa} onChange={(e) => { setWa(e.target.value); setWaError(""); }} placeholder="+91 9876543210" className="mt-3 w-full px-3 py-2 rounded-full bg-white/70 border border-border text-sm" />
                    {waError && <div className="text-xs text-destructive mt-1">{waError}</div>}
                  </>
                )}
              </div>
            </label>
          </div>

          <button onClick={() => { if (shareWa && !saveWa()) return; pair(); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-warm text-white font-semibold shadow-glow btn-3d">
            <Heart className="h-4 w-4" /> Pair me up
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-4 md:gap-6">
          <BuddyChat buddy={buddy} />
          <aside className="space-y-4">
            <div className="card-3d rounded-3xl p-5 animate-float">
              <div className="flex items-start gap-3">
                <div className="h-16 w-16 rounded-3xl gradient-warm flex items-center justify-center text-3xl shadow-glow shrink-0">{buddy.emoji}</div>
                <div className="min-w-0">
                  <h2 className="font-display text-xl truncate">{buddy.name}</h2>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary">{buddy.phase}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/40">{buddy.vibe}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{buddy.bio}</p>
              <button onClick={pair} className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full glass text-sm font-semibold hover:bg-white">
                <Shuffle className="h-3.5 w-3.5" /> Re-pair
              </button>
            </div>

            <div className="card-3d rounded-3xl p-5" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2 mb-2"><Share2 className="h-4 w-4 text-primary" /><div className="font-display text-base">WhatsApp connect</div></div>
              <p className="text-xs text-muted-foreground mb-3">In-app chat is an AI buddy for privacy. To buddy with a real friend, open WhatsApp and pick a contact — we'll pre-fill the message.</p>

              <button onClick={openWaWithBuddy} className="w-full mb-3 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full gradient-warm text-white text-sm font-semibold btn-3d">
                <Phone className="h-3.5 w-3.5" /> Open WhatsApp with {buddy.name}
              </button>

              {!waSaved || editingWa ? (
                <div className="space-y-2">
                  <div className="text-xs font-semibold">Your WhatsApp (for invite link)</div>
                  <input value={wa} onChange={(e) => { setWa(e.target.value); setWaError(""); }} placeholder="+91 9876543210" className="w-full px-3 py-2 rounded-full bg-white/70 border border-border text-sm" />
                  {waError && <div className="text-xs text-destructive">{waError}</div>}
                  <button onClick={saveWa} className="w-full px-4 py-2 rounded-full glass text-sm font-semibold hover:bg-white">Save number</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground min-w-0 truncate">Your link: <span className="text-foreground">wa.me/{waSaved.replace(/[^0-9]/g, "")}</span></div>
                    <button onClick={() => setEditingWa(true)} className="text-[11px] text-primary shrink-0">Edit</button>
                  </div>
                  <button onClick={copyShare} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full glass text-sm font-semibold hover:bg-white">
                    {copied ? <><Check className="h-3.5 w-3.5" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy my invite link</>}
                  </button>
                </div>
              )}
            </div>

            <div className="card-3d rounded-3xl p-5">
              <div className="font-display text-base mb-2">This week's prompts</div>
              <ul className="space-y-2 text-xs">
                <li className="p-2 rounded-lg bg-secondary/60">🌷 What's one tiny win this cycle?</li>
                <li className="p-2 rounded-lg bg-secondary/60">🍵 Share a comfort ritual.</li>
                <li className="p-2 rounded-lg bg-secondary/60">📓 One thing your body taught you today.</li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </AppShell>
  );
}

function BuddyChat({ buddy }: { buddy: Buddy }) {
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const initial = useRef<any[]>((() => {
    try { return JSON.parse(localStorage.getItem(CHAT_KEY) ?? "[]"); } catch { return []; }
  })()).current;
  const { messages, sendMessage, status } = useChat({ transport, messages: initial });
  const [input, setInput] = useState("");
  const [used, setUsed] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setUsed(getQuotaUsed()); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, status]);
  useEffect(() => { try { localStorage.setItem(CHAT_KEY, JSON.stringify(messages)); } catch {} }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";
  const out = used >= DAILY_QUOTA;

  function send(text: string) {
    const t = text.trim();
    if (!t || isLoading || out) return;
    const intro = messages.length === 0
      ? `[You are "${buddy.name}", a ${buddy.persona}. Reply as a real friend would over text — warm, casual, short (1–3 sentences), no medical advice, occasional emoji. Never break character.]\n\nFriend says: ${t}`
      : t;
    void sendMessage({ text: intro });
    bumpQuota(); setUsed(getQuotaUsed()); setInput("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className="card-3d rounded-3xl p-3 sm:p-4 md:p-5 flex flex-col min-h-[60vh]">
      <div className="flex items-center gap-3 pb-3 border-b border-border/50 mb-3">
        <div className="h-10 w-10 shrink-0 rounded-full gradient-warm flex items-center justify-center text-xl">{buddy.emoji}</div>
        <div className="min-w-0">
          <div className="font-display text-lg leading-tight">{buddy.name}</div>
          <div className="text-[11px] text-muted-foreground">● online · usually replies right away</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">Say hi to {buddy.name} 👋</div>
        )}
        {messages.map((m) => {
          const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("").replace(/^\[You are.*?\]\n\nFriend says:\s*/s, "");
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                isUser ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary rounded-bl-md"
              }`}>{text}</div>
            </div>
          );
        })}
        {status === "submitted" && (
          <div className="text-xs text-muted-foreground italic">{buddy.name} is typing…</div>
        )}
        <div ref={endRef} />
      </div>
      {out && <div className="mt-2 p-2 rounded-xl bg-amber-100/60 text-amber-900 text-xs text-center">Daily message limit reached.</div>}
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-3 flex items-end gap-2">
        <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          rows={1} placeholder={`Message ${buddy.name}…`}
          className="flex-1 resize-none rounded-2xl glass px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 max-h-32" />
        <button type="submit" disabled={isLoading || !input.trim() || out} className="h-11 w-11 rounded-full gradient-warm text-white shadow-glow flex items-center justify-center disabled:opacity-50 btn-3d">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
