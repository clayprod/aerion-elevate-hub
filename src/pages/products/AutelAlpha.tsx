import React, { useState } from 'react';
import { ProductHero } from '@/components/products/ProductHero';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductSpecs } from '@/components/products/ProductSpecs';
import { ProductDownloads } from '@/components/products/ProductDownloads';
import { ProductApplications } from '@/components/products/ProductApplications';
import { getProductFamilyBySlug } from '@/data/products';
import Header from '@/components/Header';

const AutelAlpha: React.FC = () => {
  const productFamily = getProductFamilyBySlug('autel-alpha');
  const [selectedVariant, setSelectedVariant] = useState('alpha');

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
      
      <ProductGallery
        images={productFamily.gallery}
        title={productFamily.name}
      />
      
      <ProductSpecs
        specs={currentVariant.specs}
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
    </div>
  );
};

export default AutelAlpha;
