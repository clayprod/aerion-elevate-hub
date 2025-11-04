-- CMS Complete Migration - Sistema Admin WordPress-style
-- Data: 2025-01-22
-- Objetivo: Criar todas as tabelas necessárias para CMS completo
-- Estratégia: IF NOT EXISTS para evitar conflitos, RLS habilitado

BEGIN;

-- =============================================
-- 1. BRANDS - Marcas (Autel + futuras)
-- =============================================
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  website TEXT,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on brands
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Active brands viewable by everyone
CREATE POLICY "Active brands are viewable by everyone"
ON public.brands
FOR SELECT
USING (active = true);

-- Admins can view all brands
CREATE POLICY "Admins can view all brands"
ON public.brands
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage brands
CREATE POLICY "Admins can insert brands"
ON public.brands
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update brands"
ON public.brands
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete brands"
ON public.brands
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 2. PRODUCT_FAMILIES - Famílias de produtos
-- =============================================
CREATE TABLE IF NOT EXISTS public.product_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  youtube_video_id TEXT,
  brochure_url TEXT,
  fallback_image TEXT,
  key_features TEXT[],
  technical_data JSONB,
  components TEXT[],
  accessories_included TEXT[],
  applications JSONB,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on product_families
ALTER TABLE public.product_families ENABLE ROW LEVEL SECURITY;

-- Active product families viewable by everyone
CREATE POLICY "Active product families are viewable by everyone"
ON public.product_families
FOR SELECT
USING (active = true);

-- Admins can view all product families
CREATE POLICY "Admins can view all product families"
ON public.product_families
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage product families
CREATE POLICY "Admins can insert product families"
ON public.product_families
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product families"
ON public.product_families
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product families"
ON public.product_families
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 3. PRODUCT_VARIANTS - Variantes de produtos
-- =============================================
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.product_families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  image_path TEXT,
  specs JSONB,
  images JSONB,
  videos JSONB,
  photo_gallery JSONB,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(family_id, slug)
);

-- Enable RLS on product_variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Active product variants viewable by everyone
CREATE POLICY "Active product variants are viewable by everyone"
ON public.product_variants
FOR SELECT
USING (active = true);

-- Admins can view all product variants
CREATE POLICY "Admins can view all product variants"
ON public.product_variants
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage product variants
CREATE POLICY "Admins can insert product variants"
ON public.product_variants
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product variants"
ON public.product_variants
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product variants"
ON public.product_variants
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 4. VERTICALS - Verticais/Soluções
-- =============================================
CREATE TABLE IF NOT EXISTS public.verticals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  icon TEXT,
  image_url TEXT,
  benefits TEXT[],
  use_cases TEXT[],
  gallery_urls TEXT[],
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on verticals
ALTER TABLE public.verticals ENABLE ROW LEVEL SECURITY;

-- Active verticals viewable by everyone
CREATE POLICY "Active verticals are viewable by everyone"
ON public.verticals
FOR SELECT
USING (active = true);

-- Admins can view all verticals
CREATE POLICY "Admins can view all verticals"
ON public.verticals
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage verticals
CREATE POLICY "Admins can insert verticals"
ON public.verticals
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update verticals"
ON public.verticals
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete verticals"
ON public.verticals
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 5. PAGE_SECTIONS - Seções/blocos das páginas
-- =============================================
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  section_type TEXT NOT NULL,
  content JSONB NOT NULL,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on page_sections
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Active page sections viewable by everyone
CREATE POLICY "Active page sections are viewable by everyone"
ON public.page_sections
FOR SELECT
USING (active = true);

-- Admins can view all page sections
CREATE POLICY "Admins can view all page sections"
ON public.page_sections
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage page sections
CREATE POLICY "Admins can insert page sections"
ON public.page_sections
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update page sections"
ON public.page_sections
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete page sections"
ON public.page_sections
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 6. CUSTOM_PAGES - Páginas personalizadas
-- =============================================
CREATE TABLE IF NOT EXISTS public.custom_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on custom_pages
ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

-- Published custom pages viewable by everyone
CREATE POLICY "Published custom pages are viewable by everyone"
ON public.custom_pages
FOR SELECT
USING (published = true);

-- Admins can view all custom pages
CREATE POLICY "Admins can view all custom pages"
ON public.custom_pages
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage custom pages
CREATE POLICY "Admins can insert custom pages"
ON public.custom_pages
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update custom pages"
ON public.custom_pages
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete custom pages"
ON public.custom_pages
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 7. MEDIA_LIBRARY - Biblioteca de mídia
-- =============================================
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document', 'other')),
  title TEXT,
  alt_text TEXT,
  folder TEXT DEFAULT 'general',
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on media_library
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Everyone can read media library
CREATE POLICY "Media library is viewable by everyone"
ON public.media_library
FOR SELECT
USING (true);

