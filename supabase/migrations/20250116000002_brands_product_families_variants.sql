-- Create brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product_families table
CREATE TABLE IF NOT EXISTS public.product_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product_variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  family_id UUID REFERENCES public.product_families(id) ON DELETE SET NULL,
  specifications JSONB,
  price DECIMAL(10, 2),
  image_url TEXT,
  gallery_urls TEXT[],
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON public.brands(active);
CREATE INDEX IF NOT EXISTS idx_product_families_slug ON public.product_families(slug);
CREATE INDEX IF NOT EXISTS idx_product_families_active ON public.product_families(active);
CREATE INDEX IF NOT EXISTS idx_product_variants_slug ON public.product_variants(slug);
CREATE INDEX IF NOT EXISTS idx_product_variants_family_id ON public.product_variants(family_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_active ON public.product_variants(active);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_families_updated_at BEFORE UPDATE ON public.product_families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

