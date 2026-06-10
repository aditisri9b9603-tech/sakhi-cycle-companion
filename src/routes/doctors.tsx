import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useMemo, useState } from "react";
import { getProfile } from "@/lib/cycle";
import { Phone, MessageSquare, MapPin, Stethoscope, Star, Clock, Search, Languages, Video } from "lucide-react";

export const Route = createFileRoute("/doctors")({
  head: () => ({ meta: [{ title: "24/7 Gynaecologists Near You — Sakhi Cycle" }, { name: "description", content: "Reach a verified gynaecologist any time, from trusted hospitals in your city." }] }),
  component: DoctorsPage,
});

type Doc = {
  name: string; clinic: string; city: string; experience: number; rating: number;
  languages: string[]; phone: string; fee: string; hours: string;
  emergency: boolean; online: boolean; specialty: string;
};

const DOCTORS: Doc[] = [
  // Mumbai
  { name: "Dr. Priya Sharma", clinic: "Apollo Cradle, Bandra", city: "Mumbai", experience: 14, rating: 4.9, languages: ["English", "Hindi", "Marathi"], phone: "+912226670000", fee: "₹1200", hours: "24×7", emergency: true, online: true, specialty: "PCOS & fertility" },
  { name: "Dr. Anjali Mehra", clinic: "Fortis La Femme, Mulund", city: "Mumbai", experience: 22, rating: 4.8, languages: ["English", "Hindi", "Marathi"], phone: "+912266546565", fee: "₹1500", hours: "9am–9pm", emergency: false, online: true, specialty: "High-risk pregnancy" },
  { name: "Dr. Meera Joshi", clinic: "Hinduja Hospital, Mahim", city: "Mumbai", experience: 19, rating: 4.7, languages: ["English", "Hindi", "Gujarati"], phone: "+912224447000", fee: "₹1300", hours: "24×7", emergency: true, online: false, specialty: "Endometriosis" },
  // Delhi
  { name: "Dr. Sunita Verma", clinic: "Max Smart, Saket", city: "Delhi", experience: 26, rating: 4.8, languages: ["English", "Hindi", "Punjabi"], phone: "+911140554055", fee: "₹1400", hours: "24×7", emergency: true, online: true, specialty: "Adolescent gynae" },
  { name: "Dr. Radhika Kapoor", clinic: "Sir Ganga Ram, Rajinder Nagar", city: "Delhi", experience: 30, rating: 4.9, languages: ["English", "Hindi"], phone: "+911125750000", fee: "₹1800", hours: "10am–6pm", emergency: false, online: true, specialty: "Menopause care" },
  { name: "Dr. Nisha Aggarwal", clinic: "BLK-Max, Pusa Road", city: "Delhi", experience: 17, rating: 4.7, languages: ["English", "Hindi"], phone: "+911130403040", fee: "₹1200", hours: "24×7", emergency: true, online: true, specialty: "IVF & infertility" },
  // Bangalore
  { name: "Dr. Kavita Reddy", clinic: "Cloudnine, Jayanagar", city: "Bangalore", experience: 11, rating: 4.7, languages: ["English", "Kannada", "Telugu"], phone: "+918049699999", fee: "₹900", hours: "24×7", emergency: true, online: true, specialty: "Pregnancy & birth" },
  { name: "Dr. Lakshmi Rao", clinic: "Manipal, Old Airport Rd", city: "Bangalore", experience: 24, rating: 4.8, languages: ["English", "Kannada", "Tamil"], phone: "+918025023344", fee: "₹1100", hours: "9am–10pm", emergency: false, online: true, specialty: "PCOS" },
  { name: "Dr. Smitha Iyer", clinic: "Aster CMI, Hebbal", city: "Bangalore", experience: 16, rating: 4.6, languages: ["English", "Hindi", "Malayalam"], phone: "+918043420100", fee: "₹1000", hours: "24×7", emergency: true, online: true, specialty: "Adolescent & teen" },
  // Hyderabad
  { name: "Dr. Padma Rani", clinic: "Rainbow Children's, Banjara Hills", city: "Hyderabad", experience: 20, rating: 4.9, languages: ["English", "Telugu", "Hindi"], phone: "+914044665555", fee: "₹800", hours: "24×7", emergency: true, online: true, specialty: "Maternity" },
  { name: "Dr. Anitha Krishnan", clinic: "Apollo, Jubilee Hills", city: "Hyderabad", experience: 18, rating: 4.7, languages: ["English", "Telugu", "Tamil"], phone: "+914023607777", fee: "₹1000", hours: "10am–8pm", emergency: false, online: true, specialty: "Hormonal disorders" },
  // Pune
  { name: "Dr. Shruti Deshmukh", clinic: "Jehangir Hospital, Sassoon Rd", city: "Pune", experience: 15, rating: 4.7, languages: ["English", "Marathi", "Hindi"], phone: "+912066819999", fee: "₹900", hours: "24×7", emergency: true, online: true, specialty: "General gynae" },
  { name: "Dr. Pooja Kulkarni", clinic: "Sahyadri, Kothrud", city: "Pune", experience: 12, rating: 4.6, languages: ["English", "Marathi"], phone: "+912067213000", fee: "₹800", hours: "9am–9pm", emergency: false, online: true, specialty: "PCOD & lifestyle" },
  // Chennai
  { name: "Dr. Lakshmi Subramanian", clinic: "Apollo, Greams Road", city: "Chennai", experience: 23, rating: 4.8, languages: ["English", "Tamil"], phone: "+914428290200", fee: "₹1100", hours: "24×7", emergency: true, online: true, specialty: "High-risk pregnancy" },
  { name: "Dr. Revathi Murugan", clinic: "MIOT, Manapakkam", city: "Chennai", experience: 19, rating: 4.7, languages: ["English", "Tamil", "Malayalam"], phone: "+914422492288", fee: "₹950", hours: "10am–7pm", emergency: false, online: true, specialty: "Endometriosis" },
  // Kolkata
  { name: "Dr. Ananya Banerjee", clinic: "AMRI Dhakuria", city: "Kolkata", experience: 21, rating: 4.8, languages: ["English", "Bengali", "Hindi"], phone: "+913366800000", fee: "₹850", hours: "24×7", emergency: true, online: true, specialty: "Maternity & IVF" },
  { name: "Dr. Ritika Bansal", clinic: "Apollo Gleneagles, Salt Lake", city: "Kolkata", experience: 9, rating: 4.6, languages: ["English", "Hindi", "Bengali"], phone: "+913323203040", fee: "₹700", hours: "9am–9pm", emergency: false, online: true, specialty: "Adolescent gynae" },
  // Ahmedabad
  { name: "Dr. Hetal Shah", clinic: "Sterling Hospital, Memnagar", city: "Ahmedabad", experience: 16, rating: 4.7, languages: ["English", "Gujarati", "Hindi"], phone: "+917940013000", fee: "₹800", hours: "24×7", emergency: true, online: true, specialty: "General gynae" },
];

