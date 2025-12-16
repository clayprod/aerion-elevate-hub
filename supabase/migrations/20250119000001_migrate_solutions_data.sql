-- Migrate hardcoded solution data to JSONB format
-- This migration populates the solutions table with rich content from hardcoded pages

-- Construção e Topografia
UPDATE public.solutions
SET
  hero_section = jsonb_build_object(
    'badge_text', 'Construção e Topografia',
    'badge_icon', 'Building',
    'title', 'Agilidade e Precisão em Obras e Mapeamento',
    'description', 'Transforme suas obras com tecnologia aérea de ponta. Levantamentos topográficos com precisão centimétrica, modelagem BIM, mapeamento urbano e medição de volumes com eficiência incomparável.',
    'cta_primary_text', 'Solicitar Orçamento',
    'cta_secondary_text', 'Ver Drones',
    'hero_image_url', '/images/lifestyle/construction-1.jpeg',
    'gradient_colors', jsonb_build_array('from-blue-50', 'to-white')
  ),
  benefits = jsonb_build_array(
    jsonb_build_object('icon', 'Clock', 'title', 'Agilidade', 'description', 'Levantamentos 10x mais rápidos que métodos tradicionais'),
    jsonb_build_object('icon', 'Target', 'title', 'Precisão', 'description', 'Acurácia centimétrica com RTK integrado'),
    jsonb_build_object('icon', 'Camera', 'title', 'Documentação', 'description', 'Imagens e vídeos 4K para documentação completa'),
    jsonb_build_object('icon', 'Map', 'title', 'Modelagem 3D', 'description', 'Ortofotos e modelos 3D para projetos BIM')
  ),
  drones = jsonb_build_array(
    jsonb_build_object(
      'name', 'EVO Lite Enterprise',
      'variant', '640T',
      'image', '/images/products/evo_lite/640t/1.png',
      'features', jsonb_build_array(
        'Carga útil 640T (térmica 640×512) ou 6K (sensor 1" 20 MP)',
        'Autonomia de até 40 minutos',
        'Transmissão até 12 km (FCC) / 6 km (CE)',
        'Detecção tridirecional 0.2-30 m'
      ),
      'applications', jsonb_build_array(
        'Levantamentos topográficos rápidos',
        'Inspeção térmica de estruturas',
        'Mapeamento de áreas urbanas',
        'Documentação de obras'
      ),
      'bestFor', 'Projetos de médio porte e inspeções térmicas'
    ),
    jsonb_build_object(
      'name', 'EVO Max V2',
      'variant', '4T',
      'image', '/images/products/evo_max/4t/1.png',
      'features', jsonb_build_array(
        'Zoom óptico 10x com alcance 2km',
        'Câmera térmica 640×512',
        'Autonomia de 42 minutos',
        'Alcance de até 15km (FCC) ou 8km (SRRC/CE)'
      ),
      'applications', jsonb_build_array(
        'Levantamentos de grandes áreas',
        'Inspeção detalhada de estruturas',
        'Mapeamento de terrenos complexos',
        'Monitoramento de progresso'
      ),
      'bestFor', 'Projetos de grande escala e inspeções detalhadas'
    ),
    jsonb_build_object(
      'name', 'Autel Alpha',
      'variant', 'Industrial',
      'image', '/images/products/alpha/1.png',
      'features', jsonb_build_array(
        'Gimbal DG-L35T (zoom óptico 35x + térmicas 13/45 mm)',
        'Autonomy Engine com sensores 360° + radar 60G/24G',
        'Alcance de voo até 30 km e autonomia de 40 min',
        'RTK integrado e telêmetro laser 2000 m'
      ),
      'applications', jsonb_build_array(
        'Levantamentos de precisão milimétrica',
        'Inspeções de infraestrutura crítica',
        'Mapeamento de áreas remotas',
        'Projetos de engenharia complexos'
      ),
      'bestFor', 'Projetos de alta precisão e infraestrutura crítica'
    )
  ),
  applications = jsonb_build_array(
    jsonb_build_object(
      'title', 'Levantamentos Topográficos',
      'description', 'Mapeamento preciso de terrenos para projetos de engenharia',
      'image', '/images/solucoes/casos-uso-construcao/levantamentos-topograficos.jpg',
      'features', jsonb_build_array(),
      'results', jsonb_build_array('Precisão centimétrica', 'Redução de 80% no tempo', 'Dados integrados ao BIM')
    ),
    jsonb_build_object(
      'title', 'Inspeção de Estruturas',
      'description', 'Verificação térmica e visual de edifícios e pontes',
      'image', '/images/solucoes/casos-uso-construcao/inspecao-estruturas.jpg',
      'features', jsonb_build_array(),
      'results', jsonb_build_array('Detecção de falhas', 'Relatórios automatizados', 'Manutenção preditiva')
    ),
    jsonb_build_object(
      'title', 'Mapeamento Urbano',
      'description', 'Cadastro territorial e planejamento urbano',
      'image', '/images/solucoes/casos-uso-construcao/mapeamento-urbano.jpg',
      'features', jsonb_build_array(),
      'results', jsonb_build_array('Ortofotos atualizadas', 'Modelos 3D precisos', 'Planejamento otimizado')
    ),
    jsonb_build_object(
      'title', 'Medição de Volumes',
      'description', 'Cálculo preciso de volumes de terra e materiais',
      'image', '/images/solucoes/casos-uso-construcao/medicao-volumes.jpg',
      'features', jsonb_build_array(),
      'results', jsonb_build_array('Medições automáticas', 'Controle de estoque', 'Otimização de custos')
    )
  ),
  use_cases = jsonb_build_array(
    jsonb_build_object(
      'title', 'Levantamentos Topográficos',
      'description', 'Mapeamento preciso de terrenos para projetos de engenharia',
      'image', '/images/solucoes/casos-uso-construcao/levantamentos-topograficos.jpg',
      'results', jsonb_build_array('Precisão centimétrica', 'Redução de 80% no tempo', 'Dados integrados ao BIM'),
      'alignTop', false
    ),
    jsonb_build_object(
      'title', 'Inspeção de Estruturas',
      'description', 'Verificação térmica e visual de edifícios e pontes',
      'image', '/images/solucoes/casos-uso-construcao/inspecao-estruturas.jpg',
      'results', jsonb_build_array('Detecção de falhas', 'Relatórios automatizados', 'Manutenção preditiva'),
      'alignTop', true
    ),
    jsonb_build_object(
      'title', 'Mapeamento Urbano',
      'description', 'Cadastro territorial e planejamento urbano',
      'image', '/images/solucoes/casos-uso-construcao/mapeamento-urbano.jpg',
      'results', jsonb_build_array('Ortofotos atualizadas', 'Modelos 3D precisos', 'Planejamento otimizado'),
      'alignTop', true
    ),
    jsonb_build_object(
      'title', 'Medição de Volumes',
      'description', 'Cálculo preciso de volumes de terra e materiais',
      'image', '/images/solucoes/casos-uso-construcao/medicao-volumes.jpg',
      'results', jsonb_build_array('Medições automáticas', 'Controle de estoque', 'Otimização de custos'),
      'alignTop', true
    )
  ),
  theme_colors = jsonb_build_object(
    'primary', 'blue',
    'secondary', 'blue',
    'badge_bg', 'bg-blue-100',
    'badge_text', 'text-blue-700'
  )
