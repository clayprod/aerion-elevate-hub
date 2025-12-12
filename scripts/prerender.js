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

    // Aguardar um pouco para garantir que React terminou de renderizar
    // Usar Promise com setTimeout ao invés de waitForTimeout (removido no Puppeteer recente)
    await new Promise(resolve => setTimeout(resolve, 2000));

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

// Função principal
async function prerender() {
  console.log('🚀 Iniciando prerendering...\n');

  // Verificar se dist existe
  if (!existsSync(DIST_DIR)) {
    console.error('❌ Diretório dist não encontrado. Execute "vite build" primeiro.');
    process.exit(1);
  }

  // Buscar posts do blog
  const blogRoutes = await getBlogPosts();
  const allRoutes = [...staticRoutes, ...blogRoutes];

  console.log(`\n📋 Total de rotas para renderizar: ${allRoutes.length}`);
  console.log(`   - Rotas estáticas: ${staticRoutes.length}`);
  console.log(`   - Posts do blog: ${blogRoutes.length}\n`);

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

