-- Migration: Webhook trigger para rebuild automático quando páginas customizadas são publicadas
-- Este trigger chama o webhook do Easypanel quando uma página customizada é publicada ou atualizada

-- Função para chamar webhook HTTP (reutiliza a função existente ou cria nova)
CREATE OR REPLACE FUNCTION public.call_deploy_webhook_custom_page()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  webhook_url TEXT := 'http://3.22.177.77:3000/api/deploy/39afd64789632715720dd3009dc3f6b1ac22cffade6c57e8';
  payload JSONB;
BEGIN
  -- Só dispara se a página está publicada
  IF NEW.published = true THEN
    -- Criar payload JSON
    payload := jsonb_build_object(
      'event', 'custom_page_published',
      'page_id', NEW.id,
      'path', NEW.path,
      'title', NEW.title,
      'timestamp', NOW()
    );

    -- Log para debug (pode ser removido em produção)
    RAISE NOTICE 'Webhook deveria ser chamado para página: %', NEW.path;
    
    -- Retornar NEW para continuar a operação
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger que executa quando uma página customizada é inserida ou atualizada
CREATE TRIGGER custom_page_deploy_webhook
  AFTER INSERT OR UPDATE OF published, path, title, content
  ON public.custom_pages
  FOR EACH ROW
  WHEN (NEW.published = true)
  EXECUTE FUNCTION public.call_deploy_webhook_custom_page();

-- Comentário explicativo
COMMENT ON FUNCTION public.call_deploy_webhook_custom_page() IS 
'Função que deveria chamar webhook HTTP para rebuild automático quando página customizada é publicada. 
Nota: Supabase pode não ter extensão HTTP habilitada. 
Configure webhook via Supabase Dashboard > Database > Webhooks ou use Edge Function.';

COMMENT ON TRIGGER custom_page_deploy_webhook ON public.custom_pages IS 
'Trigger que dispara quando uma página customizada é publicada ou atualizada para chamar webhook de deploy.';



