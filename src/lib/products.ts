import { Leaf, ShieldCheck, Droplet, Recycle, type LucideIcon } from "lucide-react";

export type Category = "disposable" | "reusable";
export type Product = {
  id: string; category: Category; name: string; icon: LucideIcon; score: number; eco: number; cost: string;
  desc: string; pros: string[]; cons: string[]; how: string; videos: { id: string; title: string }[];
};
export const CATEGORIES: { key: "all" | Category | "insertable" | "external"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "disposable", label: "Disposable" },
  { key: "reusable", label: "Reusable & eco" },
  { key: "insertable", label: "Internal" },
  { key: "external", label: "External" },
];
const INTERNAL = ["tampon", "cup", "disc"];
export function matchesCategory(p: Product, c: string) {
  if (c === "all") return true;
  if (c === "insertable") return INTERNAL.includes(p.id);
  if (c === "external") return !INTERNAL.includes(p.id);
  return p.category === c;
}
export const TUTORIAL_SLUGS: Record<string, string> = { cup: "menstrual-cup", disc: "menstrual-disc", undies: "period-underwear" };

export const PRODUCTS: Product[] = [
  {
    id: "pad", category: "disposable" as const, name: "Sanitary Pads", icon: ShieldCheck, score: 5, eco: 2, cost: "₹1,800/yr",
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
    id: "tampon", category: "disposable" as const, name: "Tampons", icon: Droplet, score: 3, eco: 2, cost: "₹2,400/yr",
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
    id: "cup", category: "reusable" as const, name: "Menstrual Cup", icon: Recycle, score: 4, eco: 5, cost: "₹500 (5+ yrs)",
    desc: "Reusable silicone cup that collects (not absorbs) flow. Eco-friendly, up to 12 hours of wear.",
    pros: ["Reusable for ~5–10 years", "Up to 12 hours of wear", "Eco & wallet friendly", "No drying feeling"],
    cons: ["Initial learning curve", "Need clean hands & sink", "Boil-sterilize between cycles"],
    how: "Fold (C-fold or punch-down), relax pelvic muscles, insert and rotate to create a seal. Empty every 8–12 hours, rinse, reinsert. Sterilize in boiling water between cycles.",
    videos: [
      { id: "o9fPUfm-uYE", title: "How to use a menstrual cup — in-depth guide (AllMatters)" },
      { id: "nCU7eYkAFrg", title: "Insertion & folds — Lunette Cup" },
      { id: "bzKGIAOS27U", title: "Insert, remove & clean — Pixie Cup" },
    ],
  },
  {
    id: "disc", category: "reusable" as const, name: "Menstrual Disc", icon: Leaf, score: 3, eco: 4, cost: "₹600 (2+ yrs)",
    desc: "Flexible disc that sits in the vaginal fornix. Mess-free intimacy possible. Up to 12 hours.",
    pros: ["Up to 12 hours wear", "Sits higher — no pressure", "Mess-free during intimacy"],
    cons: ["Can be tricky to remove", "Higher learning curve"],
    how: "Pinch disc in half, insert and tuck behind the pubic bone. To remove, hook a finger under the rim and tilt out slowly over the toilet.",
    videos: [
      { id: "v7kG_KwV4NI", title: "How to insert a menstrual disc (Saalt)" },
      { id: "8OGAPwLQkxE", title: "How to remove a menstrual disc (Saalt)" },
      { id: "3Fy_CuMQK8I", title: "How to use a menstrual disc (Hello Period)" },
    ],
  },
  {
    id: "undies", category: "reusable" as const, name: "Period Underwear", icon: ShieldCheck, score: 5, eco: 5, cost: "₹3,000 (2+ yrs)",
    desc: "Absorbent underwear that replaces or backs up other products. Wash and reuse.",
    pros: ["Feels like regular underwear", "Reusable", "Great backup at night"],
    cons: ["Higher upfront cost", "Need a few pairs for the cycle", "Hand-wash recommended"],
    how: "Wear as regular underwear. Rinse in cold water after use, then machine wash on cold and line dry.",
    videos: [
      { id: "HtTe3sfsfB8", title: "How to use period underwear — full guide (AllMatters)" },
      { id: "JiX8lu6JS2U", title: "How to wash period underwear (Saalt)" },
      { id: "ygWmgN2XbI4", title: "How period underwear actually works" },
    ],
  },
];

