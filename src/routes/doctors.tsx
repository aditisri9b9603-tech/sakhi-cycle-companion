import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useMemo, useState } from "react";
import { getProfile } from "@/lib/cycle";
import { Phone, MessageSquare, MapPin, Star, Clock, Search, Languages, Video, ChevronDown, GraduationCap, CalendarCheck, Trash2 } from "lucide-react";
import { BookingPanel } from "@/components/BookingPanel";
import { cancelAppointment, getAppointments, prettySlot, removeAppointment, type Appointment } from "@/lib/appointments";

export const Route = createFileRoute("/doctors")({
  head: () => ({ meta: [{ title: "24/7 Gynaecologists Near You — Sakhi Cycle" }, { name: "description", content: "Reach a verified gynaecologist any time, from trusted hospitals in your city." }] }),
  component: DoctorsPage,
});

type Doc = {
  name: string; clinic: string; city: string; experience: number; rating: number;
  languages: string[]; phone: string; fee: string; hours: string;
  emergency: boolean; online: boolean; specialty: string;
  qualifications: string; bio: string;
};

const DOCTORS: Doc[] = [
  // Mumbai
  { name: "Dr. Priya Sharma", clinic: "Apollo Cradle, Bandra", city: "Mumbai", experience: 14, rating: 4.9, languages: ["English", "Hindi", "Marathi"], phone: "+912226670000", fee: "₹1200", hours: "24×7", emergency: true, online: true, specialty: "PCOS & fertility",
    qualifications: "MBBS, MS (OBGY), FMAS", bio: "A warm, evidence-driven specialist who has helped over 3,000 women manage PCOS and irregular cycles through nutrition, hormone therapy, and lifestyle coaching. Trained at Seth GS Medical College, Mumbai; regular speaker at FOGSI conferences on adolescent gynaecology." },
  { name: "Dr. Anjali Mehra", clinic: "Fortis La Femme, Mulund", city: "Mumbai", experience: 22, rating: 4.8, languages: ["English", "Hindi", "Marathi"], phone: "+912266546565", fee: "₹1500", hours: "9am–9pm", emergency: false, online: true, specialty: "High-risk pregnancy",
    qualifications: "MBBS, MD (OBGY), DNB Fetal Medicine", bio: "One of Mumbai's most trusted names in high-risk pregnancy and prenatal ultrasound. Believes in gentle, informed birth — every consult includes time for questions and a written care plan you can share with family." },
  { name: "Dr. Meera Joshi", clinic: "Hinduja Hospital, Mahim", city: "Mumbai", experience: 19, rating: 4.7, languages: ["English", "Hindi", "Gujarati"], phone: "+912224447000", fee: "₹1300", hours: "24×7", emergency: true, online: false, specialty: "Endometriosis",
    qualifications: "MBBS, MD, Fellowship in Endometriosis (Germany)", bio: "Advanced laparoscopic surgeon focused on endometriosis and chronic pelvic pain. Runs a monthly support circle for patients — you'll leave her clinic feeling heard, not dismissed." },
  // Delhi
  { name: "Dr. Sunita Verma", clinic: "Max Smart, Saket", city: "Delhi", experience: 26, rating: 4.8, languages: ["English", "Hindi", "Punjabi"], phone: "+911140554055", fee: "₹1400", hours: "24×7", emergency: true, online: true, specialty: "Adolescent gynae",
    qualifications: "MBBS, MD (OBGY), FICOG", bio: "The go-to gynaecologist for teens and young adults in Delhi NCR. Known for making first-visit consultations feel safe and unhurried, and for demystifying period problems for parents too." },
  { name: "Dr. Radhika Kapoor", clinic: "Sir Ganga Ram, Rajinder Nagar", city: "Delhi", experience: 30, rating: 4.9, languages: ["English", "Hindi"], phone: "+911125750000", fee: "₹1800", hours: "10am–6pm", emergency: false, online: true, specialty: "Menopause care",
    qualifications: "MBBS, MD, Menopause Society Certified", bio: "Three decades of expertise in perimenopause, bone health, and hormone replacement therapy. Combines conventional medicine with yoga and Ayurvedic wellness for a whole-body approach." },
  { name: "Dr. Nisha Aggarwal", clinic: "BLK-Max, Pusa Road", city: "Delhi", experience: 17, rating: 4.7, languages: ["English", "Hindi"], phone: "+911130403040", fee: "₹1200", hours: "24×7", emergency: true, online: true, specialty: "IVF & infertility",
    qualifications: "MBBS, MD, Fellowship Reproductive Medicine", bio: "IVF specialist with a strong track record in unexplained infertility and recurrent pregnancy loss. Transparent about success rates and never pushes procedures you don't need." },
  // Bangalore
  { name: "Dr. Kavita Reddy", clinic: "Cloudnine, Jayanagar", city: "Bangalore", experience: 11, rating: 4.7, languages: ["English", "Kannada", "Telugu"], phone: "+918049699999", fee: "₹900", hours: "24×7", emergency: true, online: true, specialty: "Pregnancy & birth",
    qualifications: "MBBS, MS (OBGY), DNB", bio: "Champion of respectful, low-intervention birth. Runs prenatal classes with partners welcome, and is fiercely on your side for VBAC and water-birth choices where medically safe." },
  { name: "Dr. Lakshmi Rao", clinic: "Manipal, Old Airport Rd", city: "Bangalore", experience: 24, rating: 4.8, languages: ["English", "Kannada", "Tamil"], phone: "+918025023344", fee: "₹1100", hours: "9am–10pm", emergency: false, online: true, specialty: "PCOS",
    qualifications: "MBBS, MD (OBGY), Diabetes in Pregnancy Cert.", bio: "PCOS expert who treats hormones, insulin, and mental health together. Publishes a quarterly newsletter on new PCOS research in plain language — ask her clinic to add you to the list." },
  { name: "Dr. Smitha Iyer", clinic: "Aster CMI, Hebbal", city: "Bangalore", experience: 16, rating: 4.6, languages: ["English", "Hindi", "Malayalam"], phone: "+918043420100", fee: "₹1000", hours: "24×7", emergency: true, online: true, specialty: "Adolescent & teen",
    qualifications: "MBBS, MD (OBGY), Adolescent Health Cert.", bio: "Approachable specialist who works closely with schools on menstrual health workshops. Excellent at explaining vaccines (HPV, Gardasil) and first-period care to both teens and their parents." },
  // Hyderabad
  { name: "Dr. Padma Rani", clinic: "Rainbow Children's, Banjara Hills", city: "Hyderabad", experience: 20, rating: 4.9, languages: ["English", "Telugu", "Hindi"], phone: "+914044665555", fee: "₹800", hours: "24×7", emergency: true, online: true, specialty: "Maternity",
    qualifications: "MBBS, MD (OBGY), FICOG", bio: "Has delivered over 5,000 babies across two decades. Known for calm 3 am labour-room energy and unwavering support for feeding choices — breast, bottle, or both." },
  { name: "Dr. Anitha Krishnan", clinic: "Apollo, Jubilee Hills", city: "Hyderabad", experience: 18, rating: 4.7, languages: ["English", "Telugu", "Tamil"], phone: "+914023607777", fee: "₹1000", hours: "10am–8pm", emergency: false, online: true, specialty: "Hormonal disorders",
    qualifications: "MBBS, MD, DNB Reproductive Endocrinology", bio: "Deep expertise in thyroid, PCOS, and adrenal issues. Requests only the tests you actually need — no upselling — and walks you through every lab result personally." },
  // Pune
  { name: "Dr. Shruti Deshmukh", clinic: "Jehangir Hospital, Sassoon Rd", city: "Pune", experience: 15, rating: 4.7, languages: ["English", "Marathi", "Hindi"], phone: "+912066819999", fee: "₹900", hours: "24×7", emergency: true, online: true, specialty: "General gynae",
    qualifications: "MBBS, MS (OBGY)", bio: "Your friendly-neighbourhood gynae for annual check-ups, contraception counselling, and everyday period concerns. Runs a free WhatsApp help line for previous patients." },
  { name: "Dr. Pooja Kulkarni", clinic: "Sahyadri, Kothrud", city: "Pune", experience: 12, rating: 4.6, languages: ["English", "Marathi"], phone: "+912067213000", fee: "₹800", hours: "9am–9pm", emergency: false, online: true, specialty: "PCOD & lifestyle",
    qualifications: "MBBS, DGO, Certified Lifestyle Medicine", bio: "Believes food and movement are medicine. Pairs medical treatment with 1:1 nutrition plans for PCOD, insulin resistance, and thyroid — recipes included." },
  // Chennai
  { name: "Dr. Lakshmi Subramanian", clinic: "Apollo, Greams Road", city: "Chennai", experience: 23, rating: 4.8, languages: ["English", "Tamil"], phone: "+914428290200", fee: "₹1100", hours: "24×7", emergency: true, online: true, specialty: "High-risk pregnancy",
    qualifications: "MBBS, MD (OBGY), Fellowship Maternal-Fetal Medicine", bio: "Trusted for twin and high-risk pregnancies across Tamil Nadu. Coordinates with paediatricians and anaesthetists early so your birth plan has no surprises." },
  { name: "Dr. Revathi Murugan", clinic: "MIOT, Manapakkam", city: "Chennai", experience: 19, rating: 4.7, languages: ["English", "Tamil", "Malayalam"], phone: "+914422492288", fee: "₹950", hours: "10am–7pm", emergency: false, online: true, specialty: "Endometriosis",
    qualifications: "MBBS, MS, Advanced Laparoscopy Cert.", bio: "Minimal-access surgeon for endometriosis and fibroids. Specialises in fertility-preserving procedures and second opinions for surgery decisions." },
  // Kolkata
  { name: "Dr. Ananya Banerjee", clinic: "AMRI Dhakuria", city: "Kolkata", experience: 21, rating: 4.8, languages: ["English", "Bengali", "Hindi"], phone: "+913366800000", fee: "₹850", hours: "24×7", emergency: true, online: true, specialty: "Maternity & IVF",
    qualifications: "MBBS, MD (OBGY), Fellowship IVF (UK)", bio: "Combines maternity care with fertility support under one roof. Compassionate with pregnancy loss and known for follow-up calls the day after every difficult consultation." },
  { name: "Dr. Ritika Bansal", clinic: "Apollo Gleneagles, Salt Lake", city: "Kolkata", experience: 9, rating: 4.6, languages: ["English", "Hindi", "Bengali"], phone: "+913323203040", fee: "₹700", hours: "9am–9pm", emergency: false, online: true, specialty: "Adolescent gynae",
    qualifications: "MBBS, DNB (OBGY)", bio: "Younger practitioner who gets that Gen Z has different questions. Active on social media with reels about first periods, cramps, and PCOS myths — a favourite with college students." },
  // Ahmedabad
  { name: "Dr. Hetal Shah", clinic: "Sterling Hospital, Memnagar", city: "Ahmedabad", experience: 16, rating: 4.7, languages: ["English", "Gujarati", "Hindi"], phone: "+917940013000", fee: "₹800", hours: "24×7", emergency: true, online: true, specialty: "General gynae",
    qualifications: "MBBS, MD (OBGY), FICOG", bio: "Reliable, no-fuss gynaecologist for cycle irregularities, UTIs, and preventive check-ups. Runs a Saturday-morning free camp for women from rural Gujarat every month." },
];

