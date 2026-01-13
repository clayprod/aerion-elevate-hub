-- Fix: Adicionar política para permitir que admins listem arquivos do bucket
-- Isso é necessário para a sincronização da biblioteca de mídia funcionar corretamente

-- Política para admins listarem arquivos (SELECT já existe para público, mas esta garante acesso completo para admins)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can list files'
  ) THEN
    CREATE POLICY "Admins can list files"
    ON storage.objects FOR SELECT
    USING (
      bucket_id = 'public-images' AND
      (SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
      ))
    );
  END IF;
END $$;

-- Garantir que a tabela media_library existe (caso não exista)
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  title TEXT,
  alt_text TEXT,
  folder TEXT DEFAULT 'general',
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela media_library (se ainda não estiver habilitado)
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Política para todos visualizarem a biblioteca de mídia
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'media_library' 
    AND policyname = 'Media library is viewable by everyone'
  ) THEN
    CREATE POLICY "Media library is viewable by everyone"
    ON public.media_library
    FOR SELECT
    USING (true);
  END IF;
END $$;

-- Política para admins gerenciarem a biblioteca de mídia
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'media_library' 
    AND policyname = 'Admins can manage media library'
  ) THEN
    CREATE POLICY "Admins can manage media library"
    ON public.media_library
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

