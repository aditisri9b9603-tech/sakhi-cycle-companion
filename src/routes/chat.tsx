import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Sakhi AI — Your Wellness Companion" }, { name: "description", content: "Chat privately with Sakhi, an AI guide for menstrual and women's wellness questions." }] }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Why am I so tired before my period?",
  "Best foods during the luteal phase?",
  "How do I start using a menstrual cup?",
  "Is it normal to skip a period?",
];

function ChatPage() {
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, status]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const isLoading = status === "submitted" || status === "streaming";

  function submit(text: string) {
    const t = text.trim();
    if (!t || isLoading) return;
    void sendMessage({ text: t });
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <AppShell>
      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="glass rounded-3xl p-4 md:p-6 flex flex-col min-h-[70vh]">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50 mb-4">
            <div className="h-10 w-10 rounded-full gradient-warm shadow-glow flex items-center justify-center animate-breathe">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-display text-lg">Sakhi</div>
              <div className="text-xs text-muted-foreground">Your gentle AI companion · always here</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <div className="h-16 w-16 mx-auto rounded-full gradient-warm shadow-glow flex items-center justify-center mb-4 animate-breathe">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="font-display text-2xl mb-2">Hi, I'm Sakhi.</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">Ask me anything about your cycle, body, or how you're feeling. No question is too small.</p>
                <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => submit(s)} className="px-3 py-2 rounded-full text-sm glass hover:bg-white transition">{s}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                    isUser ? "bg-primary text-primary-foreground rounded-br-md shadow-soft" : "glass rounded-bl-md"
                  }`}>{text}</div>
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
            <div ref={endRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); submit(input); }} className="mt-4 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); } }}
              rows={1}
              placeholder="Type your question…"
              className="flex-1 resize-none rounded-2xl glass px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 max-h-32"
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="h-11 w-11 rounded-full gradient-warm text-white shadow-glow flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="font-display text-lg mb-2">A gentle reminder</div>
            <p className="text-sm text-muted-foreground">Sakhi is an AI — kind and informed, but not a doctor. For severe symptoms, missed periods (3+), or anything worrying, please consult a gynaecologist.</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="font-display text-lg mb-2">Try asking about</div>
            <ul className="space-y-2 text-sm">
              {["PMS coping", "Cycle phases", "Birth control basics", "Painful periods", "PCOS signs", "Mood swings"].map((t) => (
                <li key={t}><button onClick={() => submit(`Tell me about ${t.toLowerCase()}.`)} className="text-left text-primary hover:underline">{t}</button></li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
