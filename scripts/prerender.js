import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync, existsSync, readFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';
const DIST_DIR = join(__dirname, '..', 'dist');
const PORT = 4173;

// Rotas estáticas do site
// Nota: Essas rotas podem ser sobrescritas por páginas customizadas no CMS
const staticRoutes = [
  '',
  '/produtos',
  '/produtos/evo-lite-enterprise',
  '/produtos/evo-max-v2',
  '/produtos/autel-alpha',
  '/produtos/autel-mapper',
  '/solucoes',
  '/solucoes/construcao',
  '/solucoes/industrial',
  '/solucoes/seguranca',
  '/solucoes/resgate',
  '/sobre',
  '/contato',
  '/blog',
  '/politica-privacidade',
  '/termos-uso',
];

// Função para iniciar servidor local usando vite preview
function startLocalServer() {
  return new Promise((resolve, reject) => {
    try {
      // Verificar se o diretório dist existe
      if (!existsSync(DIST_DIR)) {
        console.error('❌ Diretório dist não encontrado. Execute "vite build" primeiro.');
        process.exit(1);
      }

      console.log('🚀 Iniciando servidor preview...');
      
      // Iniciar vite preview
      const previewProcess = spawn('npx', ['vite', 'preview', '--port', PORT.toString(), '--host'], {
        stdio: 'pipe',
        shell: true,
      });

      let serverReady = false;

      previewProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Local:') || output.includes('localhost')) {
          if (!serverReady) {
            serverReady = true;
            console.log(`✅ Servidor preview iniciado em ${BASE_URL}`);
            // Aguardar um pouco para garantir que está pronto
            setTimeout(() => resolve(previewProcess), 2000);
          }
        }
      });

      previewProcess.stderr.on('data', (data) => {
        const output = data.toString();
        // Ignorar avisos comuns
        if (!output.includes('WARN') && !output.includes('warn')) {
          console.error('Preview stderr:', output);
        }
      });

      previewProcess.on('error', (err) => {
        console.error('❌ Erro ao iniciar preview:', err);
        reject(err);
      });

      // Timeout de segurança
      setTimeout(() => {
        if (!serverReady) {
          console.log('ℹ️  Assumindo que servidor está pronto...');
          serverReady = true;
          resolve(previewProcess);
        }
      }, 5000);
    } catch (err) {
      reject(err);
    }
  });
}

// Função para buscar posts do blog do Supabase
async function getBlogPosts() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Variáveis de ambiente do Supabase não encontradas');
    console.warn('   Continuando sem posts de blog...');
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.warn('⚠️  Erro ao buscar posts do blog:', error.message);
      console.warn('   Continuando sem posts de blog...');
      return [];
    }

    if (data && data.length > 0) {
      console.log(`✅ Encontrados ${data.length} posts de blog`);
      return data.map(post => `/blog/${post.slug}`);
    } else {
      console.log('ℹ️  Nenhum post de blog publicado encontrado');
      return [];
    }
  } catch (error) {
    console.warn('⚠️  Erro ao conectar ao Supabase:', error.message);
    console.warn('   Continuando sem posts de blog...');
    return [];
  }
}

// Função para buscar páginas customizadas do Supabase
async function getCustomPages() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Variáveis de ambiente do Supabase não encontradas');
    console.warn('   Continuando sem páginas customizadas...');
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('custom_pages')
      .select('path')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.warn('⚠️  Erro ao buscar páginas customizadas:', error.message);
      console.warn('   Continuando sem páginas customizadas...');
      return [];
    }

    if (data && data.length > 0) {
      console.log(`✅ Encontradas ${data.length} páginas customizadas`);
      return data.map(page => page.path);
    } else {
      console.log('ℹ️  Nenhuma página customizada publicada encontrada');
      return [];
    }
  } catch (error) {
    console.warn('⚠️  Erro ao conectar ao Supabase:', error.message);
    console.warn('   Continuando sem páginas customizadas...');
    return [];
  }
}

// Função para verificar se o servidor está pronto
async function waitForServer(browser, maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const page = await browser.newPage();
      await page.goto(`${BASE_URL}/`, { timeout: 5000, waitUntil: 'domcontentloaded' });
      await page.close();
      return true;
    } catch (error) {
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        return false;
      }
    }
  }
  return false;
}

