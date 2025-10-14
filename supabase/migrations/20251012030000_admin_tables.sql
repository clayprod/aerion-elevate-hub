-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  features TEXT[],
  specifications JSONB,
  image_url TEXT,
  gallery_urls TEXT[],
  category TEXT,
  price DECIMAL(10, 2),
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Active products viewable by everyone
CREATE POLICY "Active products are viewable by everyone"
ON public.products
FOR SELECT
USING (active = true);

-- Admins can view all products
CREATE POLICY "Admins can view all products"
ON public.products
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage products
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create solutions table
CREATE TABLE public.solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  benefits TEXT[],
  use_cases TEXT[],
  image_url TEXT,
  icon TEXT,
  category TEXT,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on solutions
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;

-- Active solutions viewable by everyone
CREATE POLICY "Active solutions are viewable by everyone"
ON public.solutions
FOR SELECT
USING (active = true);

-- Admins can view all solutions
CREATE POLICY "Admins can view all solutions"
ON public.solutions
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage solutions
CREATE POLICY "Admins can insert solutions"
ON public.solutions
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update solutions"
ON public.solutions
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete solutions"
ON public.solutions
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create site_content table for dynamic content
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Everyone can read site content
CREATE POLICY "Site content is viewable by everyone"
ON public.site_content
FOR SELECT
USING (true);

-- Admins can manage site content
CREATE POLICY "Admins can manage site content"
ON public.site_content
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create site_settings table
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read site settings
CREATE POLICY "Site settings are viewable by everyone"
ON public.site_settings
FOR SELECT
USING (true);

-- Admins can manage site settings
CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_solutions_updated_at
  BEFORE UPDATE ON public.solutions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site content sections
INSERT INTO public.site_content (section, content) VALUES
  ('hero', '{"title": "Bem-vindo à AERION", "subtitle": "Soluções inovadoras em tecnologia", "cta_text": "Saiba Mais", "cta_link": "/sobre"}'),
  ('about', '{"title": "Sobre Nós", "description": "A AERION é líder em soluções tecnológicas inovadoras."}'),
  ('contact', '{"email": "contato@aerion.com", "phone": "+55 11 99999-9999", "address": "São Paulo, SP"}');

-- Insert default site settings
INSERT INTO public.site_settings (key, value, category, description) VALUES
  ('site_name', 'AERION Elevate Hub', 'general', 'Nome do site'),
  ('site_tagline', 'Elevando o futuro com tecnologia', 'general', 'Slogan do site'),
  ('contact_email', 'contato@aerion.com', 'contact', 'Email de contato'),
  ('contact_phone', '+55 11 99999-9999', 'contact', 'Telefone de contato'),
  ('facebook_url', '', 'social', 'URL do Facebook'),
  ('instagram_url', '', 'social', 'URL do Instagram'),
  ('linkedin_url', '', 'social', 'URL do LinkedIn'),
  ('twitter_url', '', 'social', 'URL do Twitter'),
  ('meta_description', 'AERION - Soluções inovadoras em tecnologia', 'seo', 'Meta description'),
  ('meta_keywords', 'tecnologia, inovação, soluções', 'seo', 'Meta keywords');

