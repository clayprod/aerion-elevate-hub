import fs from 'fs';
import path from 'path';

// Páginas estáticas do site
const staticPages = [
  {
    url: 'https://aerion.com.br/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '1.0'
  },
  {
    url: 'https://aerion.com.br/sobre',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    url: 'https://aerion.com.br/contato',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    url: 'https://aerion.com.br/produtos',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    url: 'https://aerion.com.br/solucoes',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    url: 'https://aerion.com.br/blog',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '0.7'
  }
];

// Páginas de produtos
const productPages = [
  {
    url: 'https://aerion.com.br/produtos/autel-alpha',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    url: 'https://aerion.com.br/produtos/evo-lite-enterprise',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    url: 'https://aerion.com.br/produtos/evo-max-v2',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.8'
  }
];

// Páginas de soluções
const solutionPages = [
  {
    url: 'https://aerion.com.br/solucoes/construcao',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    url: 'https://aerion.com.br/solucoes/industrial',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    url: 'https://aerion.com.br/solucoes/seguranca',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    url: 'https://aerion.com.br/solucoes/resgate',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.8'
  }
];

// Páginas legais
const legalPages = [
  {
    url: 'https://aerion.com.br/politica-privacidade',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'yearly',
    priority: '0.3'
  },
  {
    url: 'https://aerion.com.br/termos-uso',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'yearly',
    priority: '0.3'
  }
];

// Combinar todas as páginas
const allPages = [
  ...staticPages,
  ...productPages,
  ...solutionPages,
  ...legalPages
];

// Gerar XML do sitemap
function generateSitemapXML(pages) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const urlsetClose = '</urlset>';
  
  const urls = pages.map(page => {
    return `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');
  
  return xmlHeader + urlsetOpen + urls + '\n' + urlsetClose;
}

// Gerar e salvar sitemap
const sitemapXML = generateSitemapXML(allPages);
const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');

fs.writeFileSync(outputPath, sitemapXML, 'utf8');
console.log('✅ Sitemap gerado com sucesso em:', outputPath);
console.log(`📊 Total de páginas: ${allPages.length}`);

