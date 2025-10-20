import React, { useState } from 'react';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductNavigation } from '@/components/products/ProductNavigation';
import { ProductKeyFeatures } from '@/components/products/ProductKeyFeatures';
import { ProductTechnicalData } from '@/components/products/ProductTechnicalData';
import { ProductVintageVideoGallery } from '@/components/products/ProductVintageVideoGallery';
import { ProductPhotoGallery } from '@/components/products/ProductPhotoGallery';
import { ProductApplications } from '@/components/products/ProductApplications';
import { ProductDownloadSection } from '@/components/products/ProductDownloadSection';
import { getProductFamilyBySlug } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

  // Combine all images for the header
  const allImages = [
    ...productFamily.photoGallery.product,
    ...productFamily.photoGallery.lifestyle,
    ...productFamily.photoGallery.details
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <ProductNavigation sections={[]} />
      
      {/* Product Header - E-commerce Layout */}
      <ProductHeader
        name={productFamily.name}
        description={productFamily.description}
        productCodes={productFamily.productCodes}
        keyFeatures={productFamily.keyFeatures}
        images={allImages}
        category="Drone Profissional"
      />
      
      {/* Key Features Section */}
      <section id="key-features" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <ProductKeyFeatures
            features={productFamily.keyFeatures}
            title={productFamily.name}
          />
        </div>
      </section>
      
      {/* Photo Gallery Section */}
      <section id="photo-gallery" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ProductPhotoGallery
            photoGallery={productFamily.photoGallery}
            title={productFamily.name}
          />
        </div>
      </section>
      
      {/* Video Gallery Section */}
      <section id="video-gallery" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <ProductVintageVideoGallery
            videos={productFamily.videos}
            title={productFamily.name}
          />
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
      
      {/* Downloads Section */}
      <section id="downloads" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ProductDownloadSection
            downloads={downloads}
            title={productFamily.name}
          />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AutelAlpha;