// Função para renderizar uma rota com Puppeteer
async function renderRoute(browser, route) {
  try {
    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navegar para a rota
    const url = `${BASE_URL}${route}`;
    console.log(`  📄 Renderizando: ${route}`);
    
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Aguardar React Query completar - verificar se há queries pendentes
    try {
      await page.waitForFunction(
        () => {
          // Verificar se React Query está pronto
          // TanStack Query armazena queries no window.__REACT_QUERY_STATE__ ou similar
          // Verificar se não há queries em loading state
          const reactQueryReady = window.__REACT_QUERY_STATE__ === undefined || 
            (typeof window.__REACT_QUERY_STATE__ !== 'undefined' && 
             Object.keys(window.__REACT_QUERY_STATE__?.queries || {}).length > 0);
          
          // Verificar se não há elementos com loading states visíveis
          const loadingElements = document.querySelectorAll('[data-loading="true"], .loading, [aria-busy="true"]');
          const hasLoadingElements = loadingElements.length > 0;
          
          // Verificar se imagens críticas carregaram
          const criticalImages = document.querySelectorAll('img[fetchpriority="high"], img[loading="eager"]');
          let imagesLoaded = true;
          criticalImages.forEach(img => {
            if (!img.complete) imagesLoaded = false;
          });
          
          return !hasLoadingElements && imagesLoaded;
        },
        { timeout: 10000 }
      );
    } catch (e) {
      // Se timeout, continuar mesmo assim
      console.log(`    ⚠️  Timeout aguardando queries (continuando...)`);
    }

    // Aguardar um pouco mais para garantir que React terminou de renderizar
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Aguardar todas as imagens críticas carregarem
    try {
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.querySelectorAll('img[fetchpriority="high"], img[loading="eager"]'))
            .map(img => {
              if (img.complete) return Promise.resolve();
              return new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = resolve; // Resolver mesmo se erro para não travar
                setTimeout(resolve, 3000); // Timeout de segurança
              });
            })
        );
      });
    } catch (e) {
      // Continuar mesmo se houver erro
    }

    // Obter HTML renderizado
    const html = await page.content();
    
    await page.close();
    
    return html;
  } catch (error) {
    console.error(`  ❌ Erro ao renderizar ${route}:`, error.message);
    return null;
  }
}

// Função para salvar HTML em arquivo
function saveHTML(route, html) {
  if (!html) return;

  // Determinar caminho do arquivo
  let filePath;
  if (route === '' || route === '/') {
    filePath = join(DIST_DIR, 'index.html');
  } else {
    // Remover barra inicial
    const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
    const routeDir = join(DIST_DIR, cleanRoute);
    
    // Criar diretório se não existir
    if (!existsSync(routeDir)) {
      mkdirSync(routeDir, { recursive: true });
    }
    
    filePath = join(routeDir, 'index.html');
  }

  // Salvar HTML
  writeFileSync(filePath, html, 'utf-8');
  console.log(`  ✅ Salvo: ${filePath}`);
}

