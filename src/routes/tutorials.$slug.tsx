import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PRODUCTS, TUTORIAL_SLUGS } from "@/lib/products";
import { ArrowLeft, Play } from "lucide-react";

function findBySlug(slug: string) {
  const id = Object.entries(TUTORIAL_SLUGS).find(([, s]) => s === slug)?.[0];
  return PRODUCTS.find((p) => p.id === id);
}

export const Route = createFileRoute("/tutorials/$slug")({
  loader: ({ params }) => {
    const p = findBySlug(params.slug);
    if (!p) throw notFound();
    return { id: p.id };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? PRODUCTS.find((x) => x.id === loaderData.id) : undefined;
    if (!p) return { meta: [{ title: "Tutorial not found — Sakhi Cycle" }, { name: "robots", content: "noindex" }] };
    const title = `${p.name} Tutorials — How to Use | Sakhi Cycle`;
    const description = `Step-by-step video guides for the ${p.name.toLowerCase()}: insertion, removal, cleaning, pros and cons.`;
    return { meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" },
    ] };
  },
  notFoundComponent: TutorialNotFound,
  component: TutorialPage,
});

function TutorialNotFound() {
  return <AppShell><p className="text-center py-10">Tutorial not found. <Link to="/products" className="text-primary underline">Back to products</Link></p></AppShell>;
}

function TutorialPage() {
  const { id } = Route.useLoaderData();
  const p = PRODUCTS.find((x) => x.id === id)!;
  const [video, setVideo] = useState(p.videos[0].id);
  return (
    <AppShell>
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-3"><ArrowLeft className="h-4 w-4" /> All products</Link>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-display mb-2">{p.name} <span className="gradient-text">tutorials</span></h1>
      <p className="text-muted-foreground mb-6 max-w-2xl text-sm sm:text-base">{p.desc}</p>
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4 md:gap-6">
        <div className="card-3d rounded-3xl p-4">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-soft bg-foreground">
            <iframe key={video} src={`https://www.youtube.com/embed/${video}?rel=0&modestbranding=1`} title={`${p.name} tutorial`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin" className="w-full h-full border-0" />
          </div>
          <a href={`https://www.youtube.com/watch?v=${video}`} target="_blank" rel="noreferrer" className="block mt-2 text-right text-xs text-primary hover:underline">Open on YouTube ↗</a>
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">How to use</div>
            <p className="text-sm leading-relaxed">{p.how}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="card-3d rounded-3xl p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">All videos ({p.videos.length})</div>
            <div className="space-y-2">
              {p.videos.map((v, i) => (
                <button key={v.id} onClick={() => setVideo(v.id)} className={`w-full text-left flex items-center gap-3 p-2 rounded-2xl transition ${video === v.id ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}>
                  <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt="" loading="lazy" className="h-12 w-20 rounded-lg object-cover shrink-0" />
                  <span className="text-sm flex-1 min-w-0"><span className="text-[10px] text-muted-foreground block">Video {i + 1}</span>{v.title}</span>
                  <Play className="h-4 w-4 shrink-0" />
                </button>
              ))}
            </div>
          </div>
          <div className="card-3d rounded-3xl p-4 grid grid-cols-2 gap-3 text-sm">
            <div><div className="text-xs text-primary font-semibold mb-1">Benefits</div><ul className="space-y-1">{p.pros.map((x) => <li key={x}>• {x}</li>)}</ul></div>
            <div><div className="text-xs text-muted-foreground mb-1">Things to know</div><ul className="space-y-1">{p.cons.map((x) => <li key={x}>• {x}</li>)}</ul></div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
