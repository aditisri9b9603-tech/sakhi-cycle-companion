import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { DOCTORS, findDoctor } from "@/lib/doctors";
import { claimDoctorProfile } from "@/lib/clinic.functions";
import { prettySlot } from "@/lib/appointments";
import { Check, X, Stethoscope, Video, Building2, Phone, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/clinic")({
  head: () => ({
    meta: [
      { title: "Clinic Dashboard — Sakhi Cycle" },
      { name: "description", content: "Doctors review, confirm or decline appointment requests from Sakhi Cycle patients." },
      { property: "og:title", content: "Clinic Dashboard — Sakhi Cycle" },
      { property: "og:description", content: "Confirm or decline your patients' appointment requests." },
    ],
  }),
  component: ClinicPage,
});

type Appt = {
  id: string; appt_date: string; slot: string; mode: string; reason: string;
  patient_name: string; contact: string; status: string; doctor_note: string; created_at: string;
};

function ClinicPage() {
  const qc = useQueryClient();
  const link = useQuery({
    queryKey: ["doctor-account"],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctor_accounts").select("doctor_id").maybeSingle();
      if (error) throw error;
      return data?.doctor_id ?? null;
    },
  });

  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    window.location.replace("/auth");
  }

  return (
    <AppShell>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display">Clinic <span className="gradient-text">dashboard</span></h1>
          <p className="text-muted-foreground text-sm">Review requests from Sakhi Cycle patients.</p>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass text-sm hover:bg-white"><LogOut className="h-4 w-4" /> Sign out</button>
      </div>
      {link.isLoading ? <div className="card-3d rounded-3xl p-8 text-center text-muted-foreground">Loading…</div>
        : link.data ? <Requests doctorId={link.data} />
        : <Claim onDone={() => qc.invalidateQueries({ queryKey: ["doctor-account"] })} />}
    </AppShell>
  );
}

function Claim({ onDone }: { onDone: () => void }) {
  const claim = useServerFn(claimDoctorProfile);
  const [doctorId, setDoctorId] = useState(DOCTORS[0].id);
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function go() {
    setBusy(true); setErr(null);
    try { await claim({ data: { doctorId, code } }); onDone(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong"); }
    setBusy(false);
  }
  return (
    <div className="max-w-lg mx-auto card-3d rounded-3xl p-6">
      <Stethoscope className="h-8 w-8 text-primary mb-2" />
      <h2 className="font-display text-xl mb-1">Link your doctor profile</h2>
      <p className="text-sm text-muted-foreground mb-4">Choose your listing and enter the clinic access code shared by the Sakhi team.</p>
      <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="w-full px-4 py-3 rounded-full bg-white/60 border border-border text-sm mb-3">
        {DOCTORS.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.clinic}</option>)}
      </select>
      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Clinic access code"
        className="w-full px-4 py-3 rounded-full bg-white/60 border border-border text-sm mb-3 outline-none focus:ring-2 focus:ring-primary/30" />
      <button onClick={go} disabled={busy || !code} className="w-full py-3 rounded-full gradient-warm text-white font-semibold shadow-soft btn-3d disabled:opacity-60">
        {busy ? "Linking…" : "Link profile"}
      </button>
      {err && <p className="text-sm text-destructive mt-3 text-center">{err}</p>}
    </div>
  );
}

const TABS = ["requested", "confirmed", "declined", "cancelled"] as const;

function Requests({ doctorId }: { doctorId: string }) {
  const doc = findDoctor(doctorId);
  const qc = useQueryClient();
  const [tab, setTab] = useState<(typeof TABS)[number]>("requested");
  const q = useQuery({
    queryKey: ["clinic-appts", doctorId],
    queryFn: async () => {
      const { data, error } = await supabase.from("appointments")
        .select("id, appt_date, slot, mode, reason, patient_name, contact, status, doctor_note, created_at")
        .eq("doctor_id", doctorId).order("appt_date").order("slot");
      if (error) throw error;
      return data as Appt[];
    },
  });
  async function setStatus(id: string, status: "confirmed" | "declined") {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) alert(error.message);
    qc.invalidateQueries({ queryKey: ["clinic-appts", doctorId] });
  }
  const items = (q.data ?? []).filter((a) => a.status === tab);
  const counts = Object.fromEntries(TABS.map((t) => [t, (q.data ?? []).filter((a) => a.status === t).length]));

  return (
    <>
      {doc && (
        <div className="card-3d rounded-3xl p-4 mb-4 flex items-center gap-4">
          <img src={doc.photo} alt={doc.name} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white" />
          <div className="min-w-0">
            <div className="font-semibold">{doc.name}</div>
            <div className="text-xs text-muted-foreground">{doc.clinic} · {doc.city} · {doc.hours}</div>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm capitalize btn-3d ${tab === t ? "bg-primary text-primary-foreground shadow-soft" : "glass"}`}>
            {t} · {counts[t]}
          </button>
        ))}
      </div>
      {q.isLoading ? <div className="card-3d rounded-3xl p-8 text-center text-muted-foreground">Loading requests…</div>
        : items.length === 0 ? <div className="card-3d rounded-3xl p-8 text-center text-muted-foreground">No {tab} requests.</div>
        : (
          <ul className="grid md:grid-cols-2 gap-3">
            {items.map((a) => (
              <li key={a.id} className="card-3d rounded-3xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{a.patient_name}</div>
                    <div className="text-xs text-muted-foreground">{prettySlot(a.appt_date, a.slot)}</div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full glass inline-flex items-center gap-1">
                    {a.mode === "online" ? <Video className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}{a.mode === "online" ? "Online" : "In-clinic"}
                  </span>
                </div>
                {a.reason && <p className="text-sm text-foreground/80 mt-2">“{a.reason}”</p>}
                {a.contact && <a href={a.contact.includes("@") ? `mailto:${a.contact}` : `tel:${a.contact}`} className="text-xs text-primary inline-flex items-center gap-1 mt-2"><Phone className="h-3 w-3" />{a.contact}</a>}
                {a.status === "requested" && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button onClick={() => setStatus(a.id, "confirmed")} className="inline-flex items-center justify-center gap-1.5 py-2 rounded-full gradient-warm text-white text-sm font-semibold btn-3d"><Check className="h-4 w-4" />Confirm</button>
                    <button onClick={() => setStatus(a.id, "declined")} className="inline-flex items-center justify-center gap-1.5 py-2 rounded-full glass text-sm font-semibold btn-3d"><X className="h-4 w-4" />Decline</button>
                  </div>
                )}
                {a.status === "confirmed" && (
                  <button onClick={() => setStatus(a.id, "declined")} className="mt-3 text-xs text-muted-foreground hover:underline">Decline instead</button>
                )}
              </li>
            ))}
          </ul>
        )}
    </>
  );
}
