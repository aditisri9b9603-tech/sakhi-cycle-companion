import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DOCTORS } from "@/lib/doctors";

export const claimDoctorProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ doctorId: z.string().min(1).max(80), code: z.string().min(1).max(80) }).parse(d))
  .handler(async ({ data, context }) => {
    const expected = process.env["CLINIC_ACCESS_CODE"];
    if (!expected || data.code.trim() !== expected) throw new Error("That clinic access code isn't right.");
    if (!DOCTORS.some((d) => d.id === data.doctorId)) throw new Error("Unknown doctor profile.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: taken } = await supabaseAdmin.from("doctor_accounts").select("user_id").eq("doctor_id", data.doctorId).maybeSingle();
    if (taken && taken.user_id !== context.userId) throw new Error("This doctor profile is already linked to another account.");
    const { error } = await supabaseAdmin.from("doctor_accounts").upsert({ user_id: context.userId, doctor_id: data.doctorId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
