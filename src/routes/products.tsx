import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";
import { Leaf, ShieldCheck, Droplet, Recycle, Play } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "Period Products — Sakhi Cycle" }, { name: "description", content: "Pads, tampons, menstrual cups and discs: how to use them, pros and cons, and curated videos." }] }),
  component: ProductsPage,
});

const PRODUCTS = [
  {
    id: "pad", name: "Sanitary Pads", icon: ShieldCheck, score: 5, eco: 2, cost: "₹1,800/yr",
    desc: "External absorbent pads that stick to underwear. The most common starting choice — easy, no insertion required.",
    pros: ["No insertion needed", "Easy for beginners", "Available everywhere", "Good for overnight"],
    cons: ["Can feel bulky", "Disposable waste (unless cloth)", "May shift during sport"],
    how: "Peel backing, stick adhesive side to underwear, change every 4–6 hours. Wrap used pad in wrapper and dispose in bin (never flush).",
    videos: [
      { id: "kmWbOC8Fbb0", title: "How to use a sanitary pad — quick guide" },
      { id: "_GnIQTOouHE", title: "Pads 101 — beginner walkthrough" },
    ],
  },
  {
    id: "tampon", name: "Tampons", icon: Droplet, score: 3, eco: 2, cost: "₹2,400/yr",
    desc: "Cylindrical absorbent inserts placed inside the vagina. Discreet and good for active days.",
    pros: ["Invisible under clothes", "Great for swimming & sport", "Compact to carry"],
    cons: ["Insertion learning curve", "Must change every 4–8 hours (TSS risk)", "Not for overnight"],
    how: "Wash hands. Relax in a comfortable position. Insert applicator at a slight backward angle, push plunger fully, remove applicator. The string stays outside. Change every 4–8 hours, never over 8.",
    videos: [
      { id: "kmWbOC8Fbb0", title: "How to use a tampon (beginner guide)" },
      { id: "_GnIQTOouHE", title: "Tampon insertion — first time tips" },
    ],
  },
  {
    id: "cup", name: "Menstrual Cup", icon: Recycle, score: 4, eco: 5, cost: "₹500 (5+ yrs)",
    desc: "Reusable silicone cup that collects (not absorbs) flow. Eco-friendly, up to 12 hours of wear.",
    pros: ["Reusable for ~5–10 years", "Up to 12 hours of wear", "Eco & wallet friendly", "No drying feeling"],
    cons: ["Initial learning curve", "Need clean hands & sink", "Boil-sterilize between cycles"],
    how: "Fold (C-fold or punch-down), relax pelvic muscles, insert and rotate to create a seal. Empty every 8–12 hours, rinse, reinsert. Sterilize in boiling water between cycles.",
    videos: [
      { id: "Z2HxYZlNlNs", title: "Menstrual cup — folds & insertion" },
      { id: "yRQqQCnflKQ", title: "How to remove a menstrual cup" },
    ],
  },
  {
    id: "disc", name: "Menstrual Disc", icon: Leaf, score: 3, eco: 4, cost: "₹600 (2+ yrs)",
    desc: "Flexible disc that sits in the vaginal fornix. Mess-free intimacy possible. Up to 12 hours.",
    pros: ["Up to 12 hours wear", "Sits higher — no pressure", "Mess-free during intimacy"],
    cons: ["Can be tricky to remove", "Higher learning curve"],
    how: "Pinch disc in half, insert and tuck behind the pubic bone. To remove, hook a finger under the rim and tilt out slowly over the toilet.",
    videos: [
      { id: "rJ74JBfu_8M", title: "How to use a menstrual disc" },
    ],
  },
  {
    id: "undies", name: "Period Underwear", icon: ShieldCheck, score: 5, eco: 5, cost: "₹3,000 (2+ yrs)",
    desc: "Absorbent underwear that replaces or backs up other products. Wash and reuse.",
    pros: ["Feels like regular underwear", "Reusable", "Great backup at night"],
    cons: ["Higher upfront cost", "Need a few pairs for the cycle", "Hand-wash recommended"],
    how: "Wear as regular underwear. Rinse in cold water after use, then machine wash on cold and line dry.",
    videos: [
      { id: "F-J1XF4XJjI", title: "Period underwear — honest review" },
    ],
  },
];

function ProductsPage() {
  const [active, setActive] = useState(PRODUCTS[0].id);
  const product = PRODUCTS.find((p) => p.id === active)!;
  const [video, setVideo] = useState(product.videos[0].id);

  function pickProduct(id: string) {
    setActive(id);
    const p = PRODUCTS.find((x) => x.id === id)!;
    setVideo(p.videos[0].id);
  }

  return (
    <AppShell>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-display mb-2">Find your <span className="gradient-text">comfort</span></h1>
      <p className="text-muted-foreground mb-6 max-w-2xl text-sm sm:text-base">Every body is different. Compare options, watch how-to videos, and pick what feels right for you — no judgment.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {PRODUCTS.map((p) => (
          <button key={p.id} onClick={() => pickProduct(p.id)} className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition btn-3d ${
            active === p.id ? "bg-primary text-primary-foreground shadow-soft" : "glass hover:bg-white"
          }`}>
            <p.icon className="h-4 w-4" />{p.name}
          </button>
        ))}
      </div>

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

        <div className="card-3d rounded-3xl p-4 animate-float" style={{ animationDelay: "1s" }}>
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