WHERE slug = 'construcao';

-- Inspeção Industrial e Energia
UPDATE public.solutions
SET
  hero_section = jsonb_build_object(
    'badge_text', 'Inspeção Industrial e Energia',
    'badge_icon', 'Factory',
    'title', 'Precisão e Segurança Operacional',
    'description', 'Maximize a eficiência e segurança das suas instalações. Inspeções térmicas avançadas em energia, óleo & gás, mineração, detecção precoce de hotspots e operações BVLOS que reduzem paradas não planejadas em até 60%.',
    'cta_primary_text', 'Solicitar Orçamento',
    'cta_secondary_text', 'Ver Drones',
    'hero_image_url', '/images/lifestyle/oil-and-gas-1.jpg',
    'gradient_colors', jsonb_build_array('from-orange-50', 'to-white')
  ),
  benefits = jsonb_build_array(
    jsonb_build_object('icon', 'Shield', 'title', 'Segurança', 'description', 'Inspeções sem exposição a riscos operacionais'),
    jsonb_build_object('icon', 'Thermometer', 'title', 'Detecção Térmica', 'description', 'Identificação precoce de falhas e hotspots'),
    jsonb_build_object('icon', 'Eye', 'title', 'Visão Noturna', 'description', 'Monitoramento 24/7 com tecnologia Starlight'),
    jsonb_build_object('icon', 'Target', 'title', 'Precisão', 'description', 'Inspeções detalhadas com zoom até 560x')
  ),
  drones = jsonb_build_array(
    jsonb_build_object(
      'name', 'EVO Lite Enterprise',
      'variant', '640T',
      'image', '/images/products/evo_lite/640t/1.png',
      'features', jsonb_build_array(
        'Câmera térmica 640×512 com zoom digital 1-16x',
        'Sensor visível 1/2" 48 MP com modo antifog',
        'Faixa radiométrica -20°C a 150°C / 0 a 550°C',
        'Precisão ±3°C ou ±3% (maior valor)'
      ),
      'applications', jsonb_build_array(
        'Inspeção de painéis solares',
        'Verificação de equipamentos elétricos',
        'Monitoramento de motores',
        'Detecção de hotspots'
      ),
      'bestFor', 'Inspeções térmicas de médio alcance'
    ),
    jsonb_build_object(
      'name', 'EVO Max V2',
      'variant', '4N',
      'image', '/images/products/evo_max/4n/1.png',
      'features', jsonb_build_array(
        'Visão noturna Starlight',
        'Câmera térmica 640×512',
        'Zoom digital 8x',
        'Alcance de até 15km (FCC) ou 8km (SRRC/CE)'
      ),
      'applications', jsonb_build_array(
        'Inspeções noturnas',
        'Monitoramento 24/7',
        'Inspeção de linhas de transmissão',
        'Operações em áreas remotas'
      ),
      'bestFor', 'Inspeções noturnas e operações BVLOS'
    ),
    jsonb_build_object(
      'name', 'Autel Alpha',
      'variant', 'Industrial',
      'image', '/images/products/alpha/1.png',
      'features', jsonb_build_array(
        'Gimbal DG-L35T (zoom óptico 35x + térmicas 13/45 mm)',
        'Autonomy Engine com sensores 360° + radar 60G/24G',
        'Alcance de voo até 30 km e autonomia de 40 min',
        'RTK integrado e telêmetro laser 2000 m'
      ),
      'applications', jsonb_build_array(
        'Inspeções de infraestrutura crítica',
        'Monitoramento de oleodutos',
        'Inspeção de minas',
        'Operações de longo alcance'
      ),
      'bestFor', 'Infraestrutura crítica e operações complexas'
    )
  ),
  applications = jsonb_build_array(
    jsonb_build_object(
      'title', 'Energia Solar',
      'description', 'Inspeção térmica de painéis solares e detecção de falhas',
      'image', '/images/solucoes/setores-atendidos/energia-solar.jpg',
      'features', jsonb_build_array(
        'Detecção de hot spots em painéis',
        'Mapeamento de falhas em usinas',
        'Monitoramento de performance',
        'Relatórios automatizados'
      ),
      'results', jsonb_build_array('Redução de 60% em paradas', 'Detecção precoce de falhas', 'ROI comprovado')
    ),
    jsonb_build_object(
      'title', 'Óleo & Gás',
      'description', 'Monitoramento de oleodutos, gasodutos e instalações offshore',
      'image', '/images/solucoes/setores-atendidos/oleo-gas.jpg',
      'features', jsonb_build_array(
        'Inspeção de oleodutos',
        'Monitoramento de plataformas',
        'Detecção de vazamentos',
        'Inspeção de torres'
      ),
      'results', jsonb_build_array('Segurança operacional', 'Redução de custos', 'Compliance regulatório')
    ),
    jsonb_build_object(
      'title', 'Mineração',
      'description', 'Inspeção de equipamentos, pilhas de rejeito e áreas de risco',
      'image', '/images/solucoes/inspecao-industrial/mineracao.jpg',
      'features', jsonb_build_array(
        'Inspeção de equipamentos pesados',
        'Monitoramento de pilhas de rejeito',
        'Mapeamento de áreas de risco',
        'Planejamento de operações'
      ),
      'results', jsonb_build_array('Otimização de operações', 'Redução de riscos', 'Eficiência operacional')
    ),
    jsonb_build_object(
      'title', 'Transmissão de Energia',
      'description', 'Inspeção de linhas de transmissão, torres e subestações',
      'image', '/images/solucoes/inspecao-industrial/transmissao-energia.jpg',
      'features', jsonb_build_array(
        'Inspeção de linhas de transmissão',
        'Verificação de torres',
        'Monitoramento de subestações',
        'Detecção de vegetação'
      ),
      'results', jsonb_build_array('Manutenção preditiva', 'Redução de falhas', 'Otimização de recursos')
    )
  ),
  use_cases = jsonb_build_array(
    jsonb_build_object(
      'title', 'Inspeção Térmica de Painéis Solares',
      'description', 'Detecção automática de hot spots e falhas em usinas solares',
      'icon', 'Zap',
      'benefits', jsonb_build_array('Redução de 60% em paradas não planejadas', 'Detecção precoce de falhas', 'ROI de 300% em 12 meses')
    ),
    jsonb_build_object(
      'title', 'Monitoramento de Oleodutos',
      'description', 'Inspeção contínua de dutos e detecção de vazamentos',
      'icon', 'Factory',
      'benefits', jsonb_build_array('Segurança operacional máxima', 'Compliance regulatório', 'Redução de custos de manutenção')
    ),
    jsonb_build_object(
      'title', 'Inspeção de Linhas de Transmissão',
      'description', 'Verificação detalhada de torres e cabos de alta tensão',
      'icon', 'Eye',
      'benefits', jsonb_build_array('Manutenção preditiva', 'Redução de falhas', 'Otimização de recursos')
    ),
    jsonb_build_object(
      'title', 'Monitoramento de Minas',
      'description', 'Inspeção de equipamentos e monitoramento de áreas de risco',
      'icon', 'AlertTriangle',
      'benefits', jsonb_build_array('Segurança operacional', 'Otimização de operações', 'Redução de riscos')
    )
  ),
  theme_colors = jsonb_build_object(
    'primary', 'orange',
    'secondary', 'orange',
    'badge_bg', 'bg-orange-100',
    'badge_text', 'text-orange-700'
  )
