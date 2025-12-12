import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const BASE_URL = 'https://aerion.com.br';

// Rotas estáticas do site
const staticRoutes = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/produtos', priority: '0.9', changefreq: 'monthly' },
  { path: '/produtos/evo-lite-enterprise', priority: '0.8', changefreq: 'monthly' },
  { path: '/produtos/evo-max-v2', priority: '0.8', changefreq: 'monthly' },
  { path: '/produtos/autel-alpha', priority: '0.8', changefreq: 'monthly' },
  { path: '/produtos/autel-mapper', priority: '0.8', changefreq: 'monthly' },
  { path: '/solucoes', priority: '0.9', changefreq: 'monthly' },
  { path: '/solucoes/construcao', priority: '0.8', changefreq: 'monthly' },
  { path: '/solucoes/industrial', priority: '0.8', changefreq: 'monthly' },
  { path: '/solucoes/seguranca', priority: '0.8', changefreq: 'monthly' },
  { path: '/solucoes/resgate', priority: '0.8', changefreq: 'monthly' },
  { path: '/sobre', priority: '0.7', changefreq: 'monthly' },
  { path: '/contato', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.9', changefreq: 'weekly' },
  { path: '/politica-privacidade', priority: '0.5', changefreq: 'yearly' },
  { path: '/termos-uso', priority: '0.5', changefreq: 'yearly' },
];

const Sitemap = () => {
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['sitemap-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, updated_at, published_at')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Gerar XML dinamicamente
    const generateSitemap = () => {
      const currentDate = new Date().toISOString().split('T')[0];

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      // Adicionar rotas estáticas
      staticRoutes.forEach((route) => {
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}${route.path}</loc>\n`;
        xml += `    <lastmod>${currentDate}</lastmod>\n`;
        xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
        xml += `    <priority>${route.priority}</priority>\n`;
        xml += '  </url>\n';
      });

      // Adicionar posts de blog
      if (blogPosts && blogPosts.length > 0) {
        blogPosts.forEach((post) => {
          const lastmod = post.updated_at || post.published_at || currentDate;
          const lastmodDate = new Date(lastmod).toISOString().split('T')[0];
          
          xml += '  <url>\n';
          xml += `    <loc>${BASE_URL}/blog/${encodeURIComponent(post.slug)}</loc>\n`;
          xml += `    <lastmod>${lastmodDate}</lastmod>\n`;
          xml += '    <changefreq>monthly</changefreq>\n';
          xml += '    <priority>0.7</priority>\n';
          xml += '  </url>\n';
        });
      }

      xml += '</urlset>';

      return xml;
    };

    // Se ainda está carregando, não fazer nada
    if (isLoading) {
      return;
    }

    // Gerar XML
    const xml = generateSitemap();
    
    // Substituir todo o conteúdo do documento com XML puro
    // Isso é necessário para que o sitemap seja servido como XML, não HTML
    document.open('text/xml');
    document.write(xml);
    document.close();
  }, [blogPosts, isLoading]);

  // Retornar null pois vamos substituir o documento
  return null;
};

export default Sitemap;

