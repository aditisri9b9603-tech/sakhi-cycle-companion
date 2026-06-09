import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, Plus, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/forum")({
  head: () => ({ meta: [{ title: "Anonymous Forum — Sakhi Cycle" }, { name: "description", content: "Share, ask, and support — completely anonymous community space." }] }),
  component: ForumPage,
});

type Reply = { id: string; alias: string; body: string; createdAt: number };
type Post = { id: string; alias: string; topic: string; body: string; createdAt: number; hearts: number; replies: Reply[] };

const SEED: Post[] = [
  { id: "p1", alias: "Lotus_42", topic: "PMS", body: "My mood swings have been intense this week. Anyone else feel like a different person for a few days?", createdAt: Date.now() - 1000 * 60 * 60 * 5, hearts: 12, replies: [
    { id: "r1", alias: "Sunbeam", body: "Totally normal. Magnesium and dark chocolate help me a lot 🍫", createdAt: Date.now() - 1000 * 60 * 60 * 4 },
    { id: "r2", alias: "Willow", body: "Sending you softness. You're not alone 💗", createdAt: Date.now() - 1000 * 60 * 60 * 3 },
  ]},
  { id: "p2", alias: "Marigold", topic: "Cups", body: "First time trying a menstrual cup tonight. Tips welcome 🙏", createdAt: Date.now() - 1000 * 60 * 60 * 22, hearts: 8, replies: [
    { id: "r3", alias: "Jasmine", body: "Relax your pelvic floor and don't rush. C-fold worked best for me!", createdAt: Date.now() - 1000 * 60 * 60 * 20 },
  ]},
  { id: "p3", alias: "OceanPearl", topic: "Cramps", body: "Heating pad + ginger tea is my survival kit. What's yours?", createdAt: Date.now() - 1000 * 60 * 60 * 36, hearts: 21, replies: [] },
];

const TOPICS = ["PMS", "Cramps", "Cups", "PCOS", "First period", "Mood", "Wellness", "Other"];

const KEY = "sakhi:forum";
function loadPosts(): Post[] { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : SEED; } catch { return SEED; } }
function savePosts(p: Post[]) { localStorage.setItem(KEY, JSON.stringify(p)); }
function randAlias() {
  const a = ["Petal", "Bloom", "Lotus", "Willow", "Sunbeam", "Jasmine", "Marigold", "Daisy", "Sage", "Iris", "Ember", "Lark"];
  return `${a[Math.floor(Math.random() * a.length)]}_${Math.floor(Math.random() * 99)}`;
}

function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState({ topic: "PMS", body: "" });
  const [replyOn, setReplyOn] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => { setPosts(loadPosts()); }, []);

  function persist(next: Post[]) { setPosts(next); savePosts(next); }
  function createPost() {
    if (!draft.body.trim()) return;
    const p: Post = { id: crypto.randomUUID(), alias: randAlias(), topic: draft.topic, body: draft.body.trim(), createdAt: Date.now(), hearts: 0, replies: [] };
    persist([p, ...posts]);
    setDraft({ topic: "PMS", body: "" }); setShowNew(false);
  }
  function heart(id: string) { persist(posts.map((p) => p.id === id ? { ...p, hearts: p.hearts + 1 } : p)); }
  function reply(id: string) {
    if (!replyText.trim()) return;
    persist(posts.map((p) => p.id === id ? { ...p, replies: [...p.replies, { id: crypto.randomUUID(), alias: randAlias(), body: replyText.trim(), createdAt: Date.now() }] } : p));
    setReplyText(""); setReplyOn(null);
  }

  return (
    <AppShell>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display mb-1">Anonymous <span className="gradient-text">forum</span></h1>
          <p className="text-muted-foreground">A safe room. No names. No judgment. Just real conversations.</p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-warm text-white font-semibold shadow-glow">
          <Plus className="h-4 w-4" /> Share something
        </button>
      </div>

      {showNew && (
        <div className="glass rounded-2xl p-5 mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {TOPICS.map((t) => (
              <button key={t} onClick={() => setDraft({ ...draft, topic: t })} className={`px-3 py-1 rounded-full text-xs transition ${draft.topic === t ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{t}</button>
            ))}
          </div>
          <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} rows={3} placeholder="Speak freely — you're anonymous." className="w-full rounded-xl glass px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none mb-3" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm rounded-full hover:bg-secondary">Cancel</button>
            <button onClick={createPost} className="px-5 py-2 text-sm rounded-full gradient-warm text-white font-semibold shadow-soft">Post</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((p) => (
          <article key={p.id} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2 text-xs">
              <span className="h-7 w-7 rounded-full gradient-warm text-white flex items-center justify-center font-semibold text-[10px]">{p.alias.slice(0, 2).toUpperCase()}</span>
              <span className="font-semibold">{p.alias}</span>
              <span className="px-2 py-0.5 rounded-full bg-accent/40 text-[10px] uppercase tracking-wider">{p.topic}</span>
              <span className="text-muted-foreground ml-auto">{formatDistanceToNow(p.createdAt, { addSuffix: true })}</span>
            </div>
            <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{p.body}</p>
            <div className="flex items-center gap-3 text-xs">
              <button onClick={() => heart(p.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-secondary transition">
                <Heart className="h-3.5 w-3.5 text-rose-500" /> {p.hearts}
              </button>
              <button onClick={() => setReplyOn(replyOn === p.id ? null : p.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-secondary transition">
                <MessageCircle className="h-3.5 w-3.5" /> {p.replies.length} reply
              </button>
            </div>

            {p.replies.length > 0 && (
              <div className="mt-3 pl-4 border-l-2 border-primary/20 space-y-2">
                {p.replies.map((r) => (
                  <div key={r.id} className="text-sm">
                    <div className="text-xs"><strong>{r.alias}</strong> <span className="text-muted-foreground">· {formatDistanceToNow(r.createdAt, { addSuffix: true })}</span></div>
                    <div className="text-foreground/85">{r.body}</div>
                  </div>
                ))}
              </div>
            )}

            {replyOn === p.id && (
              <div className="mt-3 flex gap-2">
                <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Say something kind…" className="flex-1 rounded-full glass px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
                <button onClick={() => reply(p.id)} className="h-9 w-9 rounded-full gradient-warm text-white flex items-center justify-center shadow-soft"><Send className="h-3.5 w-3.5" /></button>
              </div>
            )}
          </article>
        ))}
      </div>
    </AppShell>
  );
}