const CITIES = Array.from(new Set(DOCTORS.map((d) => d.city))).sort();

function avatarUrl(name: string) {
  const seed = encodeURIComponent(name);
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=ffd5dc,ffb3c1,f8bbd0,fce4ec,fff0f5&backgroundType=gradientLinear&mouth=smile,default,twinkle&eyes=default,happy,wink&accessoriesProbability=30&facialHairProbability=0`;
}

function DoctorsPage() {
  const [city, setCity] = useState<string>("all");
  const [q, setQ] = useState("");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [booking, setBooking] = useState<Doc | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const p = getProfile();
    if (p?.city) {
      const match = CITIES.find((c) => c.toLowerCase() === p.city!.toLowerCase());
      if (match) setCity(match);
    }
    setAppointments(getAppointments());
    const sync = () => setAppointments(getAppointments());
    window.addEventListener("sakhi:appointments", sync);
    return () => window.removeEventListener("sakhi:appointments", sync);
  }, []);

  const filtered = useMemo(() => {
    return DOCTORS.filter((d) => {
      if (city !== "all" && d.city !== city) return false;
      if (emergencyOnly && !d.emergency) return false;
      if (onlineOnly && !d.online) return false;
      if (q) {
        const t = q.toLowerCase();
        return d.name.toLowerCase().includes(t) || d.clinic.toLowerCase().includes(t) || d.specialty.toLowerCase().includes(t) || d.languages.some((l) => l.toLowerCase().includes(t)) || d.bio.toLowerCase().includes(t);
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
          const key = d.phone + d.name;
          const isOpen = expanded === key;
          return (
            <div key={key} className="card-3d rounded-3xl p-5 flex gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-2xl overflow-hidden shadow-soft ring-2 ring-white bg-gradient-to-br from-rose-100 to-amber-100">
                <img src={avatarUrl(d.name)} alt={`Portrait of ${d.name}`} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-base sm:text-lg leading-tight truncate">{d.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground truncate">{d.clinic} · {d.city}</div>
                    <div className="text-[11px] text-primary mt-0.5">{d.specialty}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 inline-flex items-center gap-1"><GraduationCap className="h-3 w-3" />{d.qualifications}</div>
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

                <p className={`text-xs sm:text-sm text-foreground/80 leading-relaxed ${isOpen ? "" : "line-clamp-2"}`}>{d.bio}</p>
                <button onClick={() => setExpanded(isOpen ? null : key)} className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary hover:underline">
                  {isOpen ? "Show less" : "Read full bio"} <ChevronDown className={`h-3 w-3 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <button onClick={() => setBooking(d)} className="w-full mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-soft btn-3d">
                  <CalendarCheck className="h-4 w-4" /> Book appointment
                </button>
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

      <MyRequests items={appointments} />

      <p className="text-xs text-muted-foreground mt-6 text-center max-w-xl mx-auto">This is a curated directory for guidance — not an emergency line. For medical emergencies in India, call <strong>112</strong> or your nearest hospital directly.</p>

      {booking && (
        <BookingPanel doctor={booking} onClose={() => setBooking(null)} onBooked={() => setAppointments(getAppointments())} />
      )}
    </AppShell>
  );
}

