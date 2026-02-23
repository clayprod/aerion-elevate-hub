-- Migration: Desabilitar temporariamente o trigger de webhook do blog
-- Este trigger está causando timeout (erro 57014) ao atualizar posts
-- O trigger está sendo executado mesmo quando não deveria, causando lentidão

-- Desabilitar o trigger temporariamente
DROP TRIGGER IF EXISTS blog_post_deploy_webhook ON public.blog_posts;

-- Também vamos otimizar a função para não fazer nada pesado (caso seja reabilitada no futuro)
CREATE OR REPLACE FUNCTION public.call_deploy_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Função desabilitada - apenas retorna sem fazer nada
  -- Isso evita qualquer overhead de processamento
  RETURN NEW;
END;
$$;

-- Comentário explicativo
COMMENT ON FUNCTION public.call_deploy_webhook() IS 
'Função de webhook desabilitada devido a problemas de timeout.
O trigger foi removido para evitar erros 500 ao atualizar posts.
Para reabilitar no futuro, use uma Edge Function ou webhook externo.';

