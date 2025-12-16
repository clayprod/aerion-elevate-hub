-- Expand solutions table schema to support rich content structure
-- Add JSONB columns for hero section, benefits, drones, applications, use cases, and theme colors

ALTER TABLE public.solutions
ADD COLUMN IF NOT EXISTS hero_section JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS drones JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS applications JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS use_cases JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS theme_colors JSONB DEFAULT NULL;

-- Add comment explaining the structure
COMMENT ON COLUMN public.solutions.hero_section IS 'Hero section data: {badge_text, badge_icon, title, description, cta_primary_text, cta_secondary_text, hero_image_url, gradient_colors: [from, to]}';
COMMENT ON COLUMN public.solutions.benefits IS 'Array of benefits: [{icon: string, title: string, description: string}]';
COMMENT ON COLUMN public.solutions.drones IS 'Array of drones: [{name, variant, image, features: [], applications: [], bestFor}]';
COMMENT ON COLUMN public.solutions.applications IS 'Array of applications: [{title, description, image, features: [], results: []}]';
COMMENT ON COLUMN public.solutions.use_cases IS 'Array of use cases: [{title, description, icon: string, benefits: []}]';
COMMENT ON COLUMN public.solutions.theme_colors IS 'Theme colors: {primary, secondary, badge_bg, badge_text}';

