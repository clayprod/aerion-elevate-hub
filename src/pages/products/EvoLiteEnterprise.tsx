import React, { useState } from 'react';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductStickyMenu } from '@/components/products/ProductStickyMenu';
import { ProductTechnicalData } from '@/components/products/ProductTechnicalData';
import { ProductVideoGallery } from '@/components/products/ProductVideoGallery';
import { ProductApplications } from '@/components/products/ProductApplications';
import { getProductFamilyBySlug } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileFloatingCTA from '@/components/MobileFloatingCTA';

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
        'Câmera térmica de alta resolução 640x512',
        'Zoom digital térmico 20x',
        'Autonomia de até 40 minutos',
        'Resistência ao vento de 12 m/s',
        'Transmissão de vídeo 1080P@60fps'
      ]
    },
    {
      id: '6k',
      name: '6K',
      keyFeatures: [
        'Câmera visual 6K de alta resolução',
        'Zoom digital 16x',
        'Autonomia de até 40 minutos',
        'Resistência ao vento de 12 m/s',
        'Transmissão de vídeo 4K@30fps'
      ]
    }
  ];

  const currentVariantData = variants.find(v => v.id === selectedVariant) || variants[0];

  const menuItems = [
    { id: 'technical-data', label: 'Dados Técnicos' },
    { id: 'applications', label: 'Aplicações' },
    { id: 'videos', label: 'Vídeos' }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <ProductStickyMenu items={menuItems} />
      
      {/* Product Header - E-commerce Layout */}
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
