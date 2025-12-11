import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://aerion.com.br';

// Rotas estáticas do site (mesmas do componente Sitemap.tsx)
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

async function generateSitemap() {
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

  // Buscar posts de blog do Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  let blogPosts = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, updated_at, published_at')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.warn('⚠️  Erro ao buscar posts do blog:', error.message);
        console.warn('   Continuando sem posts de blog...');
      } else if (data && data.length > 0) {
        blogPosts = data;
        console.log(`✅ Encontrados ${blogPosts.length} posts de blog`);
        
        // Adicionar posts de blog
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
      } else {
        console.log('ℹ️  Nenhum post de blog publicado encontrado');
      }
    } catch (error) {
      console.warn('⚠️  Erro ao conectar ao Supabase:', error.message);
      console.warn('   Continuando sem posts de blog...');
    }
  } else {
    console.warn('⚠️  Variáveis de ambiente do Supabase não encontradas');
    console.warn('   Gerando sitemap apenas com rotas estáticas...');
  }

  xml += '</urlset>';

  // Salvar arquivo em public/sitemap.xml
  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outputPath, xml, 'utf-8');
  
  console.log(`✅ Sitemap gerado com sucesso: ${outputPath}`);
  console.log(`   Total de URLs: ${staticRoutes.length + blogPosts.length}`);
}

// Executar
generateSitemap().catch((error) => {
  console.error('❌ Erro ao gerar sitemap:', error);
  process.exit(1);
});

