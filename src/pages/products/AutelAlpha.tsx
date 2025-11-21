import React, { useState, useEffect, useRef } from 'react';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductStickyMenu } from '@/components/products/ProductStickyMenu';
import { ProductTechnicalData } from '@/components/products/ProductTechnicalData';
import { ProductVideoGallery } from '@/components/products/ProductVideoGallery';
import { ProductApplications } from '@/components/products/ProductApplications';
import { SEOHead } from '@/components/SEO/SEOHead';
import { ProductSchema } from '@/components/SEO/StructuredData';
import { getProductFamilyBySlug } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileFloatingCTA from '@/components/MobileFloatingCTA';
import {
  Radar,
  ShieldCheck,
  Navigation,
  Share2,
  ZoomIn,
  Target,
  BatteryCharging,
  RadioTower,
  CloudRain,
  Thermometer,
  Lock,
  Radio
} from 'lucide-react';

const AutelAlpha: React.FC = () => {
  const productFamily = getProductFamilyBySlug('autel-alpha');

  if (!productFamily) {
    return <div>Produto não encontrado</div>;
  }

  const currentVariant = productFamily.variants[0]; // Autel Alpha has only one variant

  const downloads = [
    {
      title: 'Brochure Autel Alpha',
      description: 'Catálogo completo com especificações e aplicações',
      url: productFamily.brochure,
      type: 'pdf' as const,
      size: '2.5 MB'
    },
    {
      title: 'Manual do Usuário',
      description: 'Guia completo de operação e configuração',
      url: '/downloads/EN_Autel_Alpha_User_Manual_V1.1.pdf',
      type: 'pdf' as const,
      size: '15.2 MB'
    },
    {
      title: 'Especificações Técnicas',
      description: 'Planilha detalhada com todas as especificações',
      url: '/downloads/Autel_Alpha_Specification.xlsx',
      type: 'xlsx' as const,
      size: '850 KB'
    },
    {
      title: 'Lista de Embalagem',
      description: 'Conteúdo da embalagem e acessórios inclusos',
      url: '/downloads/Autel_Alpha_Packing_List.pdf',
      type: 'pdf' as const,
      size: '1.2 MB'
    },
    {
      title: 'Certificações',
      description: 'Documentos de certificação e conformidade',
      url: '/downloads/Autel_Alpha_Certifications.pdf',
      type: 'pdf' as const,
      size: '3.1 MB'
    }
  ];

  // Use only product images for the header
  const productImages = productFamily.photoGallery.product;

  const menuItems = [
    { id: 'product-description', label: 'Descrição do Produto' },
    { id: 'destaques', label: 'Destaques' },
    { id: 'dados-tecnicos', label: 'Dados Técnicos' },
    { id: 'acessorios', label: 'Acessórios' },
    { id: 'dados-comerciais', label: 'Dados Comerciais e de Apoio' },
    { id: 'applications', label: 'Aplicações' },
    { id: 'videos', label: 'Vídeos' }
  ];

  const [selectedCameraFeature, setSelectedCameraFeature] = useState('super-zoom');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Ignora erros de autoplay
      });
    }
  }, [selectedCameraFeature]);

  const cameraFeatures = {
    'super-zoom': {
      title: 'Super Zoom',
      description: 'A câmera de zoom suporta zoom óptico 4K 35x e zoom híbrido máximo de 560x com observação clara de até 8 quilômetros de distância. Potencializa eficientemente aplicações como inspeção de longa distância.',
      video: 'https://www.autelrobotics.com/wp-content/uploads/2025/01/alpha-s3-video1.mp4'
    },
    'thermal': {
      title: 'Percepção Térmica Forte',
      description: 'A câmera térmica suporta zoom híbrido 56x, lentes de imagem térmica dupla, com resolução de 640×512. Possui lente grande angular de 13mm e lente teleobjetiva de 45mm, atendendo visão geral com distâncias focais curtas e visualização orientada a detalhes com distâncias focais longas.',
      video: 'https://www.autelrobotics.com/wp-content/uploads/2025/01/alpha-s3-video2.mp4'
    },
    'sensitive': {
      title: 'Imagem Super-sensível',
      description: 'Suporta redução de ruído multi-quadro inteligente por hardware e tecnologia de fusão HDR, mesmo em condições de luz da lua, pode capturar detalhes do alvo, atendendo às necessidades de vários cenários de captura.',
      video: 'https://www.autelrobotics.com/wp-content/uploads/2025/01/alpha-s3-video3.mp4'
    },
    'ranging': {
      title: 'Medição Precisa',
      description: 'O telêmetro laser suporta posicionamento de ponto com um clique, permitindo aquisição rápida de posições de alvo, com distância máxima de medição de até 2 quilômetros.',
      video: 'https://www.autelrobotics.com/wp-content/uploads/2025/01/alpha-s3-video4.mp4'
    }
  };

  const featureHighlights = [
    {
      icon: ShieldCheck,
      title: 'Anti-interferência Superior',
      description: 'Protege os sinais de controle mesmo em ambientes com forte interferência eletromagnética.'
    },
    {
      icon: Navigation,
      title: 'Navegação Visual de Alta Precisão',
      description: 'Sensores visuais de alta precisão garantem trajetórias confiáveis em cenários complexos.'
    },
    {
      icon: Target,
      title: 'Reconhecimento e Posicionamento de Alvo por IA',
      description: 'Identifica e rastreia pessoas, veículos e fontes de calor automaticamente.'
    },
    {
      icon: Thermometer,
      title: 'Câmera Térmica Dupla 56x',
      description: 'Sistema térmico dual com zoom híbrido 56x para detecção precisa em qualquer condição.'
    },
    {
      icon: ZoomIn,
      title: 'Zoom Óptico 4K 35x',
      description: 'Câmera de zoom 4K com zoom óptico contínuo 35x e zoom híbrido expandido.'
    },
    {
      icon: CloudRain,
      title: 'Classificação IP55',
      description: 'Operação confiável sob chuva e poeira com classificação IP55.'
    },
    {
      icon: BatteryCharging,
      title: 'Bateria Hot-swappable',
      description: 'Troca de bateria sem desligar o equipamento para missões ininterruptas.'
    },
    {
      icon: Radar,
      title: 'Evitação de Obstáculos e Traçado de Caminho em Nível de Fio',
      description: 'Detecção precisa de fios e obstáculos finos com tecnologia avançada de sensores.'
    },
    {
      icon: RadioTower,
      title: 'Alcance de Transmissão de Vídeo de 15 Quilômetros',
      description: 'Link de vídeo estável até 15 km com redundância multi banda.'
    },
    {
      icon: Share2,
      title: 'Expansão Flexível de Carga Útil',
      description: 'Plataforma PSDK aberta para integração de sensores e acessórios personalizados.'
    }
  ];

  const missionCards = [
    {
      title: 'Missão Poligonal',
      description: 'Suporta geração automática de áreas de voo poligonais com um clique.',
      image: '/images/destaques/evo-max/mission-polygon.webp'
    },
    {
      title: 'Missão por Pontos',
      description: 'Permite adicionar waypoints flexíveis e trajetórias não estruturadas.',
      image: '/images/destaques/evo-max/mission-waypoint.webp'
    },
    {
      title: 'Geração Automática de Missão e Coleta de Dados*',
      description: 'Produz rotas automaticamente adicionando pontos de contorno ou importando arquivos KML.',
      image: '/images/destaques/evo-max/mission-auto.webp'
    }
  ];

  const appFeatureCards = [
    {
      title: 'Tripod',
      description: 'O gimbal bloqueia no alvo e segue o movimento do alvo enquanto pairando, garantindo que o alvo permaneça no centro do quadro.',
      image: 'https://app.autelrobotics.cn/statics/cdn/Alpha/en/mbsd.jpg'
    },
    {
      title: 'Reconhecimento de Alvo por IA',
      description: 'Com base na tecnologia de reconhecimento por IA da Autel, o Autel Alpha pode identificar e bloquear automaticamente diferentes tipos de alvos, como humanos, barcos ou veículos através de câmeras de zoom, grande angular ou infravermelho, projetando a localização do alvo no mapa.',
      image: 'https://www.autelrobotics.cn/wp-content/uploads/2024/02/ai.jpg'
    },
    {
      title: 'Telêmetro Laser',
      description: 'Clique na tela do controle remoto, e mostrará a latitude, longitude, altura e outras informações do alvo rapidamente.',
      image: 'https://app.autelrobotics.cn/statics/cdn/Alpha/en/cj.jpg'
    }
  ];

  const dataSecurityCards = [
    {
      icon: ShieldCheck,
      title: 'Proteção de Privacidade',
      description: 'Logs de voo, localização e dados sensíveis só são enviados com autorização do usuário.'
    },
    {
      icon: Lock,
      title: 'Armazenamento Criptografado',
      description: 'Criptografia AES para fotos, vídeos e logs, com acesso protegido por senha.'
    },
    {
      icon: Radio,
      title: 'Transmissão de Vídeo',
      description: 'Suporte RTMP e GB28181* para streaming ao vivo e análise remota em tempo real.'
    }
  ];

  const optionalModules = [
    {
      title: 'Autel Smart Controller V3',
      description: 'Eleve sua operação com o controle inteligente mais avançado da Autel. Tela premium de 7,9 polegadas com brilho extraordinário de 2000 nits garante visibilidade perfeita mesmo sob sol intenso. Desfrute de downloads ultrarrápidos de até 20MB/s direto para seu dispositivo móvel. Conecte monitores externos via HDMI e expanda suas capacidades com módulo 4G opcional. Bateria de longa duração mantém você em campo por até 4,5 horas contínuas, com recarga rápida em apenas 2 horas. 128GB de armazenamento interno oferece espaço abundante para apps e mídias de missão. Transforme sua produtividade em campo.',
      image: 'https://www.autelrobotics.com/wp-content/uploads/2025/03/img_alpha_remote_controller.png'
    },
    {
      title: 'Combo Alto-falante e Holofote (opcional)',
      description: 'Potencialize suas operações de segurança pública e emergências com comunicação e iluminação integradas. Alto-falante de 10W com pressão sonora de 114db transmite mensagens claras a mais de 300 metros de distância. Holofote inteligente acompanha automaticamente a inclinação do gimbal, oferecendo iluminação precisa e ajustável de 30° a -90°. Instalação rápida e simples via interface PSDK padrão. Compacto e leve (250g), resistente a temperaturas extremas de -10°C a 50°C. A solução completa para missões noturnas e comunicação de campo.',
      image: 'https://www.autelrobotics.com/wp-content/uploads/2025/01/alpha-s13-img2-1.png'
    },
    {
      title: 'Dispositivo de Detecção de Rádio Tracer Air (opcional)',
      description: 'Tecnologia de ponta para identificação e localização de fontes de interferência. Detecte até 6 fontes de rádio simultaneamente em bandas 2.4G, 5.2G e 5.8G, com alcance impressionante de 3km. Triangulação horizontal e vertical de alta precisão identifica posições de controladores UAV e fontes de interferência em tempo real, exibindo áreas-alvo potenciais no mapa. Combine com reconhecimento por IA para descoberta visual automática de pilotos. Essencial para operações de segurança pública, proteção de infraestrutura crítica e detecção de voos não autorizados. Compacto e leve para fácil integração.',
      image: 'https://www.autelrobotics.com/wp-content/uploads/2025/01/alpha-s13-img3.png'
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Autel Alpha | Drone BVLOS 20km - Inspeção Industrial | Aerion"
        description="Autel Alpha: drone profissional com alcance 20km BVLOS, câmera térmica, zoom 10x. Ideal para inspeção de linhas de transmissão, torres e infraestrutura crítica. Distribuidor oficial no Brasil."
        keywords="autel alpha, drone BVLOS, inspeção industrial, drone térmico, inspeção linhas transmissão, autel alpha brasil"
        canonical="https://aerion.com.br/produtos/autel-alpha"
        ogType="product"
      />
      <ProductSchema
        name="Autel Alpha"
        description="Drone profissional com alcance 20km BVLOS, câmera térmica, zoom 10x. Ideal para inspeção de linhas de transmissão, torres e infraestrutura crítica."
        brand="Autel Robotics"
        sku="AUTEL-ALPHA-001"
        image="/images/products/alpha/alpha-1.png"
        offers={{
          availability: "https://schema.org/InStock",
          priceCurrency: "BRL",
          seller: "Aerion Technologies",
        }}
      />
      <Header />
      
      <ProductStickyMenu items={menuItems} />
      
      {/* Product Header - E-commerce Layout */}
      <div id="product-description">
        <ProductHeader
          name={productFamily.name}
          description={productFamily.description}
          productCodes={productFamily.productCodes}
          keyFeatures={productFamily.keyFeatures}
          images={productImages}
          category="Drone Profissional"
        />
      </div>
      
      {/* Destaques Section */}
      <section id="destaques" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Logo/Title Section */}
          <div className="flex flex-col items-center text-center space-y-2">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">Autel Alpha</h2>
            <p className="text-xl sm:text-2xl text-gray-600">Além das fronteiras</p>
          </div>

          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl min-h-[380px] md:min-h-[420px] flex flex-col justify-end md:justify-center text-white shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://www.autelrobotics.com/wp-content/uploads/2025/02/alpha-new-banner.png')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />
            <div className="relative z-10 max-w-3xl w-full px-6 py-12 sm:px-10">
              <h3 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
                Autel Alpha
              </h3>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                O Autel Alpha é um drone industrial multifunção com design dobrável e proteção IP55, capaz de operar em ambientes adversos. Ele oferece voo autônomo aprimorado, alta resistência a interferências e um sistema RTK de antena dupla para controle milimétrico. Equipado com o gimbal DG-L35T, combina zoom híbrido de 560x, duas câmeras térmicas, câmera grande-angular e telêmetro laser, permitindo desde visão geral até identificação de pessoas a até 8 km. É uma solução avançada para segurança pública, inspeção de energia e gerenciamento de emergências.
              </p>
            </div>
          </div>

          {/* Resistência para Operações Críticas */}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                Resistência para Operações Críticas
              </h3>
              <p className="text-base sm:text-lg text-gray-700">
                O Alpha foi projetado para enfrentar ambientes severos, combinando proteção IP55, resistência a ventos de 12 m/s e capacidade de operar de –20°C a 50°C. Com hélices especiais, atinge altitudes de até 4.500 metros, garantindo desempenho estável e confiável mesmo em condições climáticas extremas.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <video
                className="w-full rounded-3xl shadow-xl aspect-video object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src="https://www.autelrobotics.com/wp-content/uploads/2025/02/alpha-s5-video1_1080.mp4" type="video/mp4" />
                Seu navegador não suporta a reprodução de vídeos.
              </video>
            </div>
          </div>

          {/* Three Vertical Images Section */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-3xl aspect-[9/16] shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://www.autelrobotics.com/wp-content/uploads/2025/02/bg_alpha_interference_resistance.png')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
              <div className="relative z-10 p-6 text-white h-full flex flex-col justify-start">
                <h4 className="text-2xl font-semibold mb-3">Capacidade Anti-interferência Excepcional</h4>
                <p className="text-sm leading-relaxed">
                  As capacidades de posicionamento visual de alta precisão do Autel Alpha, salto de frequência adaptativo e tecnologia de navegação SLAM capacitam resistência à interferência e permitem que o drone voe com confiança perto de linhas de energia, estruturas críticas e em áreas complexas.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl aspect-[9/16] shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://www.autelrobotics.com/wp-content/uploads/2025/02/bg_alpha_autonomous_flight.png')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
              <div className="relative z-10 p-6 text-white h-full flex flex-col justify-start">
                <h4 className="text-2xl font-semibold mb-3">Voo Autônomo</h4>
                <p className="text-sm leading-relaxed">
                  O Autonomy Engine da Autel está continuamente melhorando, permitindo funções como planejamento de caminho global e reconstrução de cena 3D em ambientes complexos. Oferece várias capacidades de evitação de obstáculos, incluindo retorno para casa, controle manual e planejamento de missão, fornecendo uma solução mais profissional para indústrias como segurança, inspeção e levantamento.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl aspect-[9/16] shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://www.autelrobotics.com/wp-content/uploads/2025/02/bg_alpha_omni_obstacle_avoidance.png')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
              <div className="relative z-10 p-6 text-white h-full flex flex-col justify-start">
                <h4 className="text-2xl font-semibold mb-3">Sem Pontos Cegos, Evitação de Obstáculos Definitiva</h4>
                <p className="text-sm leading-relaxed">
                  Ao integrar tecnologia de fusão de sensores multi-fonte, incluindo visão fisheye dual de 5 direções + radar de ondas milimétricas de 6 direções, o drone está equipado com capacidades de evitação de obstáculos e busca de caminho em nível de fio. Pode detectar obstáculos menores como vidro, postes e linhas de energia. Além disso, suporta evitação de obstáculos noturna para segurança de voo.
                </p>
              </div>
            </div>
          </div>

          {/* Hot-Swappable Batteries */}
          <div className="relative overflow-hidden rounded-3xl min-h-[420px] text-white shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://www.autelrobotics.cn/wp-content/uploads/2025/02/alpha-s7-img.png')"
              }}
            />
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 px-6 pt-16 pb-16 sm:px-10 text-center">
              <h3 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
                Baterias Hot-Swappable
              </h3>
              <p className="text-base sm:text-lg text-gray-100 max-w-3xl mx-auto">
                Adotando um design redundante de bateria dupla, o tempo de voo chega a 40 minutos, suportando baterias hot-swappable para operações contínuas e eficientes.
              </p>
            </div>
          </div>

          {/* SkyLink 3.0 Section */}
          <div className="relative overflow-hidden rounded-3xl min-h-[420px] text-white shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/destaques/alpha/s616338283273788564_p204_i51_w5768.webp')"
              }}
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 px-6 pt-10 pb-16 sm:px-10 lg:px-16 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl space-y-4">
                <h3 className="text-3xl sm:text-4xl font-semibold leading-tight">Transmissão de Alta Definição, Atualização de Performance</h3>
                <p className="text-base sm:text-lg text-gray-100">
                  Com o Autel Skylink 3.0, o sistema vem com 4 antenas, 4 bandas de frequência, permitindo uma distância de transmissão de até 15 quilômetros. Suporta salto de frequência automático em 900M/2.4GHz/5.2GHz/5.8GHz*, selecionando automaticamente o canal ideal com base na interferência eletromagnética para capacidades robustas anti-interferência, apresentando uma transmissão alta de 64Mbps e baixa latência de transmissão.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-6 py-4">
                  <div className="text-2xl font-semibold">15 quilômetros</div>
                  <div className="text-sm text-white/80">Distância de Transmissão de Imagem</div>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-6 py-4">
                  <div className="text-2xl font-semibold">1080P/30FPS</div>
                  <div className="text-sm text-white/80">Qualidade de Vídeo em Tempo Real</div>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-6 py-4">
                  <div className="text-2xl font-semibold">900 MHz/2.4 GHz/5.2GHz/5.8 GHz</div>
                  <div className="text-sm text-white/80">Bandas de Frequência*</div>
                </div>
                <p className="text-xs text-white/60">*A disponibilidade de bandas pode variar de acordo com a região.</p>
              </div>
            </div>
          </div>

          {/* Características Principais */}
          <div className="space-y-6">
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Características Principais</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              {featureHighlights.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-3xl border border-gray-100 bg-gray-50 px-6 py-8 shadow-sm">
                  <Icon className="h-8 w-8 text-blue-600" />
                  <h4 className="mt-4 text-lg font-semibold text-gray-900">{title}</h4>
                  <p className="mt-2 text-sm text-gray-700">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Múltiplas Capacidades de Carga Útil */}
          <div className="relative overflow-hidden rounded-3xl min-h-[420px] text-white shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://www.autelrobotics.com/wp-content/uploads/2025/02/alpha-s6-img-pc.png')"
              }}
            />
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 px-6 pt-16 pb-16 sm:px-10 text-center">
              <h3 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
                Múltiplas Capacidades de Carga Útil
              </h3>
              <p className="text-base sm:text-lg text-gray-100 max-w-3xl mx-auto">
                A aeronave apresenta múltiplas interfaces de montagem. A plataforma de desenvolvedores Autel PSDK está aberta para criar um novo ecossistema industrial, como holofotes, alto-falantes e muito mais.
              </p>
            </div>
          </div>

          {/* Gimbal e Câmeras */}
          <div className="bg-white text-gray-900 rounded-3xl px-6 py-12 sm:px-10 sm:py-14 shadow-xl border border-gray-100">
            <div className="max-w-3xl mb-10">
              <h3 className="text-3xl sm:text-4xl font-semibold leading-tight">Câmeras e Gimbal</h3>
              <p className="mt-4 text-base sm:text-lg text-gray-600">
                Conheça o sistema de câmeras do Autel Alpha com múltiplos sensores integrados.
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-center">
              <div className="md:w-1/2 flex justify-center">
                <img
                  src="/images/destaques/alpha/l35t.webp"
                  alt="Gimbal DG-L35T"
                  className="w-full max-w-md object-contain drop-shadow-2xl"
                />
              </div>
              <div className="md:w-1/2 space-y-5">
                <div>
                  <h4 className="text-3xl font-semibold leading-tight text-gray-900">Gimbal DG-L35T</h4>
                  <p className="text-sm uppercase tracking-wide text-gray-500">Sistema de Câmeras Quíntuplo</p>
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  <div className="border-b border-gray-200 pb-4">
                    <h5 className="font-semibold text-gray-900 uppercase tracking-wide text-xs sm:text-sm mb-1">
                      Câmera Zoom
                    </h5>
                    <p className="text-gray-700">8 MP, Zoom Óptico 4K 35x, Zoom Híbrido 560x, ISO até 160.000</p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h5 className="font-semibold text-gray-900 uppercase tracking-wide text-xs sm:text-sm mb-1">
                      Telêmetro Laser
                    </h5>
                    <p className="text-gray-700">Alcance 10-2000 m, Precisão &lt;400m: ±1m, &gt;400m: D×0,3%</p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h5 className="font-semibold text-gray-900 uppercase tracking-wide text-xs sm:text-sm mb-1">
                      Câmera Grande Angular
                    </h5>
                    <p className="text-gray-700">48 MP, Abertura F/2.8, DFOV 84°, Equivalente 24mm</p>
                  </div>
                  <div className="pb-4">
                    <h5 className="font-semibold text-gray-900 uppercase tracking-wide text-xs sm:text-sm mb-1">
                      Câmera Térmica Dupla
                    </h5>
                    <p className="text-gray-700">640×512, Zoom Híbrido 56x, Térmica Grande Angular 13mm, Térmica Longo Alcance 45mm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Camera Features */}
          <div className="space-y-6">
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Recursos da Câmera</h3>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="flex flex-wrap border-b border-gray-200">
                {Object.entries(cameraFeatures).map(([key, feature]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCameraFeature(key)}
                    className={`px-6 py-4 text-sm font-semibold transition-colors ${
                      selectedCameraFeature === key
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {feature.title}
                  </button>
                ))}
              </div>
              <div className="p-6 sm:p-10">
                <div className="mb-6">
                  <h4 className="text-2xl font-semibold text-gray-900 mb-3">
                    {cameraFeatures[selectedCameraFeature as keyof typeof cameraFeatures].title}
                  </h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {cameraFeatures[selectedCameraFeature as keyof typeof cameraFeatures].description}
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <video
                    key={selectedCameraFeature}
                    ref={videoRef}
                    className="w-full aspect-video object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  >
                    <source src={cameraFeatures[selectedCameraFeature as keyof typeof cameraFeatures].video} type="video/mp4" />
                    Seu navegador não suporta a reprodução de vídeos.
                  </video>
                </div>
              </div>
            </div>
          </div>

          {/* Múltiplos Tipos de Missão */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Múltiplos tipos de missão</h3>
              <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
                O aplicativo Enterprise oferece diversas missões autônomas e semiautônomas para segurança pública, inspeções e levantamentos, garantindo planejamento rápido e preciso em campo.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {missionCards.map(card => (
                <div key={card.title} className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                  <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
                  <div className="p-6 space-y-2">
                    <h4 className="text-xl font-semibold text-gray-900">{card.title}</h4>
                    <p className="text-sm text-gray-700">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center">*Função disponível mediante recursos adicionais.</p>
          </div>

          {/* Recursos Inteligentes do Aplicativo */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Recursos Inteligentes do Aplicativo</h3>
              <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
                O software Autel Enterprise simplifica o planejamento e a execução das missões com ferramentas que aceleram o fluxo de trabalho em campo.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {appFeatureCards.map(({ title, description, image }) => (
                <div key={title} className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="w-full rounded-2xl overflow-hidden aspect-video bg-gray-100 flex items-center justify-center">
                    <img 
                      src={image} 
                      alt={title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400"><span>Imagem não disponível</span></div>`;
                        }
                      }}
                      onLoad={() => {
                        // Imagem carregou com sucesso
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
                    <p className="text-sm text-gray-700">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Segurança de Dados Múltipla */}
          <div className="space-y-6">
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
              Segurança de dados múltipla
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {dataSecurityCards.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <Icon className="h-8 w-8 text-blue-600" />
                  <h4 className="mt-4 text-lg font-semibold text-gray-900">{title}</h4>
                  <p className="mt-2 text-sm text-gray-700">{description}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">*O suporte ao protocolo GB28181 será disponibilizado em atualizações futuras.</p>
          </div>

          {/* Autel SDK */}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Autel SDK</h3>
              <p className="text-base sm:text-lg text-gray-700">
                O Autel SDK é aberto ao mercado, auxiliando desenvolvedores e parceiros a reduzir custos e a criar soluções customizadas sobre a plataforma Autel Alpha.
              </p>
              <p className="text-base sm:text-lg text-gray-700">
                Integre sistemas de comando, dashboards, sensores adicionais ou fluxos industriais mantendo a segurança e a confiabilidade do SkyLink.
              </p>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <img
                src="/images/destaques/evo-max/autel-sdk.png"
                alt="Autel SDK"
                className="w-full max-w-lg rounded-3xl shadow-xl object-cover"
              />
            </div>
          </div>

          {/* Acessórios */}
          <div id="acessorios" className="space-y-6">
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
              Opcionais para expandir sua operação
            </h3>
            <div className="grid gap-8 lg:grid-cols-3">
              {optionalModules.map(optional => (
                <div key={optional.title} className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <img src={optional.image} alt={optional.title} className="w-full h-48 object-contain rounded-2xl bg-gray-50 p-4" />
                  <div className="space-y-3">
                    <h4 className="text-xl font-semibold text-gray-900">{optional.title}</h4>
                    <p className="text-sm text-gray-700">{optional.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Technical Data Section */}
      <section id="dados-tecnicos" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ProductTechnicalData
            technicalData={productFamily.technicalData}
            specs={currentVariant.specs}
            components={productFamily.components}
            accessoriesIncluded={productFamily.accessoriesIncluded}
            title={currentVariant.name}
            downloads={downloads}
          />
        </div>
      </section>
      
      {/* Applications Section */}
      <section id="applications" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <ProductApplications
            applications={productFamily.applications}
            title={productFamily.name}
          />
        </div>
      </section>
      
      {/* Videos Section */}
      <section id="videos" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <ProductVideoGallery
            videos={productFamily.videos}
            title={productFamily.name}
          />
        </div>
      </section>
      
      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default AutelAlpha;
