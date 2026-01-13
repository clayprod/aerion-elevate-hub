-- Atualizar constraint de block_type para incluir novos tipos de blocos da home
ALTER TABLE page_blocks DROP CONSTRAINT IF EXISTS page_blocks_block_type_check;
ALTER TABLE page_blocks ADD CONSTRAINT page_blocks_block_type_check 
CHECK (block_type IN (
  'hero', 
  'highlight', 
  'specification', 
  'application', 
  'video', 
  'text', 
  'image', 
  'gallery',
  'products',
  'solutions',
  'why_aerion',
  'contact'
));