-- Admins can manage media library
CREATE POLICY "Admins can manage media library"
ON public.media_library
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 8. TRIGGERS para updated_at
-- =============================================

-- Trigger for brands
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for product_families
CREATE TRIGGER update_product_families_updated_at
  BEFORE UPDATE ON public.product_families
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for product_variants
CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for verticals
CREATE TRIGGER update_verticals_updated_at
  BEFORE UPDATE ON public.verticals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for page_sections
CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for custom_pages
CREATE TRIGGER update_custom_pages_updated_at
  BEFORE UPDATE ON public.custom_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for media_library
CREATE TRIGGER update_media_library_updated_at
  BEFORE UPDATE ON public.media_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 9. ÍNDICES para performance
-- =============================================

-- Índices para brands
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON public.brands(active);
CREATE INDEX IF NOT EXISTS idx_brands_order ON public.brands(order_index);

-- Índices para product_families
CREATE INDEX IF NOT EXISTS idx_product_families_brand_id ON public.product_families(brand_id);
CREATE INDEX IF NOT EXISTS idx_product_families_slug ON public.product_families(slug);
CREATE INDEX IF NOT EXISTS idx_product_families_active ON public.product_families(active);
CREATE INDEX IF NOT EXISTS idx_product_families_featured ON public.product_families(featured);

-- Índices para product_variants
CREATE INDEX IF NOT EXISTS idx_product_variants_family_id ON public.product_variants(family_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_slug ON public.product_variants(family_id, slug);
CREATE INDEX IF NOT EXISTS idx_product_variants_active ON public.product_variants(active);

-- Índices para verticals
CREATE INDEX IF NOT EXISTS idx_verticals_slug ON public.verticals(slug);
CREATE INDEX IF NOT EXISTS idx_verticals_active ON public.verticals(active);
CREATE INDEX IF NOT EXISTS idx_verticals_featured ON public.verticals(featured);

-- Índices para page_sections
CREATE INDEX IF NOT EXISTS idx_page_sections_page_slug ON public.page_sections(page_slug);
CREATE INDEX IF NOT EXISTS idx_page_sections_order ON public.page_sections(page_slug, order_index);
CREATE INDEX IF NOT EXISTS idx_page_sections_active ON public.page_sections(active);

-- Índices para custom_pages
CREATE INDEX IF NOT EXISTS idx_custom_pages_slug ON public.custom_pages(slug);
CREATE INDEX IF NOT EXISTS idx_custom_pages_published ON public.custom_pages(published);
CREATE INDEX IF NOT EXISTS idx_custom_pages_featured ON public.custom_pages(featured);

-- Índices para media_library
CREATE INDEX IF NOT EXISTS idx_media_library_file_type ON public.media_library(file_type);
CREATE INDEX IF NOT EXISTS idx_media_library_folder ON public.media_library(folder);
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_by ON public.media_library(uploaded_by);

-- =============================================
-- 10. DADOS INICIAIS
-- =============================================

-- Inserir marca Autel inicial
INSERT INTO public.brands (name, slug, description, website, active) 
VALUES (
  'Autel Robotics',
  'autel-robotics',
  'Líder global em tecnologia de drones profissionais',
  'https://autelrobotics.com',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Inserir algumas verticais iniciais
INSERT INTO public.verticals (name, slug, description, short_description, active, order_index) VALUES
  ('Construção Civil', 'construcao', 'Soluções para construção civil e topografia', 'Drones para mapeamento e monitoramento de obras', true, 1),
  ('Inspeção Industrial', 'industrial', 'Inspeção de equipamentos e infraestrutura', 'Tecnologia térmica para inspeções industriais', true, 2),
  ('Segurança Pública', 'seguranca', 'Operações de segurança e emergência', 'Drones para patrulhamento e resgate', true, 3),
  ('Resgate e Emergências', 'resgate', 'Operações de busca e salvamento', 'Tecnologia para situações de emergência', true, 4)
ON CONFLICT (slug) DO NOTHING;

COMMIT;

-- Log de sucesso
DO $$
BEGIN
  RAISE NOTICE 'Migration CMS Complete executada com sucesso!';
  RAISE NOTICE 'Tabelas criadas: brands, product_families, product_variants, verticals, page_sections, custom_pages, media_library';
  RAISE NOTICE 'RLS habilitado em todas as tabelas';
  RAISE NOTICE 'Índices criados para performance';
  RAISE NOTICE 'Dados iniciais inseridos (Autel + 4 verticais)';
END $$;

