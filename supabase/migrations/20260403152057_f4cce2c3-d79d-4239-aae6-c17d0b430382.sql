-- Site settings table for editable content like logo and photographer name
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site settings" ON public.site_settings FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Insert default values
INSERT INTO public.site_settings (key, value) VALUES
  ('photographer_name', 'G.Mohan'),
  ('logo_url', ''),
  ('about_description', 'I''m the founder of Creative Photography, a passionate photographer dedicated to capturing life''s most precious moments. With over 8 years of experience in wedding and event photography, I bring a unique blend of artistic vision and technical expertise to every shoot.'),
  ('about_description_2', 'From the joyful tears at a wedding ceremony to the laughter at a birthday party, I believe every event deserves to be documented beautifully. My goal is to create timeless photographs that you''ll treasure for generations.');

-- Services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Camera',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Insert default services
INSERT INTO public.services (title, description, icon, display_order) VALUES
  ('Wedding Photography', 'Capture every magical moment of your special day with cinematic storytelling and artistic composition.', 'Heart', 1),
  ('Birthday & Celebrations', 'From first birthdays to milestone celebrations, we make every moment count with vibrant, joyful photography.', 'Cake', 2),
  ('Corporate Events', 'Professional event coverage for conferences, product launches, and corporate gatherings.', 'Building2', 3),
  ('Portrait Sessions', 'Individual, couple, or family portraits that capture your personality and create lasting memories.', 'Users', 4),
  ('Pre-Wedding Shoots', 'Romantic and creative pre-wedding photography sessions at stunning locations.', 'Camera', 5),
  ('Baby Showers & Naming', 'Tender moments captured with care during baby showers, naming ceremonies, and newborn sessions.', 'Baby', 6);

-- Service packages table
CREATE TABLE public.service_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name text NOT NULL,
  price text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view packages" ON public.service_packages FOR SELECT USING (true);
CREATE POLICY "Admins can insert packages" ON public.service_packages FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update packages" ON public.service_packages FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete packages" ON public.service_packages FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Add update triggers
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_packages_updated_at BEFORE UPDATE ON public.service_packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add category column to projects to link with services
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES public.services(id) ON DELETE SET NULL;