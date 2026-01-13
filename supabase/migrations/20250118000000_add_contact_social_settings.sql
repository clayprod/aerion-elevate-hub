-- Adicionar campos de contato e redes sociais faltantes na tabela site_settings
-- Esta migração adiciona todos os campos que estão hardcoded nas páginas de contato e rodapé

-- Inserir ou atualizar configurações de contato
INSERT INTO public.site_settings (key, value, category, description) VALUES
  ('contact_phone', '+55 11 5102-4229', 'contact', 'Telefone de contato principal'),
  ('contact_whatsapp', '+55 11 93466-8839', 'contact', 'WhatsApp comercial'),
  ('contact_email', 'comercial@aerion.com.br', 'contact', 'Email de contato comercial'),
  ('contact_address_line1', 'Edifício Itamaracá', 'contact', 'Linha 1 do endereço'),
  ('contact_address_line2', 'R. Quintana 887, Cj. 111, 11º Andar', 'contact', 'Linha 2 do endereço'),
  ('contact_address_line3', 'Brooklin Novo - SP', 'contact', 'Linha 3 do endereço'),
  ('contact_zipcode', '04569-011', 'contact', 'CEP'),
  ('contact_hours', 'Seg-Sex: 9h-18h', 'contact', 'Horário de funcionamento'),
  ('instagram_url', 'https://instagram.com/aerion.technologies', 'social', 'URL do Instagram'),
  ('instagram_handle', '@aerion.technologies', 'social', 'Handle do Instagram'),
  ('linkedin_url', 'https://linkedin.com/company/aerion-technologies-br', 'social', 'URL do LinkedIn'),
  ('linkedin_handle', '@aerion-technologies-br', 'social', 'Handle do LinkedIn')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = now();

-- Remover campos de redes sociais que não são usadas (se existirem)
DELETE FROM public.site_settings 
WHERE key IN ('facebook_url', 'twitter_url') 
AND (value IS NULL OR value = '');






