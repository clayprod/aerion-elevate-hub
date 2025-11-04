// Script para migrar dados hardcoded para o banco de dados
// Executa a migração de produtos, soluções e seções existentes

import { createClient } from '@supabase/supabase-js';
import { productFamilies } from '../src/data/products';

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  console.log('🚀 Iniciando migração de dados...');

  try {
    // 1. Migrar marca Autel (se não existir)
    console.log('📝 Migrando marca Autel...');
    const { data: existingBrand } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', 'autel-robotics')
      .single();

    let autelBrandId = existingBrand?.id;

    if (!autelBrandId) {
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .insert({
          name: 'Autel Robotics',
          slug: 'autel-robotics',
          description: 'Líder global em tecnologia de drones profissionais',
          website: 'https://autelrobotics.com',
          active: true,
          order_index: 1
        })
        .select()
        .single();

      if (brandError) {
        throw new Error(`Erro ao criar marca Autel: ${brandError.message}`);
      }

      autelBrandId = brand.id;
      console.log('✅ Marca Autel criada com sucesso');
    } else {
      console.log('✅ Marca Autel já existe');
    }

    // 2. Migrar famílias de produtos
    console.log('📦 Migrando famílias de produtos...');
    
    for (const family of productFamilies) {
      // Verificar se a família já existe
      const { data: existingFamily } = await supabase
        .from('product_families')
        .select('id')
        .eq('slug', family.slug)
        .single();

      if (existingFamily) {
        console.log(`⏭️  Família ${family.name} já existe, pulando...`);
        continue;
      }

      // Criar família de produto
      const { data: productFamily, error: familyError } = await supabase
        .from('product_families')
        .insert({
          brand_id: autelBrandId,
          name: family.name,
          slug: family.slug,
          description: family.description,
          short_description: family.shortDescription,
          youtube_video_id: family.youtubeVideoId,
          brochure_url: family.brochureUrl,
          fallback_image: family.fallbackImage,
          key_features: family.keyFeatures,
          technical_data: family.technicalData,
          components: family.components,
          accessories_included: family.accessoriesIncluded,
          applications: family.applications,
          active: true,
          featured: family.featured || false,
          order_index: family.orderIndex || 0
        })
        .select()
        .single();

      if (familyError) {
        console.error(`❌ Erro ao criar família ${family.name}:`, familyError.message);
        continue;
      }

      console.log(`✅ Família ${family.name} criada com sucesso`);

      // 3. Migrar variantes da família
      if (family.variants && family.variants.length > 0) {
        console.log(`🔧 Migrando variantes de ${family.name}...`);
        
        for (const variant of family.variants) {
          const { data: existingVariant } = await supabase
            .from('product_variants')
            .select('id')
            .eq('family_id', productFamily.id)
            .eq('slug', variant.slug)
            .single();

          if (existingVariant) {
            console.log(`⏭️  Variante ${variant.name} já existe, pulando...`);
            continue;
          }

          const { error: variantError } = await supabase
            .from('product_variants')
            .insert({
              family_id: productFamily.id,
              name: variant.name,
              slug: variant.slug,
              description: variant.description,
              image_path: variant.imagePath,
              specs: variant.specs,
              images: variant.images,
              videos: variant.videos,
              photo_gallery: variant.photoGallery,
              active: true,
              order_index: variant.orderIndex || 0
            });

          if (variantError) {
            console.error(`❌ Erro ao criar variante ${variant.name}:`, variantError.message);
            continue;
          }

          console.log(`✅ Variante ${variant.name} criada com sucesso`);
        }
      }
    }

    // 4. Migrar verticais/soluções
    console.log('💡 Migrando verticais/soluções...');
    
    const solutions = [
      {
        name: 'Construção Civil',
        slug: 'construcao',
        description: 'Soluções para construção civil e topografia',
        short_description: 'Drones para mapeamento e monitoramento de obras',
        icon: '🏗️',
        image_url: '/images/solutions/construcao.jpg',
        benefits: [
          'Mapeamento preciso de terrenos',
          'Monitoramento de progresso de obras',
          'Inspeção de estruturas',
          'Documentação fotográfica detalhada'
        ],
        use_cases: [
          'Levantamento topográfico',
          'Monitoramento de canteiros de obras',
          'Inspeção de estruturas de concreto',
          'Documentação de progresso'
        ],
        active: true,
        featured: true,
        order_index: 1
      },
      {
        name: 'Inspeção Industrial',
        slug: 'industrial',
        description: 'Inspeção de equipamentos e infraestrutura',
        short_description: 'Tecnologia térmica para inspeções industriais',
        icon: '🏭',
        image_url: '/images/solutions/industrial.jpg',
        benefits: [
          'Inspeção sem contato físico',
          'Detecção de problemas térmicos',
          'Redução de tempo de parada',
          'Maior segurança para operadores'
        ],
        use_cases: [
          'Inspeção de equipamentos elétricos',
          'Monitoramento de linhas de transmissão',
          'Inspeção de tanques e vasos',
          'Análise térmica de processos'
        ],
        active: true,
        featured: true,
        order_index: 2
      },
      {
        name: 'Segurança Pública',
        slug: 'seguranca',
        description: 'Operações de segurança e emergência',
        short_description: 'Drones para patrulhamento e resgate',
        icon: '🚔',
        image_url: '/images/solutions/seguranca.jpg',
        benefits: [
          'Visão aérea em tempo real',
          'Resposta rápida a emergências',
          'Monitoramento de grandes áreas',
          'Redução de riscos para equipes'
        ],
        use_cases: [
          'Patrulhamento de fronteiras',
          'Monitoramento de eventos',
          'Busca e resgate',
          'Vigilância de infraestrutura crítica'
        ],
        active: true,
        featured: true,
        order_index: 3
      },
      {
        name: 'Resgate e Emergências',
        slug: 'resgate',
        description: 'Operações de busca e salvamento',
        short_description: 'Tecnologia para situações de emergência',
        icon: '🚁',
        image_url: '/images/solutions/resgate.jpg',
        benefits: [
          'Acesso a áreas de difícil alcance',
          'Busca noturna com câmeras térmicas',
          'Comunicação em tempo real',
          'Entrega de suprimentos de emergência'
        ],
        use_cases: [
          'Busca de pessoas desaparecidas',
          'Resgate em desastres naturais',
          'Entrega de medicamentos',
          'Avaliação de danos pós-desastre'
        ],
        active: true,
        featured: true,
        order_index: 4
      }
    ];

    for (const solution of solutions) {
      const { data: existingSolution } = await supabase
        .from('verticals')
        .select('id')
        .eq('slug', solution.slug)
        .single();

      if (existingSolution) {
        console.log(`⏭️  Vertical ${solution.name} já existe, pulando...`);
        continue;
      }

      const { error: solutionError } = await supabase
        .from('verticals')
        .insert(solution);

      if (solutionError) {
        console.error(`❌ Erro ao criar vertical ${solution.name}:`, solutionError.message);
        continue;
      }

      console.log(`✅ Vertical ${solution.name} criada com sucesso`);
    }

    // 5. Migrar seções da página Home
    console.log('🏠 Migrando seções da página Home...');
    
    const homeSections = [
      {
        page_slug: '/',
        section_type: 'hero',
        content: {
          title: 'Tecnologia Aérea Profissional',
          subtitle: 'Drones Autel para aplicações comerciais e industriais. Soluções completas em tecnologia aérea com suporte especializado.',
          cta_text: 'Ver Produtos',
          cta_link: '/produtos',
          video_url: 'https://www.youtube.com/watch?v=ABC123',
          value_props: [
            {
              icon: 'Rocket',
              title: 'Tecnologia Avançada',
              description: 'Drones com câmeras térmicas e RGB de alta resolução'
            },
            {
              icon: 'Shield',
              title: 'Suporte Especializado',
              description: 'Equipe técnica qualificada para cada aplicação'
            },
            {
              icon: 'DollarSign',
              title: 'ROI Comprovado',
              description: 'Redução de custos e aumento de eficiência operacional'
            }
          ]
        },
        order_index: 1,
        active: true
      },
      {
        page_slug: '/',
        section_type: 'features',
        content: {
          title: 'Por que escolher a AERION?',
          subtitle: 'Somos especialistas em tecnologia aérea com foco em resultados práticos para seu negócio.',
          features: [
            {
              icon: 'Rocket',
              title: 'Tecnologia de Ponta',
              description: 'Drones Autel com câmeras térmicas e RGB de alta resolução para aplicações profissionais.',
              features_list: [
                'Câmeras térmicas FLIR de alta resolução',
                'Sensores RGB de 48MP',
                'Transmissão de vídeo em tempo real',
                'Autonomia de voo de até 40 minutos'
              ]
            },
            {
              icon: 'Shield',
              title: 'Suporte Especializado',
              description: 'Equipe técnica qualificada para cada aplicação, desde treinamento até suporte pós-venda.',
              features_list: [
                'Treinamento personalizado por aplicação',
                'Suporte técnico especializado',
                'Manutenção e reparos autorizados',
                'Consultoria em implementação'
              ]
            },
            {
              icon: 'DollarSign',
              title: 'ROI Comprovado',
              description: 'Redução de custos operacionais e aumento de eficiência em aplicações industriais e comerciais.',
              features_list: [
                'Redução de 70% no tempo de inspeção',
                'Diminuição de riscos operacionais',
                'Aumento de 40% na produtividade',
                'Economia de custos com paradas de produção'
              ]
            }
          ]
        },
        order_index: 2,
        active: true
      },
      {
        page_slug: '/',
        section_type: 'products',
        content: {
          title: 'Nossos Produtos',
          subtitle: 'Linha completa de drones Autel para aplicações profissionais',
          show_all_products: true,
          layout: 'grid'
        },
        order_index: 3,
        active: true
      },
      {
        page_slug: '/',
        section_type: 'solutions',
        content: {
          title: 'Soluções por Segmento',
          subtitle: 'Tecnologia aérea adaptada para cada necessidade',
          show_all_solutions: true,
          layout: 'grid'
        },
        order_index: 4,
        active: true
      },
      {
        page_slug: '/',
        section_type: 'blog-cta',
        content: {
          title: 'Fique por Dentro das Novidades',
          subtitle: 'Insights e tendências em tecnologia aérea para aplicações profissionais.',
          button_text: 'Ver Blog',
          button_link: '/blog'
        },
        order_index: 5,
        active: true
      }
    ];

    for (const section of homeSections) {
      const { data: existingSection } = await supabase
        .from('page_sections')
        .select('id')
        .eq('page_slug', section.page_slug)
        .eq('section_type', section.section_type)
        .single();

      if (existingSection) {
        console.log(`⏭️  Seção ${section.section_type} da Home já existe, pulando...`);
        continue;
      }

      const { error: sectionError } = await supabase
        .from('page_sections')
        .insert(section);

      if (sectionError) {
        console.error(`❌ Erro ao criar seção ${section.section_type}:`, sectionError.message);
        continue;
      }

      console.log(`✅ Seção ${section.section_type} da Home criada com sucesso`);
    }

    // 6. Migrar seções da página Sobre
    console.log('📖 Migrando seções da página Sobre...');
    
    const aboutSections = [
      {
        page_slug: '/sobre',
        section_type: 'text',
        content: {
          title: 'Nossa História',
          content: `
            <p>A AERION nasceu da paixão por tecnologia aérea e da visão de democratizar o acesso a soluções profissionais de drones no Brasil.</p>
            
            <p>Fundada em 2020, nossa empresa se especializou em tecnologia Autel, reconhecida mundialmente por sua qualidade e inovação em drones comerciais e industriais.</p>
            
            <p>Ao longo dos anos, desenvolvemos expertise única em aplicações práticas, desde inspeções industriais até mapeamento topográfico, sempre com foco em resultados mensuráveis para nossos clientes.</p>
            
            <p>Hoje, somos referência em tecnologia aérea profissional, oferecendo não apenas equipamentos de última geração, mas também o suporte especializado necessário para maximizar o retorno sobre investimento em cada aplicação.</p>
          `,
          alignment: 'left'
        },
        order_index: 1,
        active: true
      },
      {
        page_slug: '/sobre',
        section_type: 'features',
        content: {
          title: 'Missão, Visão e Valores',
          subtitle: 'Nossos pilares fundamentais que guiam cada decisão e projeto.',
          features: [
            {
              icon: 'Target',
              title: 'Missão',
              description: 'Democratizar o acesso à tecnologia aérea profissional, oferecendo soluções completas que transformam operações e maximizam resultados.',
              features_list: [
                'Tecnologia acessível para todos os segmentos',
                'Soluções personalizadas por aplicação',
                'Suporte técnico especializado',
                'Treinamento e capacitação contínua'
              ]
            },
            {
              icon: 'Eye',
              title: 'Visão',
              description: 'Ser a referência nacional em tecnologia aérea profissional, reconhecida pela excelência técnica e resultados comprovados.',
              features_list: [
                'Liderança em inovação tecnológica',
                'Reconhecimento nacional e internacional',
                'Parcerias estratégicas com fabricantes',
                'Expansão para novos mercados'
              ]
            },
            {
              icon: 'Heart',
              title: 'Valores',
              description: 'Excelência técnica, inovação constante, parceria com clientes e compromisso com resultados mensuráveis.',
              features_list: [
                'Excelência em cada projeto',
                'Inovação como diferencial competitivo',
                'Parceria de longo prazo com clientes',
                'Resultados mensuráveis e comprovados'
              ]
            }
          ]
        },
        order_index: 2,
        active: true
      },
      {
        page_slug: '/sobre',
        section_type: 'text',
        content: {
          title: 'Sobre a Autel',
          content: `
            <p>A Autel Robotics é uma empresa chinesa fundada em 2014, especializada no desenvolvimento e fabricação de drones comerciais e industriais de alta qualidade.</p>
            
            <p>Reconhecida mundialmente por sua tecnologia avançada, a Autel oferece soluções completas para diversas aplicações profissionais, desde inspeções industriais até mapeamento topográfico.</p>
            
            <p>Nossos drones Autel combinam:</p>
            <ul>
              <li><strong>Câmeras térmicas FLIR</strong> de alta resolução para inspeções precisas</li>
              <li><strong>Sensores RGB de 48MP</strong> para documentação detalhada</li>
              <li><strong>Transmissão de vídeo em tempo real</strong> para monitoramento ao vivo</li>
              <li><strong>Autonomia de voo de até 40 minutos</strong> para operações eficientes</li>
              <li><strong>Software especializado</strong> para análise e processamento de dados</li>
            </ul>
            
            <p>Como parceiros oficiais Autel no Brasil, oferecemos suporte técnico especializado, treinamento personalizado e garantia completa em todos os equipamentos.</p>
          `,
          alignment: 'left'
        },
        order_index: 3,
        active: true
      }
    ];

    for (const section of aboutSections) {
      const { data: existingSection } = await supabase
        .from('page_sections')
        .select('id')
        .eq('page_slug', section.page_slug)
        .eq('section_type', section.section_type)
        .eq('order_index', section.order_index)
        .single();

      if (existingSection) {
        console.log(`⏭️  Seção ${section.section_type} do Sobre já existe, pulando...`);
        continue;
      }

      const { error: sectionError } = await supabase
        .from('page_sections')
        .insert(section);

      if (sectionError) {
        console.error(`❌ Erro ao criar seção ${section.section_type} do Sobre:`, sectionError.message);
        continue;
      }

      console.log(`✅ Seção ${section.section_type} do Sobre criada com sucesso`);
    }

    console.log('🎉 Migração concluída com sucesso!');
    console.log('');
    console.log('📊 Resumo da migração:');
    console.log('✅ Marca Autel criada/verificada');
    console.log('✅ Famílias de produtos migradas');
    console.log('✅ Variantes de produtos migradas');
    console.log('✅ Verticais/soluções migradas');
    console.log('✅ Seções da Home migradas');
    console.log('✅ Seções do Sobre migradas');
    console.log('');
    console.log('🚀 O sistema CMS está pronto para uso!');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar migração se o script for chamado diretamente
if (require.main === module) {
  migrateData();
}

export { migrateData };

