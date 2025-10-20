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

export default EvoLiteEnterprise;