WHERE slug = 'industrial';

-- Segurança Pública e Defesa Civil
UPDATE public.solutions
SET
  hero_section = jsonb_build_object(
    'badge_text', 'Segurança Pública e Defesa Civil',
    'badge_icon', 'Shield',
    'title', 'Proteção e Resposta Estratégica',
    'description', 'Amplie suas capacidades operacionais com tecnologia de vigilância avançada. Visão 360°, patrulha inteligente, gestão de tráfego urbano e resposta rápida a emergências com visão noturna de última geração.',
    'cta_primary_text', 'Solicitar Orçamento',
    'cta_secondary_text', 'Ver Drones',
    'hero_image_url', '/images/lifestyle/public-safety-1-alpha.jpg',
    'gradient_colors', jsonb_build_array('from-blue-50', 'to-white')
  ),
  benefits = jsonb_build_array(
    jsonb_build_object('icon', 'Eye', 'title', 'Visão 360°', 'description', 'Monitoramento completo de áreas extensas'),
    jsonb_build_object('icon', 'Clock', 'title', 'Resposta Rápida', 'description', 'Chegada em minutos a qualquer local'),
    jsonb_build_object('icon', 'Shield', 'title', 'Segurança', 'description', 'Operações sem exposição de pessoal'),
    jsonb_build_object('icon', 'Camera', 'title', 'Documentação', 'description', 'Evidências em tempo real com vídeo 4K')
  ),
  drones = jsonb_build_array(
    jsonb_build_object(
      'name', 'EVO Lite Enterprise',
      'variant', '640T',
      'image', '/images/products/evo_lite/640t/1.png',
      'features', jsonb_build_array(
        'Carga útil 640T (térmica 640×512) ou 6K (sensor 1" 20 MP)',
        'Autonomia de até 40 minutos',
        'Transmissão até 12 km (FCC) / 6 km (CE)',
        'Detecção tridirecional 0.2-30 m'
      ),
      'applications', jsonb_build_array(
        'Patrulhamento urbano',
        'Busca e resgate',
        'Monitoramento de eventos',
        'Fiscalização de trânsito'
      ),
      'bestFor', 'Operações urbanas e patrulhamento'
    ),
    jsonb_build_object(
      'name', 'EVO Max V2',
      'variant', '4N',
      'image', '/images/products/evo_max/4n/1.png',
      'features', jsonb_build_array(
        'Visão noturna Starlight',
        'Zoom digital 8x',
        'Alcance de até 15km (FCC) ou 8km (SRRC/CE)',
        'Evitação 720°'
      ),
      'applications', jsonb_build_array(
        'Operações noturnas',
        'Monitoramento 24/7',
        'Busca em áreas extensas',
        'Operações táticas'
      ),
      'bestFor', 'Operações noturnas e táticas'
    ),
    jsonb_build_object(
      'name', 'Autel Alpha',
      'variant', 'Industrial',
      'image', '/images/products/alpha/1.png',
      'features', jsonb_build_array(
        'Gimbal DG-L35T (zoom óptico 35x + térmicas 13/45 mm)',
        'Autonomy Engine com sensores 360° + radar 60G/24G',
        'Alcance de voo até 30 km e autonomia de 40 min',
        'RTK integrado e telêmetro laser 2000 m'
      ),
      'applications', jsonb_build_array(
        'Operações de longo alcance',
        'Inspeção de infraestrutura',
        'Missões táticas complexas',
        'Monitoramento de fronteiras'
      ),
      'bestFor', 'Operações críticas e de longo alcance'
    )
  ),
  applications = jsonb_build_array(
    jsonb_build_object(
      'title', 'Patrulhamento Inteligente',
      'description', 'Monitoramento proativo de áreas urbanas e rurais',
      'image', '/images/solucoes/seguranca-publica/patrulhamento-inteligente.jpg',
      'features', jsonb_build_array(
        'Roteiros automatizados',
        'Detecção de anomalias',
        'Alertas em tempo real',
        'Integração com CCO'
      ),
      'results', jsonb_build_array('Redução de 40% em crimes', 'Resposta 3x mais rápida', 'Cobertura 24/7')
    ),
    jsonb_build_object(
      'title', 'Busca e Resgate',
      'description', 'Localização eficiente de pessoas desaparecidas',
      'image', '/images/solucoes/seguranca-publica/busca-resgate.jpg',
      'features', jsonb_build_array(
        'Câmera térmica para busca noturna',
        'Alcance de até 15km (FCC) ou 8km (SRRC/CE)',
        'Zoom para identificação',
        'Comunicação com equipes'
      ),
      'results', jsonb_build_array('Localização 5x mais rápida', 'Sucesso em 90% dos casos', 'Operação segura')
    ),
    jsonb_build_object(
      'title', 'Gestão de Tráfego',
      'description', 'Monitoramento e fiscalização de trânsito',
      'image', '/images/solucoes/seguranca-publica/gestao-trafego.jpg',
      'features', jsonb_build_array(
        'Monitoramento de congestionamentos',
        'Detecção de infrações',
        'Controle de velocidade',
        'Relatórios automáticos'
      ),
      'results', jsonb_build_array('Redução de 30% em acidentes', 'Fiscalização eficiente', 'Dados em tempo real')
    ),
    jsonb_build_object(
      'title', 'Monitoramento de Eventos',
      'description', 'Segurança em eventos de massa e manifestações',
      'image', '/images/solucoes/seguranca-publica/monitoramento-eventos.jpg',
      'features', jsonb_build_array(
        'Visão aérea completa',
        'Detecção de aglomerações',
        'Monitoramento de perimetral',
        'Comunicação com comando'
      ),
      'results', jsonb_build_array('Segurança garantida', 'Resposta rápida', 'Documentação completa')
    )
  ),
  use_cases = jsonb_build_array(
    jsonb_build_object(
      'title', 'Operações de Busca e Resgate',
      'description', 'Localização eficiente de pessoas desaparecidas em áreas extensas',
      'icon', 'Users',
      'benefits', jsonb_build_array('Localização 5x mais rápida', 'Operação segura para equipes', 'Cobertura noturna com térmica')
    ),
    jsonb_build_object(
      'title', 'Patrulhamento Preventivo',
      'description', 'Monitoramento proativo de áreas de risco e pontos críticos',
      'icon', 'Shield',
      'benefits', jsonb_build_array('Redução de 40% em crimes', 'Resposta 3x mais rápida', 'Cobertura 24/7')
    ),
    jsonb_build_object(
      'title', 'Fiscalização de Trânsito',
      'description', 'Monitoramento e controle de infrações de trânsito',
      'icon', 'Car',
      'benefits', jsonb_build_array('Redução de 30% em acidentes', 'Fiscalização eficiente', 'Dados em tempo real')
    ),
    jsonb_build_object(
      'title', 'Segurança em Eventos',
      'description', 'Monitoramento de eventos de massa e manifestações',
      'icon', 'Camera',
      'benefits', jsonb_build_array('Segurança garantida', 'Resposta rápida', 'Documentação completa')
    )
  ),
  theme_colors = jsonb_build_object(
    'primary', 'blue',
    'secondary', 'blue',
    'badge_bg', 'bg-blue-100',
    'badge_text', 'text-blue-700'
  )
