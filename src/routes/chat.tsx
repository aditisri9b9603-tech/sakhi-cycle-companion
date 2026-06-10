import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Copy, RefreshCw, Plus, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DAILY_QUOTA, bumpQuota, getQuotaUsed } from "@/lib/cycle";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Sakhi AI — Your Wellness Companion" }, { name: "description", content: "Chat privately with Sakhi, an AI guide for menstrual and women's wellness questions." }] }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Why am I so tired before my period?",
  "Best foods during the luteal phase?",
  "How do I start using a menstrual cup?",
  "Is it normal to skip a period?",
  "Natural remedies for cramps?",
  "What does brown spotting mean?",
];

const STORAGE = "sakhi:chat:history";

function loadHistory(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE) ?? "[]"); } catch { return []; }
}

function ChatPage() {
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const initial = useRef(loadHistory()).current;
  const { messages, sendMessage, setMessages, status, error, regenerate } = useChat({
    transport,
    messages: initial,
  });
  const [input, setInput] = useState("");
  const [used, setUsed] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setUsed(getQuotaUsed()); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, status]);
  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(messages)); } catch {}
  }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";
  const remaining = Math.max(0, DAILY_QUOTA - used);
  const outOfQuota = remaining <= 0;

  function submit(text: string) {
    const t = text.trim();
    if (!t || isLoading) return;
    if (outOfQuota) return;
    void sendMessage({ text: t });
    bumpQuota();
    setUsed(getQuotaUsed());
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function newChat() {
    setMessages([]);
    try { localStorage.removeItem(STORAGE); } catch {}
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function copyMsg(text: string) {
    try { navigator.clipboard.writeText(text); } catch {}
  }

  return (
    <AppShell>
      <div className="grid lg:grid-cols-[1fr_300px] gap-4 md:gap-6">
        <div className="card-3d rounded-3xl p-3 sm:p-4 md:p-6 flex flex-col min-h-[72vh]">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/50 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 shrink-0 rounded-full gradient-warm shadow-glow flex items-center justify-center animate-breathe">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-lg truncate">Sakhi</div>
                <div className="text-xs text-muted-foreground truncate">Your gentle AI · {remaining}/{DAILY_QUOTA} messages left today</div>
              </div>
            </div>
            <button onClick={newChat} className="shrink-0 inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full glass hover:bg-white">
              <Plus className="h-3.5 w-3.5" /> New
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.length === 0 && (
              <div className="text-center py-8 md:py-10">
                <div className="h-16 w-16 mx-auto rounded-full gradient-warm shadow-glow flex items-center justify-center mb-4 animate-breathe">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="font-display text-2xl mb-2">Hi, I'm Sakhi.</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6 px-4">Ask me anything about your cycle, body, or how you're feeling. No question is too small.</p>
                <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto px-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => submit(s)} className="px-3 py-2 rounded-full text-xs sm:text-sm glass hover:bg-white transition">{s}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, idx) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              const isUser = m.role === "user";
              const isLast = idx === messages.length - 1;
              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`group max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser ? "bg-primary text-primary-foreground rounded-br-md shadow-soft" : "glass rounded-bl-md"
                  }`}>
                    {isUser ? (
                      <div className="whitespace-pre-wrap">{text}</div>
                    ) : (
                      <div className="prose-chat">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text || "…"}</ReactMarkdown>
                      </div>
                    )}
                    {!isUser && text && (
                      <div className="flex gap-2 mt-2 opacity-60 group-hover:opacity-100 transition">
                        <button onClick={() => copyMsg(text)} className="text-[11px] inline-flex items-center gap-1 hover:text-primary"><Copy className="h-3 w-3" /> Copy</button>
                        {isLast && !isLoading && (
                          <button onClick={() => regenerate()} className="text-[11px] inline-flex items-center gap-1 hover:text-primary"><RefreshCw className="h-3 w-3" /> Regenerate</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="glass rounded-2xl rounded-bl-md px-4 py-3 text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary animate-breathe" />
                    <span className="h-2 w-2 rounded-full bg-primary animate-breathe" style={{ animationDelay: "0.2s" }} />
                    <span className="h-2 w-2 rounded-full bg-primary animate-breathe" style={{ animationDelay: "0.4s" }} />
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-3 text-sm bg-destructive/10 text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> I'm having trouble responding right now. Please try again in a moment.
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {outOfQuota && (
            <div className="mt-3 p-3 rounded-2xl bg-amber-100/60 text-amber-900 text-xs text-center">
              You've used all {DAILY_QUOTA} messages for today. Sakhi will be back tomorrow — rest and breathe 🌷
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); submit(input); }} className="mt-3 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); } }}
              rows={1}
              disabled={outOfQuota}
              placeholder={outOfQuota ? "Daily limit reached — come back tomorrow" : "Type your question…"}
              className="flex-1 resize-none rounded-2xl glass px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 max-h-32 disabled:opacity-60"
            />
            <button type="submit" disabled={isLoading || !input.trim() || outOfQuota} className="h-11 w-11 shrink-0 rounded-full gradient-warm text-white shadow-glow flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed btn-3d">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        <aside className="space-y-4 hidden lg:block">
          <div className="card-3d rounded-2xl p-5">
            <div className="font-display text-lg mb-2">A gentle reminder</div>
            <p className="text-sm text-muted-foreground">Sakhi is an AI — kind and informed, but not a doctor. For severe symptoms, missed periods (3+), or anything worrying, please consult a gynaecologist.</p>
          </div>
          <div className="card-3d rounded-2xl p-5">
            <div className="font-display text-lg mb-2">Try asking about</div>
            <ul className="space-y-2 text-sm">
              {["PMS coping", "Cycle phases", "Birth control basics", "Painful periods", "PCOS signs", "Mood swings"].map((t) => (
                <li key={t}><button onClick={() => submit(`Tell me about ${t.toLowerCase()}.`)} className="text-left text-primary hover:underline">{t}</button></li>
              ))}
            </ul>
          </div>
          <div className="card-3d rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Today's quota</div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden mb-2">
              <div className="h-full gradient-warm transition-all" style={{ width: `${(used / DAILY_QUOTA) * 100}%` }} />
            </div>
            <div className="text-xs text-muted-foreground">{used} of {DAILY_QUOTA} used · resets at midnight</div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
