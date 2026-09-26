CREATE TABLE public.doctor_accounts (
  user_id uuid PRIMARY KEY,
  doctor_id text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.doctor_accounts TO authenticated;
GRANT ALL ON public.doctor_accounts TO service_role;
ALTER TABLE public.doctor_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY doctor_accounts_select_own ON public.doctor_accounts FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  doctor_id text NOT NULL,
  doctor_name text NOT NULL,
  clinic text NOT NULL,
  city text NOT NULL,
  doctor_phone text NOT NULL DEFAULT '',
  appt_date date NOT NULL,
  slot text NOT NULL,
  mode text NOT NULL DEFAULT 'clinic',
  reason text NOT NULL DEFAULT '',
  patient_name text NOT NULL DEFAULT 'Sakhi user',
  contact text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'requested',
  doctor_note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT appointments_status_chk CHECK (status IN ('requested','confirmed','declined','cancelled')),
  CONSTRAINT appointments_mode_chk CHECK (mode IN ('clinic','online')),
  CONSTRAINT appointments_len_chk CHECK (char_length(reason) <= 500 AND char_length(patient_name) <= 80 AND char_length(contact) <= 120 AND char_length(doctor_note) <= 300)
);
CREATE INDEX appointments_doctor_idx ON public.appointments (doctor_id, appt_date);
CREATE INDEX appointments_patient_idx ON public.appointments (patient_id, appt_date);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.my_doctor_id()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT doctor_id FROM public.doctor_accounts WHERE user_id = auth.uid() $$;
REVOKE EXECUTE ON FUNCTION public.my_doctor_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_doctor_id() TO authenticated;

CREATE POLICY appt_patient_select ON public.appointments FOR SELECT TO authenticated USING (auth.uid() = patient_id);
CREATE POLICY appt_doctor_select ON public.appointments FOR SELECT TO authenticated USING (doctor_id = public.my_doctor_id());
CREATE POLICY appt_patient_insert ON public.appointments FOR INSERT TO authenticated WITH CHECK (auth.uid() = patient_id AND status = 'requested');
CREATE POLICY appt_patient_update ON public.appointments FOR UPDATE TO authenticated USING (auth.uid() = patient_id) WITH CHECK (auth.uid() = patient_id);
CREATE POLICY appt_doctor_update ON public.appointments FOR UPDATE TO authenticated USING (doctor_id = public.my_doctor_id()) WITH CHECK (doctor_id = public.my_doctor_id());
CREATE POLICY appt_patient_delete ON public.appointments FOR DELETE TO authenticated USING (auth.uid() = patient_id AND status IN ('cancelled','declined'));

CREATE OR REPLACE FUNCTION public.appointments_guard()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $$
DECLARE is_doc boolean := (OLD.doctor_id = public.my_doctor_id());
BEGIN
  IF NEW.patient_id <> OLD.patient_id OR NEW.doctor_id <> OLD.doctor_id OR NEW.appt_date <> OLD.appt_date OR NEW.slot <> OLD.slot THEN
    RAISE EXCEPTION 'Appointment details cannot be changed';
  END IF;
  IF is_doc THEN
    IF NEW.status NOT IN ('confirmed','declined') THEN RAISE EXCEPTION 'Doctors can only confirm or decline'; END IF;
    IF NEW.reason <> OLD.reason OR NEW.patient_name <> OLD.patient_name OR NEW.contact <> OLD.contact THEN RAISE EXCEPTION 'Not allowed'; END IF;
  ELSE
    IF NEW.status <> 'cancelled' OR NEW.doctor_note <> OLD.doctor_note THEN RAISE EXCEPTION 'Patients can only cancel'; END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER appointments_guard_trg BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.appointments_guard();