const CITIES = Array.from(new Set(DOCTORS.map((d) => d.city))).sort();

function DoctorsPage() {
  const [city, setCity] = useState<string>("all");
  const [q, setQ] = useState("");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);

  useEffect(() => {
    const p = getProfile();
    if (p?.city) {
      const match = CITIES.find((c) => c.toLowerCase() === p.city!.toLowerCase());
      if (match) setCity(match);
    }
  }, []);

  const filtered = useMemo(() => {
    return DOCTORS.filter((d) => {
      if (city !== "all" && d.city !== city) return false;
      if (emergencyOnly && !d.emergency) return false;
      if (onlineOnly && !d.online) return false;
      if (q) {
        const t = q.toLowerCase();
        return d.name.toLowerCase().includes(t) || d.clinic.toLowerCase().includes(t) || d.specialty.toLowerCase().includes(t) || d.languages.some((l) => l.toLowerCase().includes(t));
      }
      return true;
    });
  }, [city, q, emergencyOnly, onlineOnly]);

  return (
    <AppShell>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display mb-1">Trusted <span className="gradient-text">gynaecologists</span></h1>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm sm:text-base"><MapPin className="h-4 w-4" /> Verified specialists across India</p>
        </div>
        <div className="glass rounded-full px-4 py-2 text-xs text-muted-foreground inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> 24×7 line average response: 8 mins
        </div>
      </div>

      <div className="card-3d rounded-3xl p-4 mb-5">
        <div className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, specialty, language…" className="w-full pl-9 pr-3 py-2.5 rounded-full bg-white/60 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2.5 rounded-full bg-white/60 border border-border text-sm outline-none">
            <option value="all">All cities</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-full glass text-xs sm:text-sm cursor-pointer">
            <input type="checkbox" checked={emergencyOnly} onChange={(e) => setEmergencyOnly(e.target.checked)} className="accent-primary" /> 24×7
          </label>
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-full glass text-xs sm:text-sm cursor-pointer">
            <input type="checkbox" checked={onlineOnly} onChange={(e) => setOnlineOnly(e.target.checked)} className="accent-primary" /> Online
          </label>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="card-3d rounded-3xl p-8 text-center text-muted-foreground">No doctors match these filters. Try widening your search.</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((d) => {
          const tel = d.phone;
          const wa = d.phone.replace(/[^0-9]/g, "");
          const intro = encodeURIComponent(`Hi Dr. ${d.name.split(" ").slice(-1)[0]}, I'd like to book a consultation via Sakhi Cycle.`);
          const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.clinic + " " + d.city)}`;
          return (
            <div key={d.phone + d.name} className="card-3d rounded-3xl p-5 flex gap-4">
              <div className="h-14 w-14 shrink-0 rounded-2xl gradient-warm flex items-center justify-center text-white shadow-soft">
                <Stethoscope className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-base sm:text-lg leading-tight truncate">{d.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground truncate">{d.clinic} · {d.city}</div>
                    <div className="text-[11px] text-primary mt-0.5">{d.specialty}</div>
                  </div>
                  {d.emergency && (
                    <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">24×7</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 my-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-full bg-secondary inline-flex items-center gap-1"><Star className="h-3 w-3 text-amber-500 fill-amber-500" />{d.rating}</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary">{d.experience} yrs</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary">{d.fee}</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary inline-flex items-center gap-1"><Clock className="h-3 w-3" />{d.hours}</span>
                  {d.online && <span className="px-2 py-0.5 rounded-full bg-accent/40 inline-flex items-center gap-1"><Video className="h-3 w-3" />Online</span>}
                  <span className="px-2 py-0.5 rounded-full bg-accent/40 inline-flex items-center gap-1"><Languages className="h-3 w-3" />{d.languages.join(", ")}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <a href={`tel:${tel}`} className="inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-full gradient-warm text-white text-xs font-semibold shadow-soft btn-3d">
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>
                  <a href={`https://wa.me/${wa}?text=${intro}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-full bg-emerald-500 text-white text-xs font-semibold shadow-soft btn-3d">
                    <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                  <a href={maps} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-full glass text-xs font-semibold hover:bg-white transition">
                    <MapPin className="h-3.5 w-3.5" /> Maps
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-6 text-center max-w-xl mx-auto">This is a curated directory for guidance — not an emergency line. For medical emergencies in India, call <strong>112</strong> or your nearest hospital directly.</p>
    </AppShell>
  );
}
