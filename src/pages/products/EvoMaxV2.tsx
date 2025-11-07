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
      image: '/images/camera-evo-max-4t.jpeg',
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
          label: 'Linha EVO Max V2',
          value: 'Câmera térmica 640×512 · Lente 9,1 mm f/1.0 · Zoom digital 16x · Faixa -20 °C a 550 °C'
        },
        {
          label: 'Linha EVO Max V2',
          value: 'Telêmetro a laser com alcance 5–1200 m · Precisão ±(1 m + D×0,15%)'
        }
      ]
    },
    '4n': {
      title: 'Fusion 4N V2',
      tagline: 'Domine a Noite',
      image: '/images/camera-evo-max-4n.jpeg',
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
          label: 'Linha EVO Max V2',
          value: 'Câmera térmica 640×512 · Lente 9,1 mm f/1.0 · Zoom digital 16x · Faixa -20 °C a 550 °C'
        },
        {
          label: 'Linha EVO Max V2',
          value: 'Telêmetro a laser com alcance 5–1200 m · Precisão ±(1 m + D×0,15%)'
        }
      ]
    }
  };

  const activePayload = payloadContent[selectedVariant] ?? payloadContent['4t'];

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
                backgroundImage: "url('/images/a81679_2cf42ff5e36f447696d7689264c35a9a~mv2.avif')",
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
                  className="w-full max-w-sm object-contain drop-shadow-2xl"
                />
              </div>
              <div className="md:w-1/2 space-y-5">
                <div>
                  <h4 className="text-3xl font-semibold leading-tight text-gray-900">{activePayload.title}</h4>
                  <p className="text-sm uppercase tracking-wide text-gray-500">{activePayload.tagline}</p>
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  {activePayload.features.map((feature, index) => (
                    <div key={`${activePayload.title}-${index}`}>
                      <h5 className="font-semibold text-gray-900">{feature.label}</h5>
                      <p className="text-gray-700">{feature.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: 'Caminhos Autônomos',
                description:
                  'O Autonomy Engine da Autel coleta dados ambientais e planeja trajetórias 3D por cenários complexos como montanhas, florestas e edificações. Ideal para reconstrução 3D rápida, segurança pública, inspeções industriais e levantamentos topográficos.',
                image: 'https://www.autelrobotics.com/wp-content/uploads/2024/08/new-evo1.png'
              },
              {
                title: 'Navegação em Ambientes sem GNSS',
                description:
                  'Sensores avançados permitem ao EVO Max 4T navegar em estruturas reforçadas, ambientes subterrâneos ou regiões onde o GNSS não está disponível, mantendo a missão mesmo sob bloqueio de sinal.',
                image: 'https://www.autelrobotics.com/wp-content/uploads/2024/08/new-evo2.png'
              },
              {
                title: 'Identificação e Rastreamento Precisos',
                description:
                  'Com tecnologia de reconhecimento de IA da Autel, o EVO Max 4T identifica e fixa automaticamente alvos como fontes de calor, pessoas ou veículos, garantindo rastreamento em altitude e coleta de dados para segurança.',
                image: 'https://www.autelrobotics.com/wp-content/uploads/2024/08/new-evo3.png'
              }
            ].map(card => (
              <div
                key={card.title}
                className="relative overflow-hidden rounded-3xl flex flex-col justify-start text-white shadow-xl"
                style={{
                  backgroundImage: `url(${card.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '380px'
                }}
              >
                <div className="w-full p-8 space-y-3">
                  <h4 className="text-2xl font-semibold leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">{card.title}</h4>
                  <p className="text-sm sm:text-base text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] max-w-xs">{card.description}</p>
                </div>
              </div>
            ))}
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
