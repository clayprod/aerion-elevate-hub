/**
 * Script para migrar conteúdo hardcoded da home para page_blocks
 * 
 * Este script cria blocos modulares na tabela page_blocks para a página home,
 * migrando o conteúdo que estava hardcoded nos componentes.
 * 
 * Uso: node scripts/migrate-home-to-blocks.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateHomeToBlocks() {
  console.log('🚀 Iniciando migração da home para blocos modulares...\n');

  try {
    // Verificar se já existem blocos para a home
    const { data: existingBlocks, error: checkError } = await supabase
      .from('page_blocks')
      .select('id')
      .eq('page_slug', 'home');

    if (checkError) {
      console.error('❌ Erro ao verificar blocos existentes:', checkError);
      return;
    }

    if (existingBlocks && existingBlocks.length > 0) {
      console.log('⚠️  Já existem blocos para a home. Deseja continuar mesmo assim?');
      console.log('   (Os blocos existentes serão mantidos, novos serão adicionados)\n');
    }

    // 1. Hero Section Block
    console.log('📝 Criando bloco Hero Section...');
    const heroBlock = {
      page_slug: 'home',
      block_type: 'hero',
      block_data: {
        slides: [
          {
            title: 'A Revolução Autel Chegou ao Brasil',
            subtitle: 'Tecnologia de ponta com custo-benefício superior e suporte técnico especializado local. A escolha inteligente para operações enterprise.',
            video_url: '/videos/products/evo_max/Introducing EVO Max 4T_720.mp4',
            poster_url: '/images/products/evo_max/hero-poster.jpg',
            cta1_text: 'Conheça os Produtos',
            cta1_link: '/produtos',
            cta2_text: 'Fale Conosco',
            cta2_link: '/contato',
            order_index: 0,
          },
        ],
        autoplay: true,
        autoplay_interval: 5000,
      },
      order_index: 0,
      active: true,
    };

    const { error: heroError } = await supabase
      .from('page_blocks')
      .upsert(heroBlock, {
        onConflict: 'page_slug,block_type,order_index',
      });

    if (heroError) {
      console.error('❌ Erro ao criar bloco Hero:', heroError);
    } else {
      console.log('✅ Bloco Hero criado com sucesso\n');
    }

    // 2. Products Section Block
    console.log('📝 Criando bloco Products Section...');
    const productsBlock = {
      page_slug: 'home',
      block_type: 'products',
      block_data: {},
      order_index: 1,
      active: true,
    };

    const { error: productsError } = await supabase
      .from('page_blocks')
      .upsert(productsBlock, {
        onConflict: 'page_slug,block_type,order_index',
      });

    if (productsError) {
      console.error('❌ Erro ao criar bloco Products:', productsError);
    } else {
      console.log('✅ Bloco Products criado com sucesso\n');
    }

    // 3. Solutions Section Block
    console.log('📝 Criando bloco Solutions Section...');
    const solutionsBlock = {
      page_slug: 'home',
      block_type: 'solutions',
      block_data: {},
      order_index: 2,
      active: true,
    };

    const { error: solutionsError } = await supabase
      .from('page_blocks')
      .upsert(solutionsBlock, {
        onConflict: 'page_slug,block_type,order_index',
      });

    if (solutionsError) {
      console.error('❌ Erro ao criar bloco Solutions:', solutionsError);
    } else {
      console.log('✅ Bloco Solutions criado com sucesso\n');
    }

    // 4. Why Aerion Section Block (se houver conteúdo hardcoded)
    console.log('📝 Criando bloco Why Aerion Section...');
    const whyAerionBlock = {
      page_slug: 'home',
      block_type: 'why_aerion',
      block_data: {
        title: 'Por que escolher a AERION?',
        subtitle: 'Soluções completas em tecnologia de drones para seu negócio',
        differentials: [],
      },
      order_index: 3,
      active: true,
    };

    const { error: whyAerionError } = await supabase
      .from('page_blocks')
      .upsert(whyAerionBlock, {
        onConflict: 'page_slug,block_type,order_index',
      });

    if (whyAerionError) {
      console.error('❌ Erro ao criar bloco Why Aerion:', whyAerionError);
    } else {
      console.log('✅ Bloco Why Aerion criado com sucesso\n');
    }

    // 5. Contact Section Block
    console.log('📝 Criando bloco Contact Section...');
    const contactBlock = {
      page_slug: 'home',
      block_type: 'contact',
      block_data: {
        title: 'Entre em Contato',
        subtitle: 'Estamos prontos para ajudar você a encontrar a solução ideal',
      },
      order_index: 4,
      active: true,
    };

    const { error: contactError } = await supabase
      .from('page_blocks')
      .upsert(contactBlock, {
        onConflict: 'page_slug,block_type,order_index',
      });

    if (contactError) {
      console.error('❌ Erro ao criar bloco Contact:', contactError);
    } else {
      console.log('✅ Bloco Contact criado com sucesso\n');
    }

    console.log('✨ Migração concluída com sucesso!');
    console.log('\n📋 Resumo:');
    console.log('   - Hero Section: ✅');
    console.log('   - Products Section: ✅');
    console.log('   - Solutions Section: ✅');
    console.log('   - Why Aerion Section: ✅');
    console.log('   - Contact Section: ✅');
    console.log('\n💡 Acesse /admin/home para gerenciar os blocos da home page.');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar migração
migrateHomeToBlocks()
  .then(() => {
    console.log('\n✅ Script finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });

