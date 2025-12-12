-- Migration: Webhook trigger para rebuild automático quando posts são publicados
-- Este trigger chama o webhook do Easypanel quando um post do blog é publicado ou atualizado

-- Função para chamar webhook HTTP
CREATE OR REPLACE FUNCTION public.call_deploy_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  webhook_url TEXT := 'http://3.22.177.77:3000/api/deploy/39afd64789632715720dd3009dc3f6b1ac22cffade6c57e8';
  payload JSONB;
  response_status INT;
BEGIN
  -- Só dispara se o post está publicado
  IF NEW.published = true THEN
    -- Criar payload JSON
    payload := jsonb_build_object(
      'event', 'blog_post_published',
      'post_id', NEW.id,
      'slug', NEW.slug,
      'title', NEW.title,
      'timestamp', NOW()
    );

    -- Chamar webhook usando pg_net (se disponível) ou http extension
    -- Nota: Supabase pode não ter essas extensões habilitadas por padrão
    -- Alternativa: usar Edge Function ou configurar webhook via Supabase Dashboard
    
    -- Log para debug (pode ser removido em produção)
    RAISE NOTICE 'Webhook deveria ser chamado para post: %', NEW.slug;
    
    -- Retornar NEW para continuar a operação
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger que executa quando um post é inserido ou atualizado
CREATE TRIGGER blog_post_deploy_webhook
  AFTER INSERT OR UPDATE OF published, slug, title, content
  ON public.blog_posts
  FOR EACH ROW
  WHEN (NEW.published = true)
  EXECUTE FUNCTION public.call_deploy_webhook();

-- Comentário explicativo
COMMENT ON FUNCTION public.call_deploy_webhook() IS 
'Função que deveria chamar webhook HTTP para rebuild automático. 
Nota: Supabase pode não ter extensão HTTP habilitada. 
Configure webhook via Supabase Dashboard > Database > Webhooks ou use Edge Function.';

COMMENT ON TRIGGER blog_post_deploy_webhook ON public.blog_posts IS 
'Trigger que dispara quando um post é publicado ou atualizado para chamar webhook de deploy.';

