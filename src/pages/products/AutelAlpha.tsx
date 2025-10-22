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

  // Use only product images for the header
  const productImages = productFamily.photoGallery.product;

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
      <Header />
      
      <ProductStickyMenu items={menuItems} />
      
      {/* Product Header - E-commerce Layout */}
      <div id="product-description">
        <ProductHeader
          name={productFamily.name}
          description={productFamily.description}
          productCodes={productFamily.productCodes}
          keyFeatures={productFamily.keyFeatures}
          images={productImages}
          category="Drone Profissional"
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

export default AutelAlpha;
