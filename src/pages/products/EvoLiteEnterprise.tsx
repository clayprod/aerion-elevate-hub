import React, { useState } from 'react';
import { ProductHero } from '@/components/products/ProductHero';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductSpecs } from '@/components/products/ProductSpecs';
import { ProductDownloads } from '@/components/products/ProductDownloads';
import { ProductApplications } from '@/components/products/ProductApplications';
import { ProductMainInfo } from '@/components/products/ProductMainInfo';
import { ProductKeyFeatures } from '@/components/products/ProductKeyFeatures';
import { ProductTechnicalData } from '@/components/products/ProductTechnicalData';
import { ProductVideoGallery } from '@/components/products/ProductVideoGallery';
import { ProductPhotoGallery } from '@/components/products/ProductPhotoGallery';
import { ProductNavigation } from '@/components/products/ProductNavigation';
import { getProductFamilyBySlug } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
      
      <ProductNavigation sections={[]} />
      
      <ProductMainInfo
        name={productFamily.name}
        category="Drone Profissional"
        productCodes={productFamily.productCodes}
        description={productFamily.description}
      />
      
      <ProductKeyFeatures
        features={productFamily.keyFeatures}
        title={productFamily.name}
      />
      
      <ProductPhotoGallery
        photoGallery={productFamily.photoGallery}
        title={productFamily.name}
      />
      
      <ProductVideoGallery
        videos={productFamily.videos}
        title={productFamily.name}
      />
      
      <ProductTechnicalData
        technicalData={productFamily.technicalData}
        specs={currentVariant.specs}
        components={productFamily.components}
        accessoriesIncluded={productFamily.accessoriesIncluded}
        title={currentVariant.name}
      />
      
      <ProductApplications
        applications={productFamily.applications}
        title={productFamily.name}
      />
      
      <ProductDownloads
        downloads={downloads}
        title={productFamily.name}
      />
      <Footer />
    </div>
  );
};

export default EvoLiteEnterprise;
