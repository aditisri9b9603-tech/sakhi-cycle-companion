import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS, CATEGORIES, matchesCategory, TUTORIAL_SLUGS } from "@/lib/products";
import { AppShell } from "@/components/AppShell";
import { useMemo, useState } from "react";
import { Play, Search, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "Period Products — Sakhi Cycle" }, { name: "description", content: "Pads, tampons, menstrual cups and discs: how to use them, pros and cons, and curated videos." }] }),
  component: ProductsPage,
});

function ProductsPage() {
  const [active, setActive] = useState(PRODUCTS[0].id);
  const product = PRODUCTS.find((p) => p.id === active)!;
  const [video, setVideo] = useState(product.videos[0].id);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const visible = useMemo(() => {
    const t = q.trim().toLowerCase();
    return PRODUCTS.filter((p) => matchesCategory(p, cat) && (!t || [p.name, p.desc, p.how, ...p.pros, ...p.videos.map((v) => v.title)].join(" ").toLowerCase().includes(t)));
  }, [q, cat]);

  function pickProduct(id: string) {
    setActive(id);
    const p = PRODUCTS.find((x) => x.id === id)!;
    setVideo(p.videos[0].id);
  }

  return (
    <AppShell>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-display mb-2">Find your <span className="gradient-text">comfort</span></h1>
      <p className="text-muted-foreground mb-6 max-w-2xl text-sm sm:text-base">Every body is different. Compare options, watch how-to videos, and pick what feels right for you — no judgment.</p>

      <div className="card-3d rounded-3xl p-4 mb-5 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products or tutorials (e.g. cup fold, overnight, wash)…" aria-label="Search products"
            className="w-full pl-9 pr-3 py-2.5 rounded-full bg-white/60 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition btn-3d ${cat === c.key ? "bg-primary text-primary-foreground shadow-soft" : "glass hover:bg-white"}`}>{c.label}</button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="card-3d rounded-3xl p-6 text-center text-sm text-muted-foreground mb-6">No products or tutorials match. Try another word or category.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {visible.map((p) => (
            <div key={p.id} className={`rounded-2xl p-4 transition ${active === p.id ? "card-3d ring-2 ring-primary/40" : "glass hover:bg-white/80"}`}>
              <button onClick={() => pickProduct(p.id)} className="w-full text-left flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-warm text-white flex items-center justify-center shrink-0"><p.icon className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">{p.videos.length} tutorial{p.videos.length > 1 ? "s" : ""} · {p.cost}</div>
                </div>
              </button>
              {TUTORIAL_SLUGS[p.id] && (
                <Link to="/tutorials/$slug" params={{ slug: TUTORIAL_SLUGS[p.id] }} className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  Open tutorial page <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <div className="card-3d rounded-3xl p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="font-display text-xl sm:text-2xl">{product.name}</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-secondary shrink-0">{product.cost}</span>
          </div>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">{product.desc}</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Score label="Beginner-friendly" value={product.score} />
            <Score label="Eco impact" value={product.eco} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Bullets title="Benefits" items={product.pros} tone="primary" />
            <Bullets title="Things to know" items={product.cons} tone="muted" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">How to use</div>
            <p className="text-sm text-foreground/85 leading-relaxed">{product.how}</p>
          </div>
        </div>

        <div className="card-3d rounded-3xl p-4">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-soft bg-black">
            <iframe
              key={video}
              src={`https://www.youtube.com/embed/${video}?rel=0&modestbranding=1`}
              title={`${product.name} tutorial`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"
              className="w-full h-full border-0"
            />
          </div>
          <div className="mt-2 text-right">
            <a href={`https://www.youtube.com/watch?v=${video}`} target="_blank" rel="noreferrer"
              className="text-xs text-primary hover:underline">Open on YouTube ↗</a>
          </div>
          <div className="mt-3 space-y-2">
            {product.videos.map((v) => (
              <button key={v.id} onClick={() => setVideo(v.id)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-2xl transition ${
                  video === v.id ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                }`}>
                <div className="h-8 w-8 shrink-0 rounded-full gradient-warm flex items-center justify-center text-white"><Play className="h-4 w-4" /></div>
                <span className="text-sm flex-1 min-w-0 truncate">{v.title}</span>
              </button>
            ))}
          </div>
          <div className="px-2 pt-3 text-xs text-muted-foreground">Curated tutorials from YouTube. If a video won't play here, use the "Open on YouTube" link.</div>
        </div>
      </div>
    </AppShell>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => <div key={i} className={`h-2 flex-1 rounded-full ${i <= value ? "gradient-warm" : "bg-secondary"}`} />)}
      </div>
    </div>
  );
}

function Bullets({ title, items, tone }: { title: string; items: string[]; tone: "primary" | "muted" }) {
  return (
    <div>
      <div className={`text-xs uppercase tracking-wider mb-1.5 ${tone === "primary" ? "text-primary font-semibold" : "text-muted-foreground"}`}>{title}</div>
      <ul className="text-sm space-y-1">
        {items.map((i) => <li key={i} className="flex gap-2"><span className={tone === "primary" ? "text-primary" : "text-muted-foreground"}>•</span><span>{i}</span></li>)}
      </ul>
    </div>
  );
}
