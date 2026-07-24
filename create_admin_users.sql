CREATE TABLE public.admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all actions for authenticated users only" ON public.admin_users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.admin_users
  FOR SELECT
  TO public
  USING (true);

INSERT INTO public.admin_users (name, email) VALUES ('Administrator', 'admin@lp3i.ac.id');
