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
  const [selectedVariant, setSelectedVariant] = useState('4n');

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
      id: '4n',
      name: '4N',
      keyFeatures: [
        'Câmera noturna Starlight de alta sensibilidade',
        'Zoom digital 8x com estabilização avançada',
        'Autonomia de até 42 minutos',
        'Resistência ao vento de 12 m/s',
        'Alcance de observação até 8 km'
      ]
    },
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
    }
  ];

  const currentVariantData = variants.find(v => v.id === selectedVariant) || variants[0];

  const menuItems = [
    { id: 'product-description', label: 'Descrição do Produto' },
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
