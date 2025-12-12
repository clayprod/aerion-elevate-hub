-- Fix RLS policies for custom_pages table
-- This migration fixes the 406 error by ensuring policies work correctly for both authenticated and unauthenticated users

-- Drop existing policies
DROP POLICY IF EXISTS "Published pages are viewable by everyone" ON public.custom_pages;
DROP POLICY IF EXISTS "Admins can view all pages" ON public.custom_pages;
DROP POLICY IF EXISTS "Admins can manage pages" ON public.custom_pages;
DROP POLICY IF EXISTS "Admins can insert pages" ON public.custom_pages;
DROP POLICY IF EXISTS "Admins can update pages" ON public.custom_pages;
DROP POLICY IF EXISTS "Admins can delete pages" ON public.custom_pages;

-- Create a helper function to safely check admin role (handles NULL auth.uid())
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE public.has_role(auth.uid(), 'admin')
  END
$$;

-- Recreate policies with proper NULL checks
-- Public can read published pages (works for unauthenticated users)
CREATE POLICY "Published pages are viewable by everyone"
ON public.custom_pages
FOR SELECT
USING (published = true);

-- Admins can view all pages (including unpublished ones)
CREATE POLICY "Admins can view all pages"
ON public.custom_pages
FOR SELECT
USING (public.is_admin());

-- Admins can insert pages
CREATE POLICY "Admins can insert pages"
ON public.custom_pages
FOR INSERT
WITH CHECK (public.is_admin());

-- Admins can update pages
CREATE POLICY "Admins can update pages"
ON public.custom_pages
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Admins can delete pages
CREATE POLICY "Admins can delete pages"
ON public.custom_pages
FOR DELETE
USING (public.is_admin());

