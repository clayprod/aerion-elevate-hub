-- Create custom_pages table for CMS dynamic pages
CREATE TABLE public.custom_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 200),
  slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  path TEXT UNIQUE NOT NULL CHECK (
    path ~ '^/[a-z0-9\-/]+$' AND 
    path NOT LIKE '/admin%' AND 
    path NOT LIKE '/auth%' AND
    path NOT LIKE '/api%' AND
    char_length(path) <= 255
  ),
  content TEXT NOT NULL CHECK (char_length(content) <= 1000000),
  excerpt TEXT CHECK (char_length(excerpt) <= 500),
  featured_image TEXT CHECK (featured_image ~ '^https?://'),
  gallery_images TEXT[] DEFAULT '{}',
  meta_title TEXT CHECK (char_length(meta_title) <= 70),
  meta_description TEXT CHECK (char_length(meta_description) <= 160),
  meta_keywords TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  template TEXT DEFAULT 'default',
  order_index INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT valid_path CHECK (
    -- Apenas bloquear rotas protegidas (admin, auth, blog)
    -- Permitir sobrescrever outras rotas estáticas via CMS
    path NOT LIKE '/admin%' AND
    path NOT LIKE '/auth%' AND
    path NOT LIKE '/blog%' AND
    path NOT LIKE '/api%'
  )
);

-- Create indexes for performance
CREATE INDEX idx_custom_pages_path ON public.custom_pages(path) WHERE published = true;
CREATE INDEX idx_custom_pages_slug ON public.custom_pages(slug);
CREATE INDEX idx_custom_pages_published ON public.custom_pages(published, published_at DESC);
CREATE INDEX idx_custom_pages_created_at ON public.custom_pages(created_at DESC);

-- Enable RLS
ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Público pode ler apenas páginas publicadas
CREATE POLICY "Published pages are viewable by everyone"
ON public.custom_pages
FOR SELECT
USING (published = true);

-- Admins podem ver tudo
CREATE POLICY "Admins can view all pages"
ON public.custom_pages
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Apenas admins podem inserir/atualizar/deletar
CREATE POLICY "Admins can manage pages"
ON public.custom_pages
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_custom_pages_updated_at
  BEFORE UPDATE ON public.custom_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-generate slug from title if not provided
CREATE OR REPLACE FUNCTION public.generate_slug_from_title()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only generate slug if it's empty or null
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    -- Normalize title: remove accents, lowercase, replace spaces with hyphens
    NEW.slug := lower(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            translate(NEW.title, 'áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ', 'aaaaaeeeeiiiioooouuuucAAAAAEEEEIIIIOOOOUUUUC'),
            '[^a-zA-Z0-9\s-]', '', 'g'
          ),
          '\s+', '-', 'g'
        ),
        '-+', '-', 'g'
      )
    );
    -- Remove leading/trailing hyphens
    NEW.slug := trim(both '-' from NEW.slug);
  END IF;
  
  -- Update published_at when published changes to true
  IF NEW.published = true AND (OLD.published IS NULL OR OLD.published = false) AND NEW.published_at IS NULL THEN
    NEW.published_at := now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-generate slug
CREATE TRIGGER auto_generate_slug_custom_pages
  BEFORE INSERT OR UPDATE ON public.custom_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_slug_from_title();

