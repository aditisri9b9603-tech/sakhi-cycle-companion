import { supabase } from "@/integrations/supabase/client";

export type DbAppt = {
  id: string; doctor_id: string; doctor_name: string; clinic: string; city: string; doctor_phone: string;
  appt_date: string; slot: string; mode: string; reason: string; patient_name: string; contact: string;
  status: "requested" | "confirmed" | "declined" | "cancelled"; doctor_note: string; created_at: string;
};

export async function listMyAppointments(): Promise<DbAppt[]> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const { data, error } = await supabase.from("appointments").select("*")
    .eq("patient_id", u.user.id).order("appt_date").order("slot");
  if (error) throw error;
  return data as DbAppt[];
}

export async function createAppointment(input: {
  doctor_id: string; doctor_name: string; clinic: string; city: string; doctor_phone: string;
  appt_date: string; slot: string; mode: "clinic" | "online"; reason: string; patient_name: string; contact: string;
}) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Please sign in to book.");
  const { data, error } = await supabase.from("appointments")
    .insert({ ...input, patient_id: u.user.id, status: "requested" }).select().single();
  if (error) throw error;
  return data as DbAppt;
}

export async function cancelMyAppointment(id: string) {
  const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
  if (error) throw error;
}

export async function deleteMyAppointment(id: string) {
  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) throw error;
}
