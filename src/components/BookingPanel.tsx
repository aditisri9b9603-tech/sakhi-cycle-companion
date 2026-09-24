import { useEffect, useMemo, useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { buildAvailability, prettySlot, saveAppointment, type Appointment } from "@/lib/appointments";
import { getProfile } from "@/lib/cycle";
import { CalendarDays, Check, X, Video, Building2, MessageSquare, Phone } from "lucide-react";

type Props = {
  doctor: { name: string; clinic: string; city: string; phone: string; hours: string; online: boolean; fee: string };
  onClose: () => void;
  onBooked: (a: Appointment) => void;
};

export function BookingPanel({ doctor, onClose, onBooked }: Props) {
  const days = useMemo(() => buildAvailability(doctor.hours, doctor.phone, 31), [doctor.hours, doctor.phone]);
  const firstOpen = days.find((d) => !d.closed) ?? days[0];
  const [date, setDate] = useState(firstOpen.date);
  const [slot, setSlot] = useState<string | null>(null);
  const [mode, setMode] = useState<"clinic" | "online">(doctor.online ? "online" : "clinic");
  const [reason, setReason] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [done, setDone] = useState<Appointment | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (p?.nickname) setName(p.nickname);
  }, []);

  const day = days.find((d) => d.date === date)!;

  function submit() {
    if (!slot) return;
    const appt: Appointment = {
      id: `${Date.now()}`,
      doctorName: doctor.name,
      clinic: doctor.clinic,
      city: doctor.city,
      phone: doctor.phone,
      date,
      slot,
      mode,
      reason: reason.trim(),
      name: name.trim() || "Sakhi user",
      contact: contact.trim(),
      createdAt: new Date().toISOString(),
      status: "requested",
    };
    saveAppointment(appt);
    setDone(appt);
    onBooked(appt);
  }

  const waMsg = done
    ? encodeURIComponent(
        `Hi ${done.doctorName}, I'd like to request an appointment via Sakhi Cycle.\n\n` +
          `Preferred: ${prettySlot(done.date, done.slot)}\nMode: ${done.mode === "online" ? "Online consult" : "In-clinic"}\n` +
          `Name: ${done.name}${done.contact ? `\nContact: ${done.contact}` : ""}${done.reason ? `\nReason: ${done.reason}` : ""}`,
      )
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl card-3d p-5 animate-scale-in">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Request appointment</div>
            <h3 className="font-display text-lg sm:text-xl truncate">{doctor.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{doctor.clinic} · {doctor.city} · {doctor.fee}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="shrink-0 h-9 w-9 rounded-full glass flex items-center justify-center hover:bg-white transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-4">
            <div className="mx-auto h-14 w-14 rounded-full gradient-warm text-white flex items-center justify-center shadow-soft animate-scale-in">
              <Check className="h-7 w-7" />
            </div>
            <h4 className="font-display text-lg mt-3">Request saved 🌷</h4>
            <p className="text-sm text-muted-foreground mt-1">{prettySlot(done.date, done.slot)} · {done.mode === "online" ? "Online consult" : "In-clinic"}</p>
            <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">Send it to the clinic to confirm — they reply on WhatsApp, usually within a few hours.</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <a href={`https://wa.me/${doctor.phone.replace(/\D/g, "")}?text=${waMsg}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-semibold shadow-soft btn-3d">
                <MessageSquare className="h-4 w-4" /> Send on WhatsApp
              </a>
              <a href={`tel:${doctor.phone}`} className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full gradient-warm text-white text-sm font-semibold shadow-soft btn-3d">
                <Phone className="h-4 w-4" /> Call clinic
              </a>
            </div>
            <button onClick={onClose} className="mt-3 text-xs text-primary hover:underline">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <CalendarDays className="h-3.5 w-3.5" /> Next 30 days · consults {doctor.hours} · greyed days are full or closed
            </div>

            <div className="glass rounded-2xl flex justify-center">
              <Calendar
                mode="single"
                selected={parseISO(date)}
                onSelect={(d) => { if (d) { setDate(format(d, "yyyy-MM-dd")); setSlot(null); } }}
                disabled={(d) => { const k = format(d, "yyyy-MM-dd"); const x = days.find((y) => y.date === k); return !x || x.closed; }}
                startMonth={new Date()}
                endMonth={addDays(new Date(), 30)}
                className="p-3 pointer-events-auto bg-transparent"
              />
            </div>
            <div className="text-xs font-medium mt-2">{format(parseISO(date), "EEEE, d MMMM")} · {day.slots.length} slots open</div>

            <div className="mt-3">
              {day.closed ? (
                <p className="text-sm text-muted-foreground glass rounded-2xl p-4 text-center">No slots left this day. Try another date, or call the 24×7 line.</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                  {day.slots.map((t) => (
                    <button key={t} onClick={() => setSlot(t)}
                      className={`py-2 rounded-xl text-xs font-medium transition btn-3d ${slot === t ? "bg-primary text-primary-foreground shadow-soft" : "glass hover:bg-white"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button onClick={() => setMode("clinic")} className={`inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm transition btn-3d ${mode === "clinic" ? "bg-primary text-primary-foreground" : "glass"}`}>
                <Building2 className="h-4 w-4" /> In-clinic
              </button>
              <button onClick={() => doctor.online && setMode("online")} disabled={!doctor.online}
                className={`inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm transition btn-3d ${mode === "online" ? "bg-primary text-primary-foreground" : "glass"} ${!doctor.online ? "opacity-50" : ""}`}>
                <Video className="h-4 w-4" /> Online
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 mt-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-full bg-white/60 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone or email"
                className="w-full px-4 py-2.5 rounded-full bg-white/60 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} placeholder="What would you like help with? (optional)"
              className="w-full mt-2 px-4 py-2.5 rounded-2xl bg-white/60 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none" />

            <button onClick={submit} disabled={!slot}
              className="w-full mt-3 py-3 rounded-full gradient-warm text-white font-semibold shadow-soft btn-3d disabled:opacity-50 disabled:cursor-not-allowed">
              {slot ? `Request ${prettySlot(date, slot)}` : "Pick a time slot"}
            </button>
            <p className="text-[11px] text-muted-foreground mt-2 text-center">Requests are saved on your device and confirmed by the clinic over WhatsApp or phone.</p>
          </>
        )}
      </div>
    </div>
  );
}
