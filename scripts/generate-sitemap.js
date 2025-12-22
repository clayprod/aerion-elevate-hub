import { createClient } from '@supabase/supabase-js';
import { writeFileSync, existsSync, readFileSync } from 'fs';
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

  // Buscar posts de blog e páginas customizadas do Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  let blogPosts = [];
  let customPages = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Buscar posts do blog
      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('slug, updated_at, published_at')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (blogError) {
        console.warn('⚠️  Erro ao buscar posts do blog:', blogError.message);
        console.warn('   Continuando sem posts de blog...');
      } else if (blogData && blogData.length > 0) {
        blogPosts = blogData;
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

      // Buscar páginas customizadas
      const { data: pagesData, error: pagesError } = await supabase
        .from('custom_pages')
        .select('path, updated_at, published_at')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (pagesError) {
        console.warn('⚠️  Erro ao buscar páginas customizadas:', pagesError.message);
        console.warn('   Continuando sem páginas customizadas...');
      } else if (pagesData && pagesData.length > 0) {
        customPages = pagesData;
        console.log(`✅ Encontradas ${customPages.length} páginas customizadas`);
        
        // Adicionar páginas customizadas
        customPages.forEach((page) => {
          const lastmod = page.updated_at || page.published_at || currentDate;
          const lastmodDate = new Date(lastmod).toISOString().split('T')[0];
          
          xml += '  <url>\n';
          xml += `    <loc>${BASE_URL}${encodeURIComponent(page.path)}</loc>\n`;
          xml += `    <lastmod>${lastmodDate}</lastmod>\n`;
          xml += '    <changefreq>monthly</changefreq>\n';
          xml += '    <priority>0.7</priority>\n';
          xml += '  </url>\n';
        });
      } else {
        console.log('ℹ️  Nenhuma página customizada publicada encontrada');
      }
    } catch (error) {
      console.warn('⚠️  Erro ao conectar ao Supabase:', error.message);
      console.warn('   Continuando sem conteúdo dinâmico...');
    }
  } else {
    console.warn('⚠️  Variáveis de ambiente do Supabase não encontradas');
    console.warn('   Gerando sitemap apenas com rotas estáticas...');
  }

  xml += '</urlset>';

  // Salvar arquivo em public/sitemap.xml (para desenvolvimento)
  const publicPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(publicPath, xml, 'utf-8');
  console.log(`✅ Sitemap gerado em public: ${publicPath}`);
  
  // Se dist existe, também salvar lá (para build - será sobrescrito pelo prerender)
  const distPath = join(__dirname, '..', 'dist', 'sitemap.xml');
  const distDir = join(__dirname, '..', 'dist');
  if (existsSync(distDir)) {
    writeFileSync(distPath, xml, 'utf-8');
    console.log(`✅ Sitemap gerado em dist: ${distPath}`);
  }
  
  console.log(`   Total de URLs: ${staticRoutes.length + blogPosts.length + customPages.length}`);
  
  // Verificar se o arquivo foi criado corretamente
  if (existsSync(publicPath)) {
    const content = readFileSync(publicPath, 'utf-8');
    if (!content.startsWith('<?xml')) {
      console.error('❌ ERRO: Arquivo sitemap.xml não começa com <?xml!');
      console.error(`   Primeiros 100 caracteres: ${content.substring(0, 100)}`);
      process.exit(1);
    }
  }
}

// Executar
generateSitemap().catch((error) => {
  console.error('❌ Erro ao gerar sitemap:', error);
  process.exit(1);
});

