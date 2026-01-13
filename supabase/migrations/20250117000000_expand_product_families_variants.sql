-- Expand product_families table to include all necessary fields
ALTER TABLE public.product_families
ADD COLUMN IF NOT EXISTS youtube_video_id TEXT,
ADD COLUMN IF NOT EXISTS fallback_image TEXT,
ADD COLUMN IF NOT EXISTS brochure TEXT,
ADD COLUMN IF NOT EXISTS key_features TEXT[],
ADD COLUMN IF NOT EXISTS technical_data JSONB,
ADD COLUMN IF NOT EXISTS components TEXT[],
ADD COLUMN IF NOT EXISTS accessories_included TEXT[],
ADD COLUMN IF NOT EXISTS videos JSONB,
ADD COLUMN IF NOT EXISTS photo_gallery JSONB,
ADD COLUMN IF NOT EXISTS gallery TEXT[],
ADD COLUMN IF NOT EXISTS lifestyle_images TEXT[],
ADD COLUMN IF NOT EXISTS accessories TEXT[],
ADD COLUMN IF NOT EXISTS applications JSONB,
ADD COLUMN IF NOT EXISTS product_codes JSONB;

-- Expand product_variants table to include all necessary fields
ALTER TABLE public.product_variants
ADD COLUMN IF NOT EXISTS image_path TEXT,
ADD COLUMN IF NOT EXISTS specs JSONB;

-- Add comment to clarify structure
COMMENT ON COLUMN public.product_families.technical_data IS 'Structured technical data: cadastral, commercial, logistics';
COMMENT ON COLUMN public.product_families.videos IS 'Array of video objects with title, description, youtubeId, thumbnail';
COMMENT ON COLUMN public.product_families.photo_gallery IS 'Object with product, lifestyle, details arrays';
COMMENT ON COLUMN public.product_families.applications IS 'Array of application objects with title, description, image, link';
COMMENT ON COLUMN public.product_families.product_codes IS 'Object with sku, ean, ncm';
COMMENT ON COLUMN public.product_variants.specs IS 'Nested object structure: Record<string, Record<string, string>>';
COMMENT ON COLUMN public.product_variants.image_path IS 'Path to folder with numbered images';






