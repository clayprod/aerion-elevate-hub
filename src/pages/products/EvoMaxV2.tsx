import React, { useMemo, useState } from 'react';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductStickyMenu } from '@/components/products/ProductStickyMenu';
import { ProductTechnicalData } from '@/components/products/ProductTechnicalData';
import { ProductVideoGallery } from '@/components/products/ProductVideoGallery';
import { ProductApplications } from '@/components/products/ProductApplications';
import { SEOHead } from '@/components/SEO/SEOHead';
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
  Timer,
  CloudRain
} from 'lucide-react';

const EvoMaxV2: React.FC = () => {
  const productFamily = getProductFamilyBySlug('evo-max-v2');
  const [selectedVariant, setSelectedVariant] = useState('4t');

  if (!productFamily) {
    return <div>Produto não encontrado</div>;
  }

  const currentVariant = productFamily.variants.find(v => v.id === selectedVariant) || productFamily.variants[0];

  const downloads = [
    {
      title: 'Brochure EVO Max V2',
      description: 'Catálogo completo da série EVO Max V2',
      url: productFamily.brochure,
      type: 'pdf' as const,
      size: '2.8 MB'
    },
    {
      title: 'Manual do Usuário 4N',
      description: 'Guia completo de operação para EVO Max V2 4N',
      url: '/downloads/EN_EVO_Max_V2_4N_User_Manual.pdf',
      type: 'pdf' as const,
      size: '16.2 MB'
    },
    {
      title: 'Manual do Usuário 4T',
      description: 'Guia completo de operação para EVO Max V2 4T',
      url: '/downloads/EN_EVO_Max_V2_4T_User_Manual.pdf',
      type: 'pdf' as const,
      size: '17.8 MB'
    },
    {
      title: 'Especificações Técnicas',
      description: 'Planilha detalhada com todas as especificações',
      url: '/downloads/EVO_Max_V2_Specifications.docx',
      type: 'doc' as const,
      size: '1.2 MB'
    },
    {
      title: 'Comparativo de Modelos',
      description: 'Comparação detalhada entre 4N e 4T',
      url: '/downloads/EVO_Max_V2_Comparison.doc',
      type: 'doc' as const,
      size: '950 KB'
    },
    {
      title: 'Certificações',
      description: 'Documentos de certificação e conformidade',
      url: '/downloads/EVO_Max_V2_Certifications.pdf',
      type: 'pdf' as const,
      size: '2.9 MB'
    }
  ];

  // Use only product images for the header
  const productImages = productFamily.photoGallery.product;

  // Define variants for EVO Max V2
  const variants = [
    {
      id: '4t',
      name: '4T',
      keyFeatures: [
        'Câmera térmica de alta resolução 640x512',
        'Zoom óptico 10x com zoom híbrido 160x',
        'Autonomia de até 42 minutos',
        'Resistência ao vento de 12 m/s',
        'Faixa de temperatura -20°C a 550°C'
      ]
    },
    {
      id: '4n',
      name: '4N',
      keyFeatures: [
        'Câmera noturna Starlight de alta sensibilidade',
        'Zoom digital 8x com estabilização avançada',
        'Autonomia de até 42 minutos',
        'Resistência ao vento de 12 m/s',
        'Alcance de observação até 8 km'
      ]
    }
  ];

  const currentVariantData = variants.find(v => v.id === selectedVariant) || variants[0];

  const payloadContent: Record<string, {
    title: string;
    tagline: string;
    image: string;
    features: { label: string; value: string }[];
  }> = {
    '4t': {
      title: 'Fusion 4T V2',
      tagline: 'Desafie o Calor',
      image: '/images/destaques/evo-max/camera-4t.jpeg',
      features: [
        {
          label: 'Câmera de Zoom',
          value: '48 MP · Zoom óptico 10x · Zoom híbrido até 160x · Abertura f/2.8–f/4.8 · Vídeo 4000×3000 30p'
        },
        {
          label: 'Câmera Grande Angular Super-sensível',
          value: '48 MP · Sensor 1/2" CMOS · Abertura f/2.8 · DFOV 83,4° · Equivalente 24 mm'
        },
        {
          label: 'Câmera Térmica',
          value: '640×512 · Lente 9,1 mm f/1.0 · Zoom digital 16x · Faixa -20 °C a 550 °C'
        },
        {
          label: 'Telêmetro a Laser',
          value: 'Telêmetro a laser com alcance 5–1200 m · Precisão ±(1 m + D×0,15%)'
        }
      ]
    },
    '4n': {
      title: 'Fusion 4N V2',
      tagline: 'Domine a Noite',
      image: '/images/destaques/evo-max/camera-4n.jpeg',
      features: [
        {
          label: 'Câmera Grande Angular 4K',
          value: 'Sensor 1/0,98" CMOS · 50 MP efetivos · DFOV 85° · Abertura f/1.85 · Vídeo 4000×3000 30p'
        },
        {
          label: 'Câmera Starlight',
          value: 'Sensor 1,69" CMOS · DFOV 52° · Abertura f/1.4 · ISO até 440000 · Vídeo 1920×1200 30p'
        },
        {
          label: 'Câmera Térmica',
          value: '640×512 · Lente 9,1 mm f/1.0 · Zoom digital 16x · Faixa -20 °C a 550 °C'
        },
        {
          label: 'Telêmetro a Laser',
          value: 'Telêmetro a laser com alcance 5–1200 m · Precisão ±(1 m + D×0,15%)'
        }
      ]
    }
  };

  const activePayload = payloadContent[selectedVariant] ?? payloadContent['4t'];
  const orderedOptionalModules = useMemo(() => optionalModules[selectedVariant], [optionalModules, selectedVariant]);

  const featureHighlights = [
    {
      icon: Radar,
      title: 'Sem Pontos Cegos',
      description: 'Cobertura omnidirecional de 720° com visão binocular e radar para evitar obstáculos em qualquer direção.'
    },
    {
      icon: ShieldCheck,
      title: 'Capacidade Anti-interferência Superior',
      description: 'Protege os sinais de controle mesmo em ambientes com forte interferência eletromagnética.'
    },
    {
      icon: Navigation,
      title: 'Navegação Visual de Alta Precisão',
      description: 'Sensores visuais de alta precisão garantem trajetórias confiáveis em cenários complexos.'
    },
    {
      icon: Share2,
      title: 'Rede A-Mesh',
      description: 'Comunicação redundante entre aeronave e controladores com topologia mesh inteligente.'
    },
    {
      icon: ZoomIn,
      title: 'Zoom Óptico 8K 10x',
      description: 'Câmera de zoom 8K com zoom óptico contínuo 10x e zoom híbrido expandido.'
    },
    {
      icon: Target,
      title: 'Reconhecimento de Alvos por IA',
      description: 'Identifica e rastreia pessoas, veículos e fontes de calor automaticamente.'
    },
    {
      icon: BatteryCharging,
      title: 'Baterias Hot-swappable',
      description: 'Troca de bateria sem desligar o equipamento para missões ininterruptas.'
    },
    {
      icon: RadioTower,
      title: 'Alcance de 15 km',
      description: 'Link de vídeo estável até 15 km (FCC) com redundância multi banda.'
    },
    {
      icon: Timer,
      title: '42 min de Voo Máximo',
      description: 'Até 42 minutos de autonomia para cobrir grandes áreas com uma única bateria.'
    },
    {
      icon: CloudRain,
      title: 'Proteção IP43',
      description: 'Operação confiável sob chuva leve e poeira com classificação IP43.'
    }
  ];

  const skylinkStats = [
    { value: '15 km', label: 'Distância de transmissão de imagem' },
    { value: '1080P@30FPS', label: 'Qualidade de vídeo em tempo real' },
    { value: '900MHz / 2.4GHz / 5.2GHz / 5.8GHz*', label: 'Bandas de frequência' },
    { value: '< 150 ms', label: 'Latência' }
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

  const optionalModules = [
    {
      title: 'Módulo RTK (opcional)',
      description:
        'Fornece dados de posicionamento centimétrico para mapeamento e reduz interferências eletromagnéticas em estruturas críticas.',
      image: '/images/destaques/evo-max/optional-rtk.png'
    },
    {
      title: 'EVO Nest (opcional)',
      description:
        'Base para decolagem, pouso, recarga e planejamento automáticos da série EVO Max, projetada para operação em qualquer clima com tambor protetor integrado de baixa manutenção.',
      image: '/images/destaques/evo-max/optional-nest.png'
    },
    {
      title: 'Módulo Integrado de Alto-falante e Holofote EVO Max (opcional)',
      description:
        'Combina holofote de 30 W com ajustes remotos e alto-falante de 10 W para operações de segurança pública, emergência e comunicação em campo.',
      image: '/images/destaques/evo-max/optional-speaker.png',
      specs: [
        'Dimensões: 145 × 116 × 83 mm',
        'Interface: Payload SDK | Instalação por parafusos de liberação rápida',
        'Temperatura de operação: -10°C a 50°C',
        'Holofote: FOV 14 graus, 30 Lux @ 50 m, 7 Lux @ 100 m, 3 Lux @ 150 m, modos intermitente ou contínuo, ajuste de inclinação de 30 graus a -90 graus',
        'Alto-falante: 10 W, 114 dB @ 1 m, alcance >=300 m, atraso <300 ms, suporta gravação e reprodução de áudio'
      ]
    }
  ];
  const menuItems = [
    { id: 'product-description', label: 'Descrição do Produto' },
    { id: 'destaques', label: 'Destaques' },
    { id: 'dados-tecnicos', label: 'Dados Técnicos' },
    { id: 'acessorios', label: 'Acessórios' },
    { id: 'dados-comerciais', label: 'Dados Comerciais e de Apoio' },
    { id: 'applications', label: 'Aplicações' },
    { id: 'videos', label: 'Vídeos' }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="EVO Max 4T | Drone Profissional RTK - Topografia e Mapeamento | Aerion"
        description="EVO Max 4T: drone profissional com RTK, câmera 50MP, zoom 10x, 42min voo. Ideal para topografia de alta precisão, mapeamento e levantamentos aerofotogramétricos. Precisão centimétrica."
        keywords="evo max 4t, drone RTK, topografia drone, mapeamento drone, drone profissional, autel evo max"
        canonical="https://aerion.com.br/produtos/evo-max-v2"
        ogType="product"
      />
      <Header />
      
      <ProductStickyMenu items={menuItems} />
      
      {/* Product Header - E-commerce Layout */}
      <div id="product-description">
        <ProductHeader
          name={productFamily.name}
          description={productFamily.description}
          productCodes={productFamily.productCodes}
          keyFeatures={currentVariantData.keyFeatures}
          images={productImages}
          category="Drone Profissional"
          variants={variants}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
        />
      </div>
      
      <section id="destaques" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="relative overflow-hidden rounded-3xl min-h-[520px] md:min-h-[560px] flex flex-col justify-end md:justify-center text-white shadow-xl">
            <div
              className="absolute inset-0 bg-cover"
              style={{
                backgroundImage: "url('/images/destaques/evo-max/obstacle-avoidance.avif')",
                backgroundPosition: 'center'
              }}
            />
            <div className="absolute inset-0 bg-black/35 md:bg-gradient-to-r md:from-black/80 md:via-black/20 md:to-transparent" />
            <div className="relative z-10 max-w-xl w-full px-6 py-16 sm:px-10">
              <h3 className="text-3xl sm:text-4xl font-semibold leading-tight">
                Sem Pontos Cegos
                <br />
                Evitação de Obstáculos de Última Geração
              </h3>
              <p className="mt-4 text-base sm:text-lg text-gray-100">
                O EVO Max 4T combina sistemas tradicionais de visão binocular com tecnologia de radar de ondas
                milimétricas. Isso permite que o Autel Autonomy Engine detecte objetos a partir de 1,3 cm,
                eliminando pontos cegos e garantindo operação em ambientes com baixa iluminação ou chuva.
              </p>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                Anti-interferência Superior
              </h3>
              <p className="text-base sm:text-lg text-gray-700">
                O EVO Max 4T utiliza módulos avançados de controle de voo e algoritmos capazes de identificar
                interferências nos sinais de controle e no posicionamento por satélite. Assim, o drone opera com
                confiança perto de linhas de energia, estruturas críticas e em áreas complexas, mantendo a
                estabilidade da missão.
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
                <source src="https://app.autelrobotics.com/statics/cdn/20241107/v.f100840.mp4" type="video/mp4" />
                Seu navegador não suporta a reprodução de vídeos.
              </video>
            </div>
          </div>

          {selectedVariant === '4n' ? (
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="relative overflow-hidden rounded-3xl shadow-xl order-2 lg:order-1">
                <div className="absolute top-0 left-0 right-0 flex justify-between px-6 py-4 text-xs sm:text-sm font-semibold uppercase tracking-wide text-white">
                  <span className="bg-black/60 px-3 py-1 rounded-full">Câmera normal</span>
                  <span className="bg-black/60 px-3 py-1 rounded-full">Câmera Noturna 4N</span>
                </div>
                <video
                  className="w-full aspect-video object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="https://app.autelrobotics.com/statics/cdn/2025/04/4N%E8%AF%A6%E6%83%85%E9%A1%B5%E8%8B%B1%E6%96%87%E8%A7%86%E9%A2%91/%E9%9A%90%E8%94%BD%E6%80%A7/%E9%9A%90%E8%94%BD%E6%80%A7.mp4" type="video/mp4" />
                  Seu navegador não suporta a reprodução de vídeos.
                </video>
              </div>
              <div className="order-1 lg:order-2 space-y-4">
                <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                  Visão clara e limpa, mesmo no escuro
                </h3>
                <p className="text-base sm:text-lg text-gray-700">
                  Em comparação com soluções de reconhecimento noturno baseadas em infravermelho ou iluminação a laser, o EVO Max 4N oferece maior alcance de observação e discrição, reduzindo significativamente o risco de detecção e contra vigilância.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="order-1 lg:order-2 space-y-4">
                <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                  Zoom híbrido até 160x
                </h3>
                <p className="text-base sm:text-lg text-gray-700">
                  A câmera de zoom suporta zoom óptico contínuo 8K 10x e zoom híbrido máximo de até 160x, tornando veículos e embarcações visíveis a até 2 quilômetros de distância. Os operadores não precisam se deslocar até a cena, aumentando a eficiência e protegendo o pessoal e os equipamentos de voo.
                </p>
                <p className="text-base sm:text-lg text-gray-700">
                  Essa capacidade potencializa aplicações em inspeções de energia, operações de resgate e missões de segurança pública.
                </p>
              </div>
              <div className="order-2 lg:order-1 overflow-hidden rounded-3xl shadow-xl">
                <video
                  className="w-full aspect-video object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="https://app.autelrobotics.com/statics/cdn/20241107/v.f100800_1.mp4" type="video/mp4" />
                  Seu navegador não suporta a reprodução de vídeos.
                </video>
              </div>
            </div>
          )}

          <div className="bg-white text-gray-900 rounded-3xl px-6 py-12 sm:px-10 sm:py-14 shadow-xl">
            <div className="max-w-3xl">
              <h3 className="text-3xl sm:text-4xl font-semibold leading-tight">
                Cargas Úteis Preparadas para a Missão
              </h3>
              <p className="mt-4 text-base sm:text-lg text-gray-600">
                Explore os sensores dedicados da carga útil {activePayload.title}, otimizados para o cenário selecionado do EVO Max V2.
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-center">
              <div className="md:w-1/2 flex justify-center">
                <img
                  src={activePayload.image}
                  alt={`Câmera ${activePayload.title}`}
                  className="w-full max-w-md object-contain"
                />
              </div>
              <div className="md:w-1/2 space-y-5">
                <div>
                  <h4 className="text-3xl font-semibold leading-tight text-gray-900">{activePayload.title}</h4>
                  <p className="text-sm uppercase tracking-wide text-gray-500">{activePayload.tagline}</p>
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  {activePayload.features.map((feature, index) => (
                    <div
                      key={`${activePayload.title}-${index}`}
                      className="border-b border-gray-200 pb-4 last:border-none last:pb-0"
                    >
                      <h5 className="font-semibold text-gray-900 uppercase tracking-wide text-xs sm:text-sm mb-1">
                        {feature.label}
                      </h5>
                      <p className="text-gray-700">{feature.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center bg-gray-50 rounded-3xl px-6 py-12 sm:px-10">
            <div className="flex justify-center">
              <img
                src="/images/destaques/evo-max/vision-enhanced.png"
                alt="Visão melhorada"
                className="w-full max-w-md object-contain"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Visão Melhorada</h3>
              <p className="text-base sm:text-lg text-gray-700">
                Visualização ao vivo aprimorada. A tela multicanal suporta a saída simultânea de imagens RGB, infravermelhas e grande angular.
              </p>
              <p className="text-base sm:text-lg text-gray-700">
                Combine diferentes perspectivas para tomada de decisão mais rápida e análises precisas em tempo real.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl min-h-[420px] text-white shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/destaques/evo-max/skylink-bg.jpg')" }}
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 px-6 pt-10 pb-16 sm:px-10 lg:px-16 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl space-y-4">
                <h3 className="text-3xl sm:text-4xl font-semibold leading-tight">Autel SkyLink 3.0</h3>
                <p className="text-base sm:text-lg text-gray-100">
                  O sistema SkyLink 3.0 do EVO Max 4T reúne seis antenas, quatro bandas de frequência, criptografia AES-256 e integração 4G opcional para oferecer a conectividade de voo mais avançada da linha EVO.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {skylinkStats.map(stat => (
                  <div key={stat.value} className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-6 py-4">
                    <div className="text-2xl font-semibold">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
                <p className="text-xs text-white/60">*A disponibilidade de bandas pode variar de acordo com a região.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Capacidades principais</h3>
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

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Funções inteligentes</h3>
              <div className="space-y-4 text-base sm:text-lg text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900">Missão Rápida</h4>
                  <p>
                    Crie missões rápidas temporárias enquanto executa outros planos de voo. Empilhe sub-missões para ganhar flexibilidade adicional durante operações críticas.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Reprodução de Missão*</h4>
                  <p>
                    Ao ativar o recurso, voe uma missão manual ou semiautônoma — ou encadeie várias missões. O EVO Max 4T grava automaticamente os ângulos de câmera e replica o voo executado.
                  </p>
                </div>
                <p className="text-sm text-gray-500">*Acessório previsto para lançamento futuro.</p>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <img
                src="/images/destaques/evo-max/smart-functions.webp"
                alt="Funções inteligentes Autel"
                className="w-full max-w-lg rounded-3xl shadow-xl object-cover"
              />
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center bg-gray-50 rounded-3xl px-6 py-12 sm:px-10">
            <div className="order-1 flex justify-center">
              <img
                src="/images/destaques/evo-max/remote-operations.webp"
                alt="Sistema remoto completo"
                className="w-full max-w-lg rounded-3xl shadow-xl object-cover"
              />
            </div>
            <div className="order-2 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                Sistema de Operação Completamente Remoto
              </h3>
              <p className="text-base sm:text-lg text-gray-700">
                Utilizado com o EVO Nest, o EVO Max Series oferece operação autônoma em qualquer clima para aplicações em subestações, parques industriais e telhados.
              </p>
              <p className="text-base sm:text-lg text-gray-700">
                Automatize decolagem, pouso e carregamento, garantindo disponibilidade constante da aeronave para inspeções recorrentes.
              </p>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Autel SDK</h3>
              <p className="text-base sm:text-lg text-gray-700">
                O Autel SDK é aberto ao mercado, ajudando desenvolvedores e parceiros a reduzir custos de criação de software e hardware e a construir um novo ecossistema para a indústria.
              </p>
              <p className="text-base sm:text-lg text-gray-700">
                Integre fluxos personalizados, dashboards, sensores adicionais e aplicações verticais mantendo toda a segurança do Autel SkyLink.
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

          <div className="space-y-6">
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
              Opcionais para expandir sua operação
            </h3>
            <div className="grid gap-8 lg:grid-cols-3">
              {orderedOptionalModules.map(optional => (
                <div key={optional.title} className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <img src={optional.image} alt={optional.title} className="w-full h-40 object-contain rounded-2xl bg-gray-50 p-4" />
                  <div className="space-y-3">
                    <h4 className="text-xl font-semibold text-gray-900">{optional.title}</h4>
                    <p className="text-sm text-gray-700">{optional.description}</p>
                    {optional.specs && (
                      <ul className="space-y-1 text-sm text-gray-700">
                        {optional.specs.map(item => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Data Section */}
      <section id="technical-data" className="py-12 bg-white">
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

export default EvoMaxV2;
