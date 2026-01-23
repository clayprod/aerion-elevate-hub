-- Migration: Desabilitar temporariamente o trigger de webhook do blog
-- Este trigger pode estar causando erro 500 ao atualizar posts
-- Execute esta migration para desabilitar o trigger temporariamente para testes

-- Desabilitar o trigger temporariamente
DROP TRIGGER IF EXISTS blog_post_deploy_webhook ON public.blog_posts;

-- Comentário explicativo
COMMENT ON FUNCTION public.call_deploy_webhook() IS 
'Função de webhook desabilitada temporariamente. 
Para reabilitar, execute: 
CREATE TRIGGER blog_post_deploy_webhook
  AFTER INSERT OR UPDATE OF published, slug, title, content
  ON public.blog_posts
  FOR EACH ROW
  WHEN (NEW.published = true)
  EXECUTE FUNCTION public.call_deploy_webhook();';

