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

const EvoMaxV2: React.FC = () => {
  const productFamily = getProductFamilyBySlug('evo-max-v2');
  const [selectedVariant, setSelectedVariant] = useState('4n');
  const [activeTab, setActiveTab] = useState('description');

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

export default EvoMaxV2;
