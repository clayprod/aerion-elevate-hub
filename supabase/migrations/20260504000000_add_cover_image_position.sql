-- Adiciona campo para controle do ponto focal da imagem de capa do post
-- Usado como valor de CSS object-position (ex: "50% 30%") para controlar
-- qual parte da foto fica visível no enquadramento 4:5 da página do post.
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS cover_image_position TEXT DEFAULT '50% 50%';
