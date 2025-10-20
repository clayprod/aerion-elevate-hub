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

const AutelAlpha: React.FC = () => {
  const productFamily = getProductFamilyBySlug('autel-alpha');
  const [selectedVariant, setSelectedVariant] = useState('alpha');
  const [activeTab, setActiveTab] = useState('description');

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

export default AutelAlpha;