// Função para gerar sitemap.xml diretamente (sem Puppeteer)
async function generateSitemapXML() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  const BASE_URL = 'https://aerion.com.br';
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Rotas estáticas
  const staticRoutesForSitemap = [
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

  // Adicionar rotas estáticas
  staticRoutesForSitemap.forEach((route) => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  // Buscar posts do blog e páginas customizadas
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Buscar posts do blog
      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('slug, updated_at, published_at')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (!blogError && blogData && blogData.length > 0) {
        blogData.forEach((post) => {
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

      // Buscar páginas customizadas
      const { data: pagesData, error: pagesError } = await supabase
        .from('custom_pages')
        .select('path, updated_at, published_at')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (!pagesError && pagesData && pagesData.length > 0) {
        pagesData.forEach((page) => {
          const lastmod = page.updated_at || page.published_at || currentDate;
          const lastmodDate = new Date(lastmod).toISOString().split('T')[0];
          
          xml += '  <url>\n';
          xml += `    <loc>${BASE_URL}${encodeURIComponent(page.path)}</loc>\n`;
          xml += `    <lastmod>${lastmodDate}</lastmod>\n`;
          xml += '    <changefreq>monthly</changefreq>\n';
          xml += '    <priority>0.7</priority>\n';
          xml += '  </url>\n';
        });
      }
    } catch (error) {
      console.warn('⚠️  Erro ao buscar dados do Supabase para sitemap:', error.message);
    }
  }

  xml += '</urlset>';

  // Salvar arquivo XML diretamente no dist
  const sitemapPath = join(DIST_DIR, 'sitemap.xml');
  writeFileSync(sitemapPath, xml, 'utf-8');
  
  // Verificar se o arquivo foi criado corretamente
  if (existsSync(sitemapPath)) {
    const stats = statSync(sitemapPath);
    console.log(`  ✅ Sitemap XML gerado: ${sitemapPath}`);
    console.log(`     Tamanho: ${stats.size} bytes`);
    
    // Verificar se começa com XML válido
    const content = readFileSync(sitemapPath, 'utf-8');
    if (content.startsWith('<?xml')) {
      console.log(`     ✅ Arquivo XML válido`);
    } else {
      console.warn(`     ⚠️  Arquivo não começa com <?xml`);
    }
  } else {
    console.error(`  ❌ Erro: Arquivo não foi criado em ${sitemapPath}`);
  }
}

// Função principal
async function prerender() {
  console.log('🚀 Iniciando prerendering...\n');

  // Verificar se dist existe
  if (!existsSync(DIST_DIR)) {
    console.error('❌ Diretório dist não encontrado. Execute "vite build" primeiro.');
    process.exit(1);
  }

  // Buscar posts do blog e páginas customizadas
  const blogRoutes = await getBlogPosts();
  const customPageRoutes = await getCustomPages();
  
  // Filtrar rotas estáticas que têm override customizado
  // Se uma rota estática tem override, não precisa prerenderizar a versão estática
  const staticRoutesWithoutOverrides = staticRoutes.filter(
    route => !customPageRoutes.includes(route)
  );
  
  const allRoutes = [...staticRoutesWithoutOverrides, ...blogRoutes, ...customPageRoutes];

  console.log(`\n📋 Total de rotas para renderizar: ${allRoutes.length}`);
  console.log(`   - Rotas estáticas (sem override): ${staticRoutesWithoutOverrides.length}`);
  console.log(`   - Posts do blog: ${blogRoutes.length}`);
  console.log(`   - Páginas customizadas (incluindo overrides): ${customPageRoutes.length}\n`);

  // Iniciar servidor local
  const server = await startLocalServer();
  
  // Iniciar Puppeteer
  console.log('🌐 Iniciando Puppeteer...');
  
  // Configurar executável do Chromium se estiver definido (Docker)
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  
  const launchOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  };
  
  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }
  
  const browser = await puppeteer.launch(launchOptions);

  console.log('✅ Puppeteer iniciado');
  
  // Aguardar servidor estar pronto
  console.log('⏳ Aguardando servidor estar pronto...');
  const serverReady = await waitForServer(browser);
  
  if (!serverReady) {
    console.error('❌ Servidor não está respondendo. Encerrando...');
    await browser.close();
    if (server) server.kill();
    process.exit(1);
  }
  
  console.log('✅ Servidor pronto\n');

  // Gerar sitemap.xml diretamente (sem Puppeteer)
  console.log('📄 Gerando sitemap.xml...');
  await generateSitemapXML();

  // Renderizar cada rota
  let successCount = 0;
  let errorCount = 0;

  for (const route of allRoutes) {
    const html = await renderRoute(browser, route);
    if (html) {
      saveHTML(route, html);
      successCount++;
    } else {
      errorCount++;
    }
  }

  // Fechar browser
  await browser.close();
  
  // Fechar servidor preview
  if (server) {
    console.log('🛑 Encerrando servidor preview...');
    server.kill();
  }

  console.log('\n✅ Prerendering concluído!');
  console.log(`   - Sucesso: ${successCount}`);
  console.log(`   - Erros: ${errorCount}`);
  console.log(`   - Total: ${allRoutes.length}`);
}

// Executar
prerender().catch((error) => {
  console.error('❌ Erro ao executar prerendering:', error);
  process.exit(1);
});

