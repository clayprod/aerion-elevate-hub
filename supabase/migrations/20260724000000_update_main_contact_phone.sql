-- Update the main contact phone in existing environments
UPDATE public.site_settings
SET
  value = '+55 11 5197-3319',
  description = 'Telefone de contato principal',
  updated_at = now()
WHERE key = 'contact_phone';