WHERE slug = 'seguranca';

-- Resgate e Emergências
UPDATE public.solutions
SET
  hero_section = jsonb_build_object(
    'badge_text', 'Resgate e Emergências',
    'badge_icon', 'Siren',
    'title', 'Salvamento e Preservação de Vidas',
    'description', 'Salve vidas com tecnologia que não falha. Busca e resgate eficaz, combate a incêndios florestais, localização de vítimas em minutos e avaliação de danos em tempo real, mesmo em áreas remotas.',
    'cta_primary_text', 'Solicitar Orçamento',
    'cta_secondary_text', 'Ver Drones',
    'hero_image_url', '/images/lifestyle/rescue-2.jpg',
    'gradient_colors', jsonb_build_array('from-red-50', 'to-white')
  ),
  benefits = jsonb_build_array(
    jsonb_build_object('icon', 'Clock', 'title', 'Resposta Rápida', 'description', 'Chegada em minutos a qualquer local de emergência'),
    jsonb_build_object('icon', 'Thermometer', 'title', 'Detecção Térmica', 'description', 'Localização de vítimas mesmo em condições adversas'),
    jsonb_build_object('icon', 'Eye', 'title', 'Visão Noturna', 'description', 'Operações 24/7 com tecnologia Starlight'),
    jsonb_build_object('icon', 'Heart', 'title', 'Salvamento', 'description', 'Tecnologia que salva vidas em situações críticas')
  ),
  drones = jsonb_build_array(
    jsonb_build_object(
      'name', 'EVO Lite Enterprise',
      'variant', '640T',
      'image', '/images/products/evo_lite/640t/1.png',
      'features', jsonb_build_array(
        'Carga útil 640T (térmica 640×512) ou 6K (sensor 1" 20 MP)',
        'Autonomia de até 40 minutos',
        'Transmissão até 12 km (FCC) / 6 km (CE)',
        'Detecção tridirecional 0.2-30 m'
      ),
      'applications', jsonb_build_array(
        'Busca de vítimas com térmica',
        'Resgate em áreas urbanas',
        'Monitoramento de incêndios',
        'Operações de emergência'
      ),
      'bestFor', 'Resgates urbanos e emergências'
    ),
    jsonb_build_object(
      'name', 'EVO Max V2',
      'variant', '4N',
      'image', '/images/products/evo_max/4n/1.png',
      'features', jsonb_build_array(
        'Visão noturna Starlight',
        'Zoom digital 8x',
        'Alcance de até 15km (FCC) ou 8km (SRRC/CE)',
        'Operações BVLOS'
      ),
      'applications', jsonb_build_array(
        'Busca em áreas extensas',
        'Resgate noturno',
        'Combate a incêndios',
        'Operações remotas'
      ),
      'bestFor', 'Operações noturnas e áreas remotas'
    ),
    jsonb_build_object(
      'name', 'Autel Alpha',
      'variant', 'Industrial',
      'image', '/images/products/alpha/1.png',
      'features', jsonb_build_array(
        'Gimbal DG-L35T (zoom óptico 35x + térmicas 13/45 mm)',
        'Autonomy Engine com sensores 360° + radar 60G/24G',
        'Alcance de voo até 30 km e autonomia de 40 min',
        'RTK integrado e telêmetro laser 2000 m'
      ),
      'applications', jsonb_build_array(
        'Busca de longo alcance',
        'Resgate em desastres',
        'Monitoramento de fronteiras',
        'Operações complexas'
      ),
      'bestFor', 'Missões críticas e de longo alcance'
    )
  ),
  applications = jsonb_build_array(
    jsonb_build_object(
      'title', 'Busca e Resgate de Vítimas',
      'description', 'Localização eficiente de pessoas desaparecidas com câmera térmica',
      'image', '/images/solucoes/resgate-emergencias/busca-resgate-vitimas.jpg',
      'features', jsonb_build_array(
        'Detecção térmica de vítimas',
        'Busca em áreas extensas',
        'Operação noturna',
        'Comunicação com equipes'
      ),
      'results', jsonb_build_array('Localização 5x mais rápida', 'Sucesso em 90% dos casos', 'Operação segura')
    ),
    jsonb_build_object(
      'title', 'Combate a Incêndios Florestais',
      'description', 'Prevenção e combate eficaz a incêndios com detecção precoce',
      'image', '/images/solucoes/resgate-emergencias/combate-incendios-florestais.jpg',
      'features', jsonb_build_array(
        'Detecção de focos de incêndio',
        'Monitoramento de propagação',
        'Coordenação de equipes',
        'Mapeamento de áreas afetadas'
      ),
      'results', jsonb_build_array('Detecção precoce', 'Redução de 50% em danos', 'Coordenação eficiente')
    ),
    jsonb_build_object(
      'title', 'Resposta a Desastres',
      'description', 'Avaliação rápida de danos e coordenação de resgate',
      'image', '/images/solucoes/resgate-emergencias/resposta-desastres.jpg',
      'features', jsonb_build_array(
        'Avaliação de danos',
        'Mapeamento de áreas afetadas',
        'Localização de vítimas',
        'Coordenação de resgate'
      ),
      'results', jsonb_build_array('Avaliação em tempo real', 'Resposta coordenada', 'Redução de riscos')
    ),
    jsonb_build_object(
      'title', 'Monitoramento Ambiental',
      'description', 'Prevenção de queimadas e monitoramento de áreas de risco',
      'image', '/images/solucoes/resgate-emergencias/monitoramento-ambiental.jpg',
      'features', jsonb_build_array(
        'Monitoramento de queimadas',
        'Detecção de focos',
        'Mapeamento de áreas de risco',
        'Alertas preventivos'
      ),
      'results', jsonb_build_array('Prevenção eficaz', 'Redução de incêndios', 'Proteção ambiental')
    )
  ),
  use_cases = jsonb_build_array(
    jsonb_build_object(
      'title', 'Busca de Pessoas Desaparecidas',
      'description', 'Localização eficiente de vítimas em áreas extensas e remotas',
      'icon', 'Heart',
      'benefits', jsonb_build_array('Localização 5x mais rápida', 'Operação segura para equipes', 'Cobertura noturna com térmica')
    ),
    jsonb_build_object(
      'title', 'Combate a Incêndios',
      'description', 'Prevenção e combate eficaz a incêndios florestais',
      'icon', 'Flame',
      'benefits', jsonb_build_array('Detecção precoce de focos', 'Redução de 50% em danos', 'Coordenação eficiente')
    ),
    jsonb_build_object(
      'title', 'Resposta a Desastres',
      'description', 'Avaliação rápida de danos e coordenação de resgate',
      'icon', 'Siren',
      'benefits', jsonb_build_array('Avaliação em tempo real', 'Resposta coordenada', 'Redução de riscos')
    ),
    jsonb_build_object(
      'title', 'Monitoramento Ambiental',
      'description', 'Prevenção de queimadas e proteção de áreas naturais',
      'icon', 'MapPin',
      'benefits', jsonb_build_array('Prevenção eficaz', 'Redução de incêndios', 'Proteção ambiental')
    )
  ),
  theme_colors = jsonb_build_object(
    'primary', 'red',
    'secondary', 'red',
    'badge_bg', 'bg-red-100',
    'badge_text', 'text-red-700'
  )
WHERE slug = 'resgate';