function statusOf(a: Appointment): { label: string; cls: string } {
  if (a.status === "cancelled") return { label: "Cancelled", cls: "bg-secondary text-muted-foreground" };
  const when = new Date(`${a.date}T${a.slot}:00`);
  if (when.getTime() < Date.now()) return { label: "Completed", cls: "bg-accent/50 text-foreground" };
  return { label: "Requested · awaiting clinic", cls: "bg-amber-100 text-amber-800" };
}

function MyRequests({ items }: { items: Appointment[] }) {
  return (
    <section id="my-requests" className="card-3d rounded-3xl p-5 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl inline-flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-primary" /> My requests</h2>
        <span className="text-xs text-muted-foreground">{items.length} total</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No appointment requests yet. Tap “Book appointment” on any doctor to pick a date and time.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => {
            const s = statusOf(a);
            return (
              <li key={a.id} className="glass rounded-2xl p-3 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[180px]">
                  <div className="font-semibold text-sm">{a.doctorName}</div>
                  <div className="text-xs text-muted-foreground">{prettySlot(a.date, a.slot)} · {a.mode === "online" ? "Online" : "In-clinic"} · {a.clinic}</div>
                  {a.reason && <div className="text-xs text-foreground/70 mt-0.5 line-clamp-1">“{a.reason}”</div>}
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${s.cls}`}>{s.label}</span>
                {a.status !== "cancelled" && s.label !== "Completed" ? (
                  <button onClick={() => cancelAppointment(a.id)} className="text-xs px-3 py-1.5 rounded-full glass hover:bg-white">Cancel</button>
                ) : (
                  <button onClick={() => removeAppointment(a.id)} aria-label="Remove" className="h-8 w-8 rounded-full glass flex items-center justify-center hover:bg-white"><Trash2 className="h-3.5 w-3.5" /></button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
