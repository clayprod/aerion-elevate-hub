import React, { useState } from 'react';
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
  Feather,
  MousePointerSquare,
  Scan,
  Camera,
  Thermometer,
  RadioTower,
  Radar,
  Timer,
  ShieldCheck,
  Lock,
  Radio,
  Settings2,
  Columns,
  Map
} from 'lucide-react';

const EvoLiteEnterprise: React.FC = () => {
  const productFamily = getProductFamilyBySlug('evo-lite-enterprise');
  const [selectedVariant, setSelectedVariant] = useState('640t');

  if (!productFamily) {
    return <div>Produto não encontrado</div>;
  }

  const currentVariant = productFamily.variants.find(v => v.id === selectedVariant) || productFamily.variants[0];

  const downloads = [
    {
      title: 'Brochure EVO Lite Enterprise',
      description: 'Catálogo completo da série EVO Lite Enterprise',
      url: productFamily.brochure,
      type: 'pdf' as const,
      size: '3.2 MB'
    },
    {
      title: 'Manual do Usuário',
      description: 'Guia completo de operação e configuração',
      url: '/downloads/EN_EVO_Lite_Enterprise_Series_Aircraft_User_Manual_V1.0.2.pdf',
      type: 'pdf' as const,
      size: '18.5 MB'
    },
    {
      title: 'Guia de Início Rápido',
      description: 'Instruções básicas para começar a voar',
      url: '/downloads/EVO_Lite_Enterprise_Series_Quick_Start_Guide.pdf',
      type: 'pdf' as const,
      size: '2.1 MB'
    },
    {
      title: 'FAQ Técnico',
      description: 'Perguntas frequentes e soluções técnicas',
      url: '/downloads/EVO_Lite_Enterprise_Series_FAQ.xlsx',
      type: 'xlsx' as const,
      size: '1.5 MB'
    },
    {
      title: 'Lista de Embalagem',
      description: 'Conteúdo da embalagem e acessórios inclusos',
      url: '/downloads/EVO_Lite_Enterprise_Series_Basic_Combo_Packing_List.pdf',
      type: 'pdf' as const,
      size: '1.8 MB'
    },
    {
      title: 'Material de Treinamento',
      description: 'Recursos educacionais e treinamento',
      url: '/downloads/EVO_Lite_Enterprise_Series_Training_Materials.pdf',
      type: 'pdf' as const,
      size: '4.2 MB'
    }
  ];

  // Use only product images for the header
  const productImages = productFamily.photoGallery.product;

  // Define variants for EVO Lite Enterprise
  const variants = [
    {
      id: '640t',
      name: '640T',
      keyFeatures: [
        'Câmera térmica 640×512 com zoom digital 1-16x',
        'Sensor visível 1/2" 48 MP com zoom digital 16x',
        'Alcance de transmissão até 12 km (FCC) / 6 km (CE)',
        'Detecção tridirecional com alcance até 30 m',
        'Autonomia de até 40 minutos'
      ]
    },
    {
      id: '6k',
      name: '6K',
      keyFeatures: [
        'Sensor 1" 20 MP com abertura f/2.8-f/11',
        'Zoom digital 16x com modo antifog',
        'Alcance de transmissão até 12 km (FCC) / 6 km (CE)',
        'Detecção tridirecional com alcance até 30 m',
        'Autonomia de até 40 minutos'
      ]
    }
  ];

  const currentVariantData = variants.find(v => v.id === selectedVariant) || variants[0];

  const featureHighlights = [
    {
      icon: Feather,
      title: 'Leve e Portátil',
      description: 'A série EVO Lite Enterprise pesa apenas 866 g e, dobrada, mede 210 × 123 × 95 mm — cabe facilmente em uma mochila.'
    },
    {
      icon: MousePointerSquare,
      title: 'Controle Simples',
      description: 'Fluxos intuitivos permitem que um único operador configure e execute missões complexas com agilidade.'
    },
    {
      icon: Scan,
      title: 'Reconhecimento IA',
      description: 'Algoritmos de inteligência artificial identificam automaticamente pessoas, veículos e embarcações, projetando posições no mapa.'
    },
    {
      icon: Camera,
      title: 'Resolução 6K',
      description: 'Sensor 1" de 20 MP entrega imagens 6K com ampla faixa dinâmica e fidelidade de cores.'
    },
    {
      icon: Thermometer,
      title: 'Imagem Térmica 640×512',
      description: 'A versão 640T oferece câmera térmica de alta resolução com zoom digital 16x e medições precisas.'
    },
    {
      icon: RadioTower,
      title: 'Transmissão de 12 km',
      description: 'SkyLink transmite vídeo em tempo real a até 12 km (FCC) ou 6 km (CE) com estabilidade.'
    },
    {
      icon: Radar,
      title: 'Evitação Binocular',
      description: 'Sensores tridimensionais monitoram frente, trás e base para evitar obstáculos em ambientes complexos.'
    },
    {
      icon: Timer,
      title: 'Autonomia de 40 min',
      description: 'Até 40 minutos de voo em condições ideais, reduzindo trocas de bateria durante a missão.'
    }
  ];

  const skyLinkStats = [
    { value: '12 km (FCC)', label: 'Distância de transmissão de vídeo' },
    { value: '1080p@30fps', label: 'Qualidade em tempo real' },
    { value: '2.4 / 5.8 GHz', label: 'Bandas de frequência' },
    { value: '< 200 ms', label: 'Latência típica' }
  ];

  const missionCards = [
    {
      title: 'Missão Poligonal',
      description: 'Crie áreas de voo poligonais automaticamente para cobrir zonas de inspeção completas.',
      image: '/images/destaques/evo-max/mission-polygon.webp'
    },
    {
      title: 'Missão por Pontos',
      description: 'Adicione waypoints flexíveis e trajetórias personalizadas para missões sob medida.',
      image: '/images/destaques/evo-max/mission-waypoint.webp'
    },
    {
      title: 'Geração Automática e Coleta de Dados*',
      description: 'Importe arquivos KML ou contornos para gerar rotas rapidamente e reunir dados georreferenciados.',
      image: '/images/destaques/evo-max/mission-auto.webp'
    }
  ];

  const appFeatureCards = [
    {
      title: 'Tela Dividida',
      description: 'Combine visível, infravermelho ou mapa em tela dupla para comparar informações simultaneamente.',
      image: '/images/destaques/evo-lite/split-screen.webp',
      icon: Columns
    },
    {
      title: 'Barra Personalizável',
      description: 'Personalize a barra de ferramentas do aplicativo para acessar funções frequentes em segundos.',
      image: '/images/destaques/evo-lite/custom-toolbar.webp',
      icon: Settings2
    },
    {
      title: 'Mapas Offline',
      description: 'Carregue mapas offline para voos em locais sem rede ou com sinal instável, mantendo a navegação precisa.',
      image: '/images/destaques/evo-lite/offline-maps.webp',
      icon: Map
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
      title: 'Autel Smart Remote Controller V3 (Opcional)',
      description:
        'Tela 7,9" de 2000 nits, download de até 20 MB/s, interfaces HDMI/USB para módulo 4G, autonomia de 4 h (carga completa em 2 h) e 128 GB internos.',
      image: '/images/destaques/evo-lite/remote-controller.png'
    },
    {
      title: 'Kit Multicarregador do Controle (Opcional)',
      description:
        'Três baterias de controle e carregador multiportas que abastece até quatro unidades simultaneamente, ideal para operações longas.',
      image: '/images/destaques/evo-lite/multi-charging-kit.png'
    }
  ];

  const cameraModules: Record<
    string,
    {
      title: string;
      tagline: string;
      image: string;
      features: string[];
    }
  > = {
    '640t': {
      title: 'Câmera Dual 640T',
      tagline: 'Visível + Térmica Integradas',
      image: '/images/destaques/evo-lite/camera-640t.webp',
      features: [
        'Sensor visível 1/2" CMOS de 48 MP com zoom digital 16x',
        'Câmera térmica 640×512 com zoom digital 16x e leitura radiométrica',
        'Detecção de temperatura de -20°C a 150°C (alto ganho) ou até 550°C (baixo ganho)',
        'Exibição combinada RGB + térmica para comparação instantânea'
      ]
    },
    '6k': {
      title: 'Câmera Óptica 6K',
      tagline: 'Sensor 1" de Alta Resolução',
      image: '/images/destaques/evo-lite/camera-6k.webp',
      features: [
        'Sensor 1" CMOS de 20 MP com captura 6K (5472×3076)',
        'Abertura ajustável f/2.8–f/11 e zoom digital 16x com modo antifog',
        'Log de 12 bits e suporte a perfis de cor para pós-produção',
        'Suporte HDR e longa exposição para operações com baixa luz'
      ]
    }
  };

  const cameraContent = cameraModules[selectedVariant] ?? cameraModules['640t'];

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
        title="EVO Lite Enterprise | Drone Térmico Compacto - Topografia e Inspeção | Aerion"
        description={'EVO Lite Enterprise: versões 640T (câmera térmica 640×512 + sensor visível 48 MP) e 6K (sensor 1" 20 MP). Até 40 minutos de voo, alcance 12 km (FCC) / 6 km (CE) e detecção tridirecional para inspeções e segurança.'}
        keywords="evo lite enterprise, drone térmico, drone topografia, drone compacto, inspeção térmica, autel evo lite"
        canonical="https://aerion.com.br/produtos/evo-lite-enterprise"
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
        <div className="flex justify-center">
          <img
            src="/images/destaques/evo-lite/po11.webp"
            alt="Logo Evo Lite Enterprise"
            className="h-6 sm:h-8 md:h-10 object-contain"
          />
        </div>

        <div className="relative overflow-hidden rounded-3xl min-h-[420px] text-white shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/destaques/evo-lite/po11.webp')" }}
          />
          <div className="absolute inset-0 bg-black/50 md:bg-gradient-to-r md:from-black/80 md:via-black/30 md:to-transparent" />
          <div className="relative z-10 max-w-xl px-6 py-16 sm:px-10">
            <h3 className="text-3xl sm:text-4xl font-semibold leading-tight">Leve e Portátil</h3>
            <p className="mt-4 text-base sm:text-lg text-gray-100">
              A série EVO Lite Enterprise pesa apenas 866 gramas e possui dimensões dobradas de 210 × 123 × 95 mm,
              cabendo com facilidade em uma mochila. Com operação simplificada, é ideal para missões executadas
              rapidamente por um único operador.
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative overflow-hidden rounded-3xl shadow-xl order-2 lg:order-1">
            <img
              src="/images/destaques/evo-lite/ai-target.webp"
              alt="Reconhecimento e posicionamento de alvos"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2 space-y-4">
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
              AI Target Recognition and Positioning
            </h3>
            <p className="text-base sm:text-lg text-gray-700">
              Utilizando lentes grande-angulares ou infravermelhas combinadas com algoritmos inteligentes e sistema de
              autoaprendizado, o EVO Lite reconhece e localiza automaticamente pessoas, carros e embarcações,
              projetando essas posições no mapa.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl min-h-[380px] text-white shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/destaques/evo-lite/skylink.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 px-6 pt-10 pb-16 sm:px-10 lg:px-16 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold leading-tight">Autel SkyLink</h3>
              <p className="text-base sm:text-lg text-gray-100">
                O sistema SkyLink do EVO Lite Enterprise entrega transmissão estável mesmo em ambientes desafiadores,
                combinando antenas otimizadas, múltiplas bandas e robustos mecanismos de segurança.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {skyLinkStats.map(stat => (
                <div
                  key={stat.value}
                  className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-6 py-4"
                >
                  <div className="text-2xl font-semibold">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white text-gray-900 rounded-3xl px-6 py-12 sm:px-10 sm:py-14 shadow-xl border border-gray-100">
          <div className="max-w-3xl">
            <h3 className="text-3xl sm:text-4xl font-semibold leading-tight">Câmeras do EVO Lite</h3>
            <p className="mt-4 text-base sm:text-lg text-gray-600">
              Conheça os sensores embarcados disponíveis nas versões {cameraContent.title}, otimizados para diferentes
              cenários de inspeção, segurança e mapeamento.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-center">
            <div className="md:w-1/2 flex justify-center">
              <img
                src={cameraContent.image}
                alt={cameraContent.title}
                className="w-full max-w-md object-contain drop-shadow-2xl"
              />
            </div>
            <div className="md:w-1/2 space-y-5">
              <div>
                <h4 className="text-3xl font-semibold leading-tight text-gray-900">{cameraContent.title}</h4>
                <p className="text-sm uppercase tracking-wide text-gray-500">{cameraContent.tagline}</p>
              </div>
              <div className="space-y-4 text-sm sm:text-base">
                {cameraContent.features.map(feature => (
                  <div key={feature} className="border-b border-gray-200 pb-4 last:border-none last:pb-0">
                    <h5 className="font-semibold text-gray-900">{feature}</h5>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Características Principais</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
              Múltiplos tipos de missão
            </h3>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
              O aplicativo Autel Enterprise oferece missões autônomas e semiautônomas para segurança pública,
              inspeções e levantamentos, garantindo planejamento rápido e preciso em campo.
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

        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Recursos do aplicativo</h3>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
              O software Autel Enterprise simplifica o planejamento e a execução das missões com ferramentas que
              aceleram o fluxo de trabalho em campo.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {appFeatureCards.map(({ title, description, image, icon: Icon }) => (
              <div key={title} className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <img src={image} alt={title} className="w-full rounded-2xl object-cover" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Icon className="w-5 h-5" />
                    <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
                  </div>
                  <p className="text-sm text-gray-700">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
            Data Security with Multiple Protections
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

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1 space-y-4">
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Autel SDK</h3>
            <p className="text-base sm:text-lg text-gray-700">
              O Autel SDK é aberto ao mercado, auxiliando desenvolvedores e parceiros a reduzir custos e a criar
              soluções customizadas sobre a plataforma EVO Lite Enterprise.
            </p>
            <p className="text-base sm:text-lg text-gray-700">
              Integre sistemas de comando, dashboards, sensores adicionais ou fluxos industriais mantendo a segurança e
              a confiabilidade do SkyLink.
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
          <div className="grid gap-8 md:grid-cols-2">
            {optionalModules.map(optional => (
              <div key={optional.title} className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <img
                  src={optional.image}
                  alt={optional.title}
                  className="w-full h-48 object-contain rounded-2xl bg-gray-50 p-4"
                />
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

export default EvoLiteEnterprise;
