import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { getProfile } from "@/lib/cycle";
import { Phone, MessageSquare, MapPin, Stethoscope, Star, Clock } from "lucide-react";

export const Route = createFileRoute("/doctors")({
  head: () => ({ meta: [{ title: "24/7 Gynaecologists Near You — Sakhi Cycle" }, { name: "description", content: "Reach a verified gynaecologist any time, from hospitals near you." }] }),
  component: DoctorsPage,
});

type Doc = { name: string; hospital: string; experience: number; rating: number; languages: string[]; phone: string; available: boolean; distanceKm: number };

const DOCTORS: Doc[] = [
  { name: "Dr. Priya Sharma", hospital: "Apollo Cradle", experience: 14, rating: 4.9, languages: ["English", "Hindi"], phone: "+911234567890", available: true, distanceKm: 1.4 },
  { name: "Dr. Anjali Mehra", hospital: "Fortis La Femme", experience: 22, rating: 4.8, languages: ["English", "Hindi", "Marathi"], phone: "+911234567891", available: true, distanceKm: 2.1 },
  { name: "Dr. Kavita Reddy", hospital: "Cloudnine Hospital", experience: 11, rating: 4.7, languages: ["English", "Telugu", "Tamil"], phone: "+911234567892", available: false, distanceKm: 3.8 },
  { name: "Dr. Neha Iyer", hospital: "Manipal Women's Centre", experience: 18, rating: 4.9, languages: ["English", "Tamil", "Malayalam"], phone: "+911234567893", available: true, distanceKm: 4.5 },
  { name: "Dr. Sunita Verma", hospital: "Max Healthcare", experience: 26, rating: 4.6, languages: ["English", "Hindi", "Punjabi"], phone: "+911234567894", available: true, distanceKm: 5.2 },
  { name: "Dr. Ritika Bansal", hospital: "Rainbow Women & Children's", experience: 9, rating: 4.8, languages: ["English", "Hindi", "Bengali"], phone: "+911234567895", available: true, distanceKm: 6.0 },
];

function DoctorsPage() {
  const [city, setCity] = useState("your area");
  useEffect(() => { const p = getProfile(); if (p?.city) setCity(p.city); }, []);
  return (
    <AppShell>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display mb-1">24/7 gynaec, <span className="gradient-text">near you</span></h1>
          <p className="text-muted-foreground flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Showing specialists around <strong className="text-foreground capitalize">{city}</strong></p>
        </div>
        <div className="glass rounded-full px-4 py-2 text-xs text-muted-foreground inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> Average response time: 8 mins
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {DOCTORS.map((d) => (
          <div key={d.phone} className="glass rounded-2xl p-5 flex gap-4 hover:shadow-glow transition">
            <div className="h-14 w-14 shrink-0 rounded-2xl gradient-warm flex items-center justify-center text-white shadow-soft">
              <Stethoscope className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-lg leading-tight">{d.name}</div>
                  <div className="text-sm text-muted-foreground">{d.hospital} · {d.distanceKm} km</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${d.available ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                  {d.available ? "● Available now" : "○ Offline"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 my-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-secondary inline-flex items-center gap-1"><Star className="h-3 w-3 text-amber-500 fill-amber-500" />{d.rating}</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary">{d.experience} yrs</span>
                {d.languages.map((l) => <span key={l} className="px-2 py-0.5 rounded-full bg-accent/40">{l}</span>)}
              </div>
              <div className="flex gap-2 mt-2">
                <a href={`tel:${d.phone}`} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full gradient-warm text-white text-sm font-semibold shadow-soft hover:scale-105 transition">
                  <Phone className="h-3.5 w-3.5" /> Call
                </a>
                <a href={`https://wa.me/${d.phone.replace(/[^0-9]/g, "")}`} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full glass text-sm font-semibold hover:bg-white transition">
                  <MessageSquare className="h-3.5 w-3.5" /> Message
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-6 text-center">Demo listings. In production, this is wired to a verified hospital partner network and live location.</p>
    </AppShell>
  );
}
