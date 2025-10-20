import React, { useState } from 'react';
import { ProductHero } from '@/components/products/ProductHero';
import { ProductApplications } from '@/components/products/ProductApplications';
import { ProductTabNavigation } from '@/components/products/ProductTabNavigation';
import { ProductDescription } from '@/components/products/ProductDescription';
import { ProductKeyFeatures } from '@/components/products/ProductKeyFeatures';
import { ProductTechnicalData } from '@/components/products/ProductTechnicalData';
import { ProductVintageVideoGallery } from '@/components/products/ProductVintageVideoGallery';
import { ProductPhotoGallery } from '@/components/products/ProductPhotoGallery';
import { ProductDownloadSection } from '@/components/products/ProductDownloadSection';
import { getProductFamilyBySlug } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const EvoLiteEnterprise: React.FC = () => {
  const productFamily = getProductFamilyBySlug('evo-lite-enterprise');
  const [selectedVariant, setSelectedVariant] = useState('640t');
  const [activeTab, setActiveTab] = useState('description');

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

  const copyAllInfo = () => {
    const info = `${productFamily.name}\n\n${productFamily.description}\n\nCaracterísticas Principais:\n${productFamily.keyFeatures.map((feature, index) => `${index + 1}. ${feature}`).join('\n')}`;
    navigator.clipboard.writeText(info);
  };

  const tabs = [
    {
      id: 'description',
      label: 'Descrição do Produto',
      content: (
        <ProductDescription
          title={productFamily.name}
          description={productFamily.description}
          keyFeatures={productFamily.keyFeatures}
          productCodes={productFamily.productCodes}
        />
      )
    },
    {
      id: 'characteristics',
      label: 'Características Principais',
      content: (
        <ProductKeyFeatures
          features={productFamily.keyFeatures}
          title={productFamily.name}
        />
      )
    },
    {
      id: 'technical',
      label: 'Dados Técnicos',
      content: (
        <ProductTechnicalData
          technicalData={productFamily.technicalData}
          specs={currentVariant.specs}
          components={productFamily.components}
          accessoriesIncluded={productFamily.accessoriesIncluded}
          title={currentVariant.name}
        />
      )
    },
    {
      id: 'downloads',
      label: 'Material de Apoio para Download',
      content: (
        <ProductDownloadSection
          downloads={downloads}
          title={productFamily.name}
        />
      )
    },
    {
      id: 'gallery',
      label: 'Galeria de Fotos e Vídeos',
      content: (
        <div className="space-y-12">
          <ProductPhotoGallery
            photoGallery={productFamily.photoGallery}
            title={productFamily.name}
          />
          <ProductVintageVideoGallery
            videos={productFamily.videos}
            title={productFamily.name}
          />
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <ProductHero
        title={productFamily.name}
        description={productFamily.description}
        youtubeVideoId={productFamily.youtubeVideoId}
        fallbackImage={productFamily.fallbackImage}
        variant={selectedVariant}
        onVariantChange={setSelectedVariant}
        productSlug={productFamily.slug}
      />
      
      <ProductTabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCopyInfo={copyAllInfo}
      />
      
      <ProductApplications
        applications={productFamily.applications}
        title={productFamily.name}
      />
      <Footer />
    </div>
  );
};

export default EvoLiteEnterprise;